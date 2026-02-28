import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Calculator from './components/Calculator.jsx'
import Notes from './components/Notes.jsx'
import PinLock from './components/PinLock.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import Setup from './components/Setup.jsx'
import EmergencyDashboard from './components/EmergencyDashboard.jsx'
import './App.css'

function App() {
    const [isEmergencyMode, setIsEmergencyMode] = useState(false)
    const [isSetupMode, setIsSetupMode] = useState(false)
    const [disguise, setDisguise] = useState('home') // 'home', 'calculator', 'notes', 'pin'

    // Secret trigger handler
    const handleTrigger = (type) => {
        setIsEmergencyMode(true)
        // Play a very subtle tactile feedback if possible
        if (navigator.vibrate) {
            navigator.vibrate([10, 30, 10])
        }
    }

    const handleDeactivate = () => {
        setIsEmergencyMode(false)
    }

    return (
        <div className="app-container">


            <AnimatePresence mode="wait">
                {isSetupMode ? (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="screen-wrapper"
                    >
                        <Setup onBack={() => setIsSetupMode(false)} />
                    </motion.div>
                ) : !isEmergencyMode ? (
                    <motion.div
                        key={disguise}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="screen-wrapper"
                    >
                        {disguise === 'home' && (
                            <HomeScreen
                                onOpenApp={(appId) => setDisguise(appId)}
                            />
                        )}
                        {disguise === 'calculator' && (
                            <Calculator
                                onTrigger={handleTrigger}
                                onOpenSetup={() => setIsSetupMode(true)}
                            />
                        )}
                        {disguise === 'notes' && <Notes onTrigger={handleTrigger} />}
                        {disguise === 'pin' && <PinLock onTrigger={handleTrigger} />}

                        {/* Hidden Home Button for navigation */}
                        {disguise !== 'home' && (
                            <div
                                className="home-indicator"
                                onClick={() => setDisguise('home')}
                                title="Back to Home"
                            ></div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="emergency"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="screen-wrapper"
                    >
                        <EmergencyDashboard onDeactivate={handleDeactivate} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle indicator only visible to user who knows where to look */}
            {!isEmergencyMode && (
                <div className="hidden-indicator" onClick={() => console.log('Secret backdoor')}></div>
            )}
        </div>
    )
}

export default App
