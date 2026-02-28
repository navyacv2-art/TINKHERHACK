import React from 'react';
import { Calculator, FileText, Map, Cloud, Phone, MessageSquare, Camera, Settings } from 'lucide-react';
import './HomeScreen.css';

const HomeScreen = ({ onOpenApp }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const apps = [
        { id: 'maps', name: 'Maps', icon: <Map size={32} />, color: '#4285F4' },
        { id: 'weather', name: 'Weather', icon: <Cloud size={32} />, color: '#00A1FF' },
        { id: 'calculator', name: 'Calculator', icon: <Calculator size={32} />, color: '#FF9500' },
        { id: 'notes', name: 'Notes', icon: <FileText size={32} />, color: '#FFCC00' },
        { id: 'phone', name: 'Phone', icon: <Phone size={32} />, color: '#4CD964' },
        { id: 'messages', name: 'Messages', icon: <MessageSquare size={32} />, color: '#007AFF' },
        { id: 'camera', name: 'Camera', icon: <Camera size={32} />, color: '#8E8E93' },
        { id: 'settings', name: 'Settings', icon: <Settings size={32} />, color: '#555' },
    ];

    return (
        <div className="home-screen">
            <div className="status-bar">
                <span className="time">{formatTime(currentTime)}</span>
                <div className="status-icons">
                    <span>📶</span>
                    <span>🔋</span>
                </div>
            </div>

            <div className="app-grid">
                {apps.map(app => (
                    <div key={app.id} className="app-icon-wrapper" onClick={() => onOpenApp(app.id)}>
                        <div className="app-icon" style={{ backgroundColor: app.color }}>
                            {app.icon}
                        </div>
                        <span className="app-name">{app.name}</span>
                    </div>
                ))}
            </div>

            <div className="dock">
                <div className="dock-icon" style={{ backgroundColor: '#4CD964' }}><Phone size={24} color="white" /></div>
                <div className="dock-icon" style={{ backgroundColor: '#007AFF' }}><MessageSquare size={24} color="white" /></div>
                <div className="dock-icon" style={{ backgroundColor: '#FF9500' }} onClick={() => onOpenApp('calculator')}><Calculator size={24} color="white" /></div>
            </div>
        </div>
    );
};

export default HomeScreen;
