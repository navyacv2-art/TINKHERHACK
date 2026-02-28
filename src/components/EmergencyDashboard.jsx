import React, { useState, useEffect, useRef } from 'react';
import { Shield, MapPin, Radio, Mic, Send, X, AlertTriangle, Users, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import './EmergencyDashboard.css';

const EmergencyDashboard = ({ onDeactivate, triggerSource }) => {
    const [location, setLocation] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState('Silent Alert Active');
    const [logs, setLogs] = useState(['Signal initiated silently...', 'Broadcasting GPS to trusted contacts...']);
    const [contacts, setContacts] = useState([]);
    const [shareLink, setShareLink] = useState('');
    const [alertHistory, setAlertHistory] = useState([]);
    const [currentAlertId, setCurrentAlertId] = useState(null);
    const isSOS = triggerSource === 'SOS_Police';

    useEffect(() => {
        // Load history and contacts from localStorage
        const savedHistory = localStorage.getItem('shesignal_alert_history');
        let history = savedHistory ? JSON.parse(savedHistory) : [];

        // Save current alert session if it's new
        if (triggerSource && !currentAlertId) {
            const newId = Date.now();
            const typeLabel = isSOS ? 'High Danger SOS' : triggerSource;
            const newAlert = {
                id: newId,
                timestamp: new Date().toLocaleString(),
                type: typeLabel,
                status: isSOS ? 'Police Notified' : 'Alert Sent',
                audioActive: false,
                locationCaptured: false,
                isSOS: isSOS
            };
            history = [newAlert, ...history].slice(0, 50);
            localStorage.setItem('shesignal_alert_history', JSON.stringify(history));
            setCurrentAlertId(newId);
        }
        setAlertHistory(history);

        const savedContacts = localStorage.getItem('shesignal_contacts');
        if (savedContacts) {
            const parsed = JSON.parse(savedContacts);
            setContacts(parsed.map(c => ({ ...c, status: 'Notified', lastSeen: 'Just now' })));
        }
    }, [triggerSource]);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    useEffect(() => {
        if (!currentAlertId) return;

        const updateHistoryMetadata = () => {
            const savedHistory = localStorage.getItem('shesignal_alert_history');
            if (savedHistory) {
                let history = JSON.parse(savedHistory);
                const index = history.findIndex(a => a.id === currentAlertId);
                if (index !== -1) {
                    history[index].locationCaptured = !!location;
                    history[index].audioActive = isRecording;
                    localStorage.setItem('shesignal_alert_history', JSON.stringify(history));
                    setAlertHistory(history);
                }
            }
        };

        updateHistoryMetadata();
    }, [location, isRecording, currentAlertId]);

    useEffect(() => {
        // 1. Silent GPS Tracking
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newLoc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setLocation(newLoc);
                setLogs(prev => [`Location shared: ${newLoc.lat.toFixed(4)}, ${newLoc.lng.toFixed(4)}`, ...prev.slice(0, 5)]);

                // Generate mock share link
                setShareLink(`https://maps.google.com/?q=${newLoc.lat},${newLoc.lng}&link=shesignal_secure`);

                // Simulate contacts receiving the update
                setContacts(prev => prev.map(c => ({
                    ...c,
                    status: 'Location Received',
                    lastSeen: 'Now'
                })));
            },
            (error) => {
                setLogs(prev => [`GPS Error: ${error.message}`, ...prev]);
            },
            { enableHighAccuracy: true }
        );

        // 2. Silent Audio Recording (Auto-start)
        startRecording();

        // 3. Mock "Cloud Upload" interval
        const uploadInterval = setInterval(() => {
            setLogs(prev => ['Encrypted data package uploaded to secure cloud.', ...prev.slice(0, 5)]);
        }, 10000);

        return () => {
            navigator.geolocation.clearWatch(watchId);
            stopRecording();
            clearInterval(uploadInterval);
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.start(5000); // Save every 5 seconds
            setIsRecording(true);
            setLogs(prev => ['Background audio recording started...', ...prev]);
        } catch (err) {
            setLogs(prev => ['Microphone access denied. Recording failed.', ...prev]);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="emergency-dashboard">
            <div className="safe-header">
                <Shield size={24} color="#ff4d4d" />
                <span>SHESIGNAL SECURE MODE</span>
                <button className="exit-btn" onClick={onDeactivate}>
                    <X size={20} />
                </button>
            </div>

            <div className="status-banner">
                <div className="pulse-dot"></div>
                <span>{status}</span>
            </div>

            <div className="dashboard-grid">
                <div className="card location-card">
                    <div className="card-header">
                        <MapPin size={18} />
                        <span>Live Location</span>
                    </div>
                    <div className="loc-data">
                        {location ? (
                            <>
                                <div className="coord">Lat: {location.lat.toFixed(6)}</div>
                                <div className="coord">Long: {location.lng.toFixed(6)}</div>
                                <div className="accuracy">Accuracy: High</div>
                            </>
                        ) : (
                            <div className="searching">Searching for satellites...</div>
                        )}
                    </div>
                </div>

                <div className="card pulse-card">
                    <div className="card-header">
                        <Mic size={18} />
                        <span>Audio Status</span>
                    </div>
                    <div className={`record-status ${isRecording ? 'active' : ''}`}>
                        {isRecording ? 'Capturing Audio...' : 'Standby'}
                    </div>
                    <div className="wave-container">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>

                <div className="card full-width">
                    <div className="card-header">
                        <ExternalLink size={18} />
                        <span>Live Share Link</span>
                    </div>
                    <div className="share-link-box">
                        <input type="text" readOnly value={shareLink || 'Generating link...'} />
                        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(shareLink)}>
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="contacts-section">
                <div className="card-header">
                    <Users size={18} />
                    <span>Live Sharing with Trusted Contacts</span>
                </div>
                <div className="contacts-list">
                    {contacts.map(contact => (
                        <div key={contact.id} className="contact-item">
                            <div className="contact-info">
                                <span className="contact-name">{contact.name}</span>
                                <span className="contact-status">
                                    {contact.status === 'Location Received' && <CheckCircle2 size={12} color="#00ff00" />}
                                    {contact.status}
                                </span>
                            </div>
                            <div className="contact-last-seen">{contact.lastSeen}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="activity-log">
                <div className="log-header">Real-time Activity</div>
                <div className="logs">
                    {logs.map((log, i) => (
                        <div key={i} className="log-item">{log}</div>
                    ))}
                </div>
            </div>

            <div className="history-section">
                <div className="card-header">
                    <Shield size={18} />
                    <span>Past Alert History</span>
                </div>
                <div className="history-list">
                    {alertHistory.length > 0 ? (
                        alertHistory.map(alert => (
                            <div key={alert.id} className="history-item">
                                <div className="history-main">
                                    <span className="history-type">{alert.type}</span>
                                    <span className="history-time">{alert.timestamp}</span>
                                    <div className="history-metadata">
                                        <div className={`meta-pill ${alert.audioActive ? 'active' : ''}`}>
                                            <Mic size={10} /> {alert.audioActive ? 'Audio ON' : 'Audio OFF'}
                                        </div>
                                        <div className={`meta-pill ${alert.locationCaptured ? 'active' : ''}`}>
                                            <MapPin size={10} /> {alert.locationCaptured ? 'GPS Fixed' : 'GPS Wait'}
                                        </div>
                                    </div>
                                </div>
                                <span className={`history-status ${alert.status.toLowerCase().replace(' ', '-')}`}>
                                    {alert.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="no-history">No past alerts recorded.</div>
                    )}
                </div>
            </div>

            <div className="action-footer">
                <div className="emergency-alert">
                    <AlertTriangle color="#ffcc00" size={24} />
                    <div className="alert-text">
                        <strong>Critical Alert</strong>
                        <span>All metadata is being synced.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyDashboard;
