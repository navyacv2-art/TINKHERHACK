import React, { useState } from 'react';
import './PinLock.css';

const PinLock = ({ onTrigger }) => {
    const [pin, setPin] = useState('');
    const [attempts, setAttempts] = useState(0);
    const correctPin = '1234'; // Dummy PIN

    const handleNumber = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);

            if (newPin.length === 4) {
                if (newPin === correctPin) {
                    // Success (Dummy)
                    alert('Unlocked');
                    setPin('');
                    setAttempts(0);
                } else {
                    // Failure
                    const newAttempts = attempts + 1;
                    setAttempts(newAttempts);
                    setPin('');

                    if (newAttempts >= 2) {
                        onTrigger('pin_trigger');
                    }
                }
            }
        }
    };

    const clear = () => {
        setPin('');
    };

    return (
        <div className="pin-lock-container">
            <div className="pin-status">
                <div className="pin-dots">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''}`}></div>
                    ))}
                </div>
                <div className="pin-message">Enter PIN</div>
            </div>
            <div className="pin-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Cancel', 0, 'Delete'].map((btn, i) => (
                    <button
                        key={i}
                        className={`pin-btn ${typeof btn === 'string' ? 'utility' : ''}`}
                        onClick={() => {
                            if (typeof btn === 'number') handleNumber(btn);
                            else if (btn === 'Delete') setPin(pin.slice(0, -1));
                            else if (btn === 'Cancel') setPin('');
                        }}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PinLock;
