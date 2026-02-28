import React, { useState, useEffect } from 'react';
import './Notes.css';

const Notes = ({ onTrigger }) => {
    const [content, setContent] = useState('');
    const [secretPhrase, setSecretPhrase] = useState('I am safe now');

    useEffect(() => {
        const savedTrigger = localStorage.getItem('shesignal_notes_trigger');
        if (savedTrigger) {
            setSecretPhrase(savedTrigger);
        }
    }, []);

    useEffect(() => {
        if (content.toLowerCase().includes(secretPhrase.toLowerCase()) && secretPhrase.length > 0) {
            onTrigger('notes_trigger');
        }
    }, [content, secretPhrase, onTrigger]);

    return (
        <div className="notes-container">
            <div className="notes-header">
                <span>All Notes</span>
                <span className="save-indicator">Saved</span>
            </div>
            <div className="notes-textarea-wrapper">
                <textarea
                    className="notes-textarea"
                    placeholder="Start typing your note here..."
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
        </div>
    );
};

export default Notes;
