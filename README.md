# 🎵 Ongaku - Music Activity Planner

<div align="center">
  
  **Feel the Music** | **音楽を感じる**
  
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16.0-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
  
  A bilingual, weather-aware music activity discovery platform that helps you find the perfect musical experiences based on real-time conditions.

  [Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api)

</div>

---

## ✨ Features

### 🌍 **Bilingual Support**
- Seamless switching between English and Japanese
- Complete UI translation
- Native voice recognition for both languages

### 🎤 **Voice-Powered Search**
- Natural language voice input
- Real-time speech recognition
- Fallback to text input

### 🌤️ **Weather Integration**
- Real-time weather data for major Japanese cities
- "Best Weather" city recommendations
- Weather-appropriate activity suggestions

### 🎭 **Smart Activity Discovery**
- AI-powered activity recommendations
- Personalized based on music preferences
- Venue, playlist, shopping, and café suggestions

### 📅 **Itinerary Planning**
- Multi-day trip planning (1-7 days)
- Hour-by-hour scheduling
- Weather-aware activity timing
- Cost estimates and tips

### 🎨 **Beautiful UI/UX**
- Professional dark/light mode
- Smooth animations with Framer Motion
- Responsive design for all devices
- Minimal, modern aesthetic

### 🎵 **Music Genre Preferences**
- Filter by Jazz, Rock, Pop, Classical, Electronic, Indie, Hip-Hop, Folk
- Tailored recommendations based on taste

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running

### Installation

```
# Clone the repository
git clone https://github.com/yourusername/ongaku-frontend.git
cd ongaku-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

The app will open at `http://localhost:3000`

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```
# API Configuration
REACT_APP_API_URL=http://localhost:5000
```

### Available Scripts

```
# Development
npm start          # Start dev server
npm run build      # Production build
npm test           # Run tests
npm run eject      # Eject from Create React App

# Linting
npm run lint       # Check code quality
npm run format     # Format code with Prettier
```

---

## 📁 Project Structure

```
ongaku-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ActivityCard.jsx
│   │   ├── ActivityList.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── CitySelector.jsx
│   │   ├── EnhancedLoadingSpinner.jsx
│   │   ├── ItineraryPlanner.jsx
│   │   ├── LanguageToggle.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── MusicPreferences.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── VoiceInput.jsx
│   │   ├── WeatherDisplay.jsx
│   │   └── WeatherSkeleton.jsx
│   ├── hooks/
│   │   ├── useLanguage.js
│   │   ├── useSpeechRecognition.js
│   │   └── useTheme.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── variables.css
│   │   ├── App.css
│   │   ├── animations.css
│   │   └── [component].css
│   ├── utils/
│   │   └── constants.js
│   ├── App.jsx
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🔌 API

### Endpoints Used

#### Weather
```
GET /api/weather?city={cityName}
```

#### Quick Suggestions
```
POST /api/suggest-quick
Content-Type: application/json

{
  "user_query": "Jazz concerts this weekend",
  "location": "Tokyo",
  "preferences": ["jazz", "live"],
  "language": "en"
}
```

#### Itinerary
```
POST /api/itinerary
Content-Type: application/json

{
  "location": "Tokyo",
  "duration_days": 3,
  "preferences": ["jazz", "classical"],
  "user_query": "Music lover's trip",
  "language": "en"
}
```

---

## 🎨 Theme Customization

Ongaku uses CSS variables for easy theming. Edit `src/styles/variables.css`:

```
:root {
  --color-primary-500: #22c55e;  /* Main brand color */
  --color-accent: #16a34a;        /* Accent color */
  /* ... more variables */
}

[data-theme="dark"] {
  --color-background: #1a1f2e;    /* Dark mode bg */
  /* ... dark mode overrides */
}
```

---

## 🛠️ Tech Stack

### Core
- **React 18.2** - UI Framework
- **Framer Motion 10.16** - Animation library
- **Axios** - HTTP client

### Development
- **Create React App** - Build tooling
- **ESLint** - Code linting
- **Prettier** - Code formatting

### APIs
- Web Speech API (Voice recognition)
- Weather API
- Custom backend API