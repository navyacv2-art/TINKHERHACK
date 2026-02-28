import React, { useState, useRef } from 'react';
import './Calculator.css';

const Calculator = ({ onTrigger, onOpenSetup }) => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [isNewNumber, setIsNewNumber] = useState(true);
    const longPressTimer = useRef(null);
    const LONG_PRESS_DURATION = 1500; // 1.5 seconds

    const handleNumber = (num) => {
        if (isNewNumber || display === '0') {
            setDisplay(num);
            setIsNewNumber(false);
        } else {
            setDisplay(display + num);
        }
    };

    const handleOperator = (op) => {
        setEquation(display + ' ' + op + ' ');
        setIsNewNumber(true);
    };

    const calculate = () => {
        try {
            const fullEquation = equation + display;
            const result = new Function('return ' + fullEquation.replace('×', '*').replace('÷', '/'))();
            const resultStr = String(result);
            setDisplay(resultStr);
            setEquation('');
            setIsNewNumber(true);
            return resultStr;
        } catch (error) {
            setDisplay('Error');
            setEquation('');
            setIsNewNumber(true);
            return null;
        }
    };

    const handleEqualsStart = () => {
        const result = calculate();
        const savedTrigger = localStorage.getItem('shesignal_calc_trigger') || '333';

        if (result === savedTrigger) {
            longPressTimer.current = setTimeout(() => {
                onTrigger(savedTrigger);
                // Vibrate for feedback
                if (navigator.vibrate) navigator.vibrate(100);
            }, LONG_PRESS_DURATION);
        }
    };

    const handleEqualsEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const clear = () => {
        setDisplay('0');
        setEquation('');
        setIsNewNumber(true);
    };

    const buttons = [
        { label: 'C', action: clear, type: 'utility' },
        { label: '+/-', type: 'utility' },
        { label: '%', type: 'utility' },
        { label: '÷', action: () => handleOperator('/'), type: 'operator' },
        { label: '7', action: () => handleNumber('7') },
        { label: '8', action: () => handleNumber('8') },
        { label: '9', action: () => handleNumber('9') },
        { label: '×', action: () => handleOperator('*'), type: 'operator' },
        { label: '4', action: () => handleNumber('4') },
        { label: '5', action: () => handleNumber('5') },
        { label: '6', action: () => handleNumber('6') },
        { label: '-', action: () => handleOperator('-'), type: 'operator' },
        { label: '1', action: () => handleNumber('1') },
        { label: '2', action: () => handleNumber('2') },
        { label: '3', action: () => handleNumber('3') },
        { label: '+', action: () => handleOperator('+'), type: 'operator' },
        { label: '0', action: () => handleNumber('0'), wide: true },
        { label: '.', action: () => handleNumber('.') },
        {
            label: '=',
            type: 'operator',
            onMouseDown: handleEqualsStart,
            onMouseUp: handleEqualsEnd,
            onMouseLeave: handleEqualsEnd,
            onTouchStart: handleEqualsStart,
            onTouchEnd: handleEqualsEnd
        },
    ];

    return (
        <div className="calculator">
            <div className="calculator-display" onDoubleClick={onOpenSetup}>
                <div className="equation">{equation}</div>
                <div className="current">{display}</div>
            </div>
            <div className="calculator-grid">
                {buttons.map((btn, i) => (
                    <button
                        key={i}
                        className={`calc-btn ${btn.type || ''} ${btn.wide ? 'wide' : ''}`}
                        onClick={btn.action}
                        onMouseDown={btn.onMouseDown}
                        onMouseUp={btn.onMouseUp}
                        onMouseLeave={btn.onMouseLeave}
                        onTouchStart={btn.onTouchStart}
                        onTouchEnd={btn.onTouchEnd}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
