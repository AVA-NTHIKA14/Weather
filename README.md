 Weather App

A responsive weather application built with Node.js/Express and vanilla JavaScript that provides real-time weather data and a 5-day forecast using the OpenWeather API.

##  Features

-  **Search Weather by City** - Enter any city name to view current weather conditions
- **Geolocation Support** - Get weather for your current location automatically
-  **Temperature Toggle** - Switch between Celsius (°C) and Fahrenheit (°F)
-  **5-Day Forecast** - View weather predictions for the next 5 days
-  **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
-  **Dynamic Styling** - Weather-based color themes (clear, cloudy, rainy, snowy, stormy)
-  **Fast & Smooth** - Skeleton loading states and smooth animations
-  **Secure API Key** - API key stored in environment variables

## Current Weather Details

- Temperature (current)
- Weather description
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Sunrise/Sunset times
- Weather emoji indicators

##  Quick Start

### Prerequisites
- Node.js 
- OpenWeatherMap API key (free at https://openweathermap.org/api)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Weather
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get an API Key**
   - Go to: https://openweathermap.org/api
   - Sign up for a free account
   - Copy your API key from the "API keys" section
   - Wait 10-15 minutes for the key to activate

4. **Create `.env` file** in the project root
   ```
   API_KEY=your_openweathermap_api_key_here
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open in browser**
   - Navigate to: `http://localhost:3000`

##  Project Structure

```
Weather/
├── public/
│   ├── index.html      # Main UI
│   ├── index.js        # Frontend logic
│   └── style.css       # Responsive styling
├── server.js           # Express server
├── package.json        # Dependencies
├── .env                # API key (git ignored)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

##  How to Use

### Search by City
1. Enter a city name in the search box (e.g., "London", "New York", "Tokyo")
2. Click **Search** or press Enter
3. View current weather and 5-day forecast

### Get Your Location Weather
1. Click **"Current Location Weather"** button
2. Allow location access when prompted by your browser
3. App displays weather for your current location

### Toggle Temperature Units
- Click the **°F** toggle to switch between Celsius and Fahrenheit
- Changes apply to both current weather and forecast

## 🔌 API Endpoints

### Backend Endpoints
- `GET /api/config` - Returns API configuration
- `GET /weather?city={cityName}` - Get weather for a specific city
- `GET /forecast?city={cityName}` - Get 5-day forecast for a city

### OpenWeatherMap API Used
- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-Day Forecast: `https://api.openweathermap.org/data/2.5/forecast`

## 🛠️ Technologies Used

**Backend:**
- Node.js
- Express.js
- Axios (HTTP requests)
- dotenv (Environment variables)

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- OpenWeatherMap API

**Tools:**
- npm (Package management)
- Git (Version control)

## 🎨 Design Features

- **Gradient Background** - Beautiful purple gradient
- **Glass Morphism** - Modern frosted glass effect on cards
- **Dynamic Themes** - Background changes based on weather:
  -  Clear/Sunny - Golden yellow
  -  Cloudy - Light blue-gray
  -  Rainy - Deep blue
  -  Snowy - Light cyan
  -  Stormy - Dark purple
- **Smooth Animations** - Fade-in, slide-up, bounce, and pop-in effects
- **Responsive Grid** - 5 columns (desktop), 3 columns (tablet), 2 columns (mobile)

##  Responsive Breakpoints

- **Desktop** (>768px) - Full features, 5-day forecast in 5 columns
- **Tablet** (768px and below) - Optimized layout, 3-day forecast columns
- **Mobile** (480px and below) - Single column, 2-day forecast columns

##  Security

- API key is stored in `.env` file (never committed to GitHub)
- `.gitignore` prevents `.env` from being tracked
- Environment variables loaded via `dotenv` package
- Sensitive configuration kept server-side

##  Troubleshooting

### "Invalid API key" Error
- Check your API key is correct
- Wait 10-15 minutes after creating the key (activation time)
-  Verify the key is marked as "Active" on OpenWeatherMap
-  Restart the server after updating `.env`

### "localhost refused to connect"
-  Ensure server is running: `npm start`
-  Check port 3000 is not in use
-  Verify no firewall is blocking localhost

### Geolocation Not Working
- Allow location access in browser settings
-  Ensure HTTPS on production (geolocation requires secure context)
-  Check browser geolocation is enabled

### Weather Data Not Loading
-  Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
-  Check browser console (F12) for errors
-  Verify internet connection
-  Ensure API key is valid and active

##  Scripts used

```bash
npm start    # Start the server on port 3000
npm install  # Install dependencies
```

##  Deploy

To deploy on platforms like Heroku, Vercel, or AWS:

1. Set environment variable `API_KEY` on your hosting platform
2. Ensure `node_modules` is in `.gitignore`
3. Deploy as usual (platform-specific instructions)

##  License

This project is open source and available for personal and educational use.

##  Contributing

Feel free to fork, modify, and improve this project!

##  Support

For issues or questions, please check:
- Browser console for error messages (F12)
- OpenWeatherMap API documentation: https://openweathermap.org/api



