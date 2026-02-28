import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator, FileText, Map, Cloud, Phone, MessageSquare, Camera, Settings,
    Wifi, Battery, Signal, Instagram, Twitter, Mail, Music, Image, ShoppingBag,
    Folder, Clock, Heart, Wallet, Bell, Calendar as CalendarIcon, TrendingUp, Users,
    MessageCircle, Play, Facebook, Youtube, Video
} from 'lucide-react';
import './HomeScreen.css';

const HomeScreen = ({ onOpenApp }) => {
    const [page, setPage] = useState(1);
    const constraintsRef = React.useRef(null);
    const apps = [
        // Page 0: Today View (Widgets)
        { isWidgets: true },
        // Page 1: Main Apps
        [
            { id: 'phone', name: 'Phone', icon: <Phone size={32} />, color: '#4CD964' },
            { id: 'messages', name: 'Messages', icon: <MessageSquare size={32} />, color: '#007AFF' },
            { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle size={32} />, color: '#25D366' },
            { id: 'instagram', name: 'Instagram', icon: <Instagram size={32} />, color: '#E1306C' },
            { id: 'maps', name: 'Maps', icon: <Map size={32} />, color: '#4285F4' },
            { id: 'weather', name: 'Weather', icon: <Cloud size={32} />, color: '#00A1FF' },
            { id: 'calculator', name: 'Calculator', icon: <Calculator size={32} />, color: '#FF9500' },
            { id: 'notes', name: 'Notes', icon: <FileText size={32} />, color: '#FFCC00' },
        ],
        [
            { id: 'camera', name: 'Camera', icon: <Camera size={32} />, color: '#8E8E93' },
            { id: 'photos', name: 'Photos', icon: <Image size={32} />, color: '#FF9500' },
            { id: 'settings', name: 'Settings', icon: <Settings size={32} />, color: '#555' },
            { id: 'mail', name: 'Mail', icon: <Mail size={32} />, color: '#007AFF' },
            { id: 'music', name: 'Music', icon: <Music size={32} />, color: '#FE2C55' },
            { id: 'youtube', name: 'YouTube', icon: <Youtube size={32} />, color: '#FF0000' },
            { id: 'netflix', name: 'Netflix', icon: <Play size={32} />, color: '#E50914' },
            { id: 'facebook', name: 'Facebook', icon: <Facebook size={32} />, color: '#1877F2' },
        ],
        [
            { id: 'twitter', name: 'X', icon: <Twitter size={32} />, color: '#1a1a1a' },
            { id: 'appstore', name: 'App Store', icon: <ShoppingBag size={32} />, color: '#007AFF' },
            { id: 'files', name: 'Files', icon: <Folder size={32} />, color: '#007AFF' },
            { id: 'clock', name: 'Clock', icon: <Clock size={32} />, color: '#1a1a1a' },
            { id: 'health', name: 'Health', icon: <Heart size={32} />, color: '#FF2D55' },
            { id: 'wallet', name: 'Wallet', icon: <Wallet size={32} />, color: '#1a1a1a' },
            { id: 'zoom', name: 'Zoom', icon: <Video size={32} />, color: '#2D8CFF' },
            { id: 'stocks', name: 'Stocks', icon: <TrendingUp size={32} />, color: '#4CD964' },
            { id: 'contacts', name: 'Contacts', icon: <Users size={32} />, color: '#007AFF' },
        ]
    ];

    const paginate = (newDirection) => {
        const nextPage = page + newDirection;
        if (nextPage >= 0 && nextPage < apps.length) {
            setPage(nextPage);
        }
    };

    return (
        <div className="home-screen" style={{ backgroundImage: 'url("/wallpaper_v2.png")', backgroundSize: 'cover' }}>
            <div className="status-bar">
                <span className="time">9:41</span>
                <div className="status-icons">
                    <Signal size={14} />
                    <Wifi size={14} />
                    <Battery size={14} />
                </div>
            </div>

            <div className="home-content-wrapper" ref={constraintsRef}>
                <motion.div
                    className="pages-track"
                    drag="x"
                    dragConstraints={constraintsRef}
                    dragElastic={0.1}
                    dragMomentum={false}
                    animate={{ x: `-${(page * 100) / apps.length}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onDragEnd={(e, info) => {
                        const swipeThreshold = 50;
                        if (info.offset.x < -swipeThreshold && page < apps.length - 1) {
                            setPage(page + 1);
                        } else if (info.offset.x > swipeThreshold && page > 0) {
                            setPage(page - 1);
                        }
                    }}
                >
                    {apps.map((pageData, i) => (
                        <div key={i} className="app-page">
                            {pageData.isWidgets ? (
                                <div className="widgets-container">
                                    <div className="widget weather-widget">
                                        <div className="widget-header"><Cloud size={16} /> Weather</div>
                                        <div className="widget-content">
                                            <span className="temp">24°</span>
                                            <span className="condition">Mostly Sunny</span>
                                        </div>
                                    </div>
                                    <div className="widget battery-widget">
                                        <div className="widget-header"><Battery size={16} /> Battery</div>
                                        <div className="widget-content">
                                            <div className="battery-level">84%</div>
                                            <div className="battery-bar"><div className="fill" style={{ width: '84%' }}></div></div>
                                        </div>
                                    </div>
                                    <div className="widget calendar-widget">
                                        <div className="widget-header"><CalendarIcon size={16} /> Up Next</div>
                                        <div className="widget-content">
                                            <div className="event">Meeting with Team</div>
                                            <div className="event-time">2:00 PM - 3:30 PM</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="app-grid">
                                    {pageData.map(app => (
                                        <div key={app.id} className="app-icon-wrapper" onClick={() => onOpenApp(app.id)}>
                                            <div className="app-icon" style={{ backgroundColor: app.color }}>
                                                {app.icon}
                                            </div>
                                            <span className="app-name">{app.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>

                <div className="page-indicators">
                    {apps.map((_, i) => (
                        <div key={i} className={`dot ${i === page ? 'active' : ''} `} />
                    ))}
                </div>
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
