# Emergency Alert System

A mobile application built with React Native (Expo) and Flask for handling emergency alerts at IIM Bodh Gaya.

## Features

- Faculty can send emergency alerts with their location
- Security personnel can view and acknowledge alerts
- Real-time alert notifications with sound
- Location tracking and mapping
- Alert history with acknowledgment status

## Tech Stack

### Frontend
- React Native (Expo)
- React Navigation
- AsyncStorage for data persistence
- Expo Location for GPS
- React Native Maps
- Expo AV for sound alerts

### Backend
- Flask
- SQLite database
- JWT for authentication
- SQLAlchemy ORM
- PyTZ for timezone handling

## Setup

### Backend Setup
1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install flask flask-sqlalchemy flask-cors pyjwt pytz werkzeug
```

3. Run the server:
```bash
python app.py
```

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Update the API URL in config.js with your server IP address

3. Start the Expo development server:
```bash
npx expo start
```

## Environment Setup
- Ensure both devices (development machine and mobile device) are on the same network
- Update the API_URL in config.js to match your development machine's IP address
- Install Expo Go on your mobile device for testing

## Project Structure
```
project/
├── frontend/
│   ├── components/
│   │   ├── FacultyHomeScreen.js
│   │   ├── SecurityHomeScreen.js
│   │   └── AlertMap.js
│   ├── styles.js
│   ├── config.js
│   └── App.js
└── backend/
    ├── app.py
    └── instance/
        └── emergency.db
```

## Authors
- Sumedh Shelke

## License
This project is licensed under the MIT License - see the LICENSE file for details
