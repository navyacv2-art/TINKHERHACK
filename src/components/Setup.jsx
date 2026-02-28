import React, { useState, useEffect } from 'react';
import { Save, UserPlus, Trash2, ShieldCheck, Mic, MapPin } from 'lucide-react';
import './Setup.css';

const Setup = ({ onBack }) => {
    const [contacts, setContacts] = useState([]);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [calcTrigger, setCalcTrigger] = useState('333');
    const [notesTrigger, setNotesTrigger] = useState('I am safe now');
    const [alertHistory, setAlertHistory] = useState([]);

    useEffect(() => {
        const savedContacts = localStorage.getItem('shesignal_contacts');
        if (savedContacts) {
            setContacts(JSON.parse(savedContacts));
        } else {
            // Default mock contacts
            const defaults = [
                { id: 1, name: 'Sister', phone: '+1234567890' },
                { id: 2, name: 'Mom', phone: '+0987654321' }
            ];
            setContacts(defaults);
            localStorage.setItem('shesignal_contacts', JSON.stringify(defaults));
        }

        const savedTrigger = localStorage.getItem('shesignal_calc_trigger');
        if (savedTrigger) {
            setCalcTrigger(savedTrigger);
        }

        const savedNotesTrigger = localStorage.getItem('shesignal_notes_trigger');
        if (savedNotesTrigger) {
            setNotesTrigger(savedNotesTrigger);
        }

        const savedHistory = localStorage.getItem('shesignal_alert_history');
        if (savedHistory) {
            setAlertHistory(JSON.parse(savedHistory));
        }
    }, []);

    const saveCalcTrigger = (val) => {
        setCalcTrigger(val);
        localStorage.setItem('shesignal_calc_trigger', val);
    };

    const saveNotesTrigger = (val) => {
        setNotesTrigger(val);
        localStorage.setItem('shesignal_notes_trigger', val);
    };

    const addContact = () => {
        if (newName && newPhone) {
            const updated = [...contacts, { id: Date.now(), name: newName, phone: newPhone }];
            setContacts(updated);
            localStorage.setItem('shesignal_contacts', JSON.stringify(updated));
            setNewName('');
            setNewPhone('');
        }
    };

    const removeContact = (id) => {
        const updated = contacts.filter(c => c.id !== id);
        setContacts(updated);
        localStorage.setItem('shesignal_contacts', JSON.stringify(updated));
    };

    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear all past alert history?')) {
            localStorage.removeItem('shesignal_alert_history');
            setAlertHistory([]);
        }
    };

    return (
        <div className="setup-container">
            <div className="setup-header">
                <ShieldCheck size={24} color="#ff4d4d" />
                <span>Emergency Setup</span>
                <button className="back-btn" onClick={onBack}>Done</button>
            </div>

            <div className="setup-content">
                <section className="setup-section">
                    <h3>Trusted Contacts</h3>
                    <p className="subtitle">These contacts will receive your live location during an alert.</p>

                    <div className="contacts-manage-list">
                        {contacts.map(c => (
                            <div key={c.id} className="manage-contact-item">
                                <div className="contact-details">
                                    <span className="contact-name">{c.name}</span>
                                    <span className="contact-phone">{c.phone}</span>
                                </div>
                                <button onClick={() => removeContact(c.id)} className="delete-btn">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="add-contact-form">
                        <input
                            type="text"
                            placeholder="Contact Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                        />
                        <button onClick={addContact} className="add-btn">
                            <UserPlus size={18} /> Add Contact
                        </button>
                    </div>
                </section>

                <section className="setup-section">
                    <h3>Secret Triggers</h3>
                    <div className="trigger-info">
                        <div className="trigger-edit-item">
                            <label>Calculator Secret Result:</label>
                            <input
                                type="text"
                                value={calcTrigger}
                                onChange={(e) => saveCalcTrigger(e.target.value)}
                                className="trigger-input"
                            />
                            <span className="tip">Enter this number followed by <strong>holding Equals for 1.5s</strong> to activate.</span>
                        </div>
                        <div className="trigger-edit-item">
                            <label>Notes Secret Phrase:</label>
                            <input
                                type="text"
                                value={notesTrigger}
                                onChange={(e) => saveNotesTrigger(e.target.value)}
                                className="trigger-input"
                                placeholder="e.g., I am safe now"
                            />
                            <span className="tip">Type this anywhere in the Notes app to activate.</span>
                        </div>
                        <div className="info-item">
                            <strong>Lock Screen:</strong> 2 wrong PIN attempts
                        </div>
                    </div>
                </section>

                <section className="setup-section">
                    <div className="section-header">
                        <h3>Past Alert History</h3>
                        {alertHistory.length > 0 && (
                            <button onClick={clearHistory} className="clear-btn">Clear All</button>
                        )}
                    </div>
                    <div className="setup-history-list">
                        {alertHistory.length > 0 ? (
                            alertHistory.map(alert => (
                                <div key={alert.id} className="setup-history-item border-alert">
                                    <div className="history-details">
                                        <span className="history-info">
                                            <strong>{alert.type}</strong> alert triggered
                                        </span>
                                        <span className="history-date">{alert.timestamp}</span>
                                        <div className="setup-history-meta">
                                            <span className={alert.audioActive ? 'meta-active' : 'meta-inactive'}>
                                                <Mic size={12} /> {alert.audioActive ? 'Audio' : 'No Audio'}
                                            </span>
                                            <span className={alert.locationCaptured ? 'meta-active' : 'meta-inactive'}>
                                                <MapPin size={12} /> {alert.locationCaptured ? 'Location' : 'No GPS'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="history-status">Sent</span>
                                </div>
                            ))
                        ) : (
                            <div className="no-history-setup">No alert history found.</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Setup;
