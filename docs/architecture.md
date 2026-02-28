# SheSignal System Architecture

```mermaid
graph TD
    User((User)) --> Home[Home Screen Disguise]
    Home --> Apps[App Grid / Widgets / Dock]
    Apps --> Calc[Calculator App]
    Apps --> Notes[Notes App]
    Apps --> Pin[Pin Lock Screen]
    
    Calc -- "Secret Code (e.g. 333) + Long Press =" --> EDB[Emergency Dashboard]
    Calc -- "SOS Code (e.g. 911) + Long Press =" --> SOS[High Danger SOS Mode]
    Notes -- "Secret Phrase" --> EDB
    Pin -- "2x Wrong PIN" --> EDB
    
    EDB --> Tracking[Live GPS Tracking]
    EDB --> Audio[Background Audio Recording]
    EDB --> Log[Real-time Activity Log]
    EDB --> Contacts[Notify Trusted Contacts]
    
    SOS --> Police[Simulate Police Notification]
    SOS --> Tracking
    SOS --> Audio
    
    Calc -- "Double Tap Display" --> Setup[Hidden Setup Screen]
    Setup --> Storage[(Local Storage)]
    Storage --> History[Alert History]
    Storage --> Config[Trigger Codes/Phrase]
    Storage --> ContactList[Trusted Contacts List]
```

## Component Overview

### Frontend (React/Vite)
- **`App.jsx`**: Main controller handling disguise switching and emergency states.
- **`HomeScreen.jsx`**: Realistic mobile UI mimicking a modern smartphone.
- **`Calculator.jsx`**: Primary disguise with logic-based triggers.
- **`EmergencyDashboard.jsx`**: High-availability dashboard for safety operations.
- **`Setup.jsx`**: Administrative interface for user configuration.

### Data Layer
- **Local Storage**: Secure, client-side persistence for sensitive configurations and alert history.
- **Geolocation API**: High-precision tracking.
- **MediaRecorder API**: Foreground/Background audio acquisition.
