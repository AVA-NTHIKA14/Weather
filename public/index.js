const weatherForm = document.querySelector(".weatherform");
const cityInput = document.querySelector(".cityInput");
const weatherDataCard = document.getElementById("weather-data");
const skeletonLoader = document.getElementById("loading-skeleton");
const errorContainer = document.querySelector(".errorContainer");
const geoBtn = document.querySelector(".geoBtn");
const tempToggle = document.querySelector(".tempToggle");
const forecastSection = document.getElementById("forecast-section");
const forecastContainer = document.getElementById("forecast-data");

let apiKey = null;
let isCelsius = true;
let currentWeatherData = null;
let currentForecastData = null;
let apiKeyLoaded = false;

async function loadApiKey() {
    try {
        const response = await fetch("/api/config");
        const data = await response.json();
        apiKey = data.apiKey;
        apiKeyLoaded = true;
    } catch (error) {
        console.error("Could not load API key:", error);
        displayError("Failed to load API configuration. Please refresh the page.");
    }
}


loadApiKey();

weatherForm.addEventListener("submit", handleFormSubmit);
geoBtn.addEventListener("click", handleGeolocation);
tempToggle.addEventListener("change", toggleTemperature);

async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!apiKeyLoaded) {
        displayError("API key is still loading. Please try again in a moment.");
        return;
    }

    const city = cityInput.value.trim();

    if (!city) {
        displayError("Please enter a city name");
        return;
    }

    if (!/^[a-zA-Z\s\-']+$/.test(city)) {
        displayError("Please enter a valid city name (letters only)");
        return;
    }

    await fetchAndDisplayWeather(city);
}

async function handleGeolocation(event) {
    event.preventDefault();

    if (!apiKeyLoaded) {
        displayError("API key is still loading. Please try again in a moment.");
        return;
    }

    if (!navigator.geolocation) {
        displayError("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                displayError("Location permission denied. Please enable location access in your browser settings.");
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                displayError("Unable to determine your location. Please try again.");
            } else if (error.code === error.TIMEOUT) {
                displayError("Location request timed out. Please try again.");
            } else {
                displayError("Unable to get your location. Please enable location services.");
            }
        }
    );
}

function toggleTemperature() {
    isCelsius = !isCelsius;
    if (currentWeatherData) displayWeatherInfo(currentWeatherData);
    if (currentForecastData) displayForecast(currentForecastData);
}

async function fetchAndDisplayWeather(city) {
    try {
        showLoading(true);
        clearError();
        const weatherData = await getWeatherData(city);
        currentWeatherData = weatherData;
        displayWeatherInfo(weatherData);
        
        
        const forecastData = await getForecastData(city);
        currentForecastData = forecastData;
        displayForecast(forecastData);
        
        cityInput.value = "";
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoading(false);
    }
}

async function fetchWeatherByCoordinates(lat, lon) {
    try {
        showLoading(true);
        clearError();

        if (!apiKey) {
            throw new Error("API key not available. Please refresh the page.");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 401) throw new Error("Invalid API key. Please check your configuration.");
            if (response.status === 429) throw new Error("Too many requests. Please try again later.");
            throw new Error("Error fetching weather for your location");
        }

        const weatherData = await response.json();
        currentWeatherData = weatherData;
        displayWeatherInfo(weatherData);
        
         const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (!forecastResponse.ok) throw new Error("Error fetching forecast for your location");
        
        const forecastData = await forecastResponse.json();
        currentForecastData = forecastData;
        displayForecast(forecastData);
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoading(false);
    }
}

async function getWeatherData(city) {
    if (!apiKey) throw new Error("API key not available. Please refresh the page.");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) throw new Error(`City "${city}" not found.`);
        if (response.status === 401) throw new Error("Invalid API key. Please check your configuration.");
        if (response.status === 429) throw new Error("Too many requests. Please try again later.");
        throw new Error("Unable to fetch weather.");
    }

    return await response.json();
}

async function getForecastData(city) {
    if (!apiKey) throw new Error("API key not available. Please refresh the page.");

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) throw new Error(`Forecast for "${city}" not found.`);
        if (response.status === 401) throw new Error("Invalid API key. Please check your configuration.");
        if (response.status === 429) throw new Error("Too many requests. Please try again later.");
        throw new Error("Unable to fetch forecast.");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const { name, main, weather, wind, sys } = data;

    let temp = main.temp;
    if (!isCelsius) temp = (temp * 9) / 5 + 32;

    const { description, id } = weather[0];
    const tempUnit = isCelsius ? "°C" : "°F";

    skeletonLoader.style.display = "none";
    weatherDataCard.style.display = "block";

    let weatherClass = "clear";
    if (id >= 200 && id < 300) weatherClass = "storm";
    else if (id >= 300 && id < 600) weatherClass = "rain";
    else if (id >= 600 && id < 700) weatherClass = "snow";
    else if (id >= 700 && id < 800) weatherClass = "mist";
    else if (id > 800) weatherClass = "clouds";

    weatherDataCard.className = "card " + weatherClass;

    weatherDataCard.innerHTML = `
        <h2 class="cityDisplay fade-in-up">${name}</h2>
        <p class="tempDisplay fade-in-up">${Math.round(temp)}${tempUnit}</p>
        <p class="desDisplay fade-in-up">${description}</p>
        <p class="weatherEmoji pop-in-icon">${getWeatherEmoji(id)}</p>

        <div class="weatherDetails fade-in-up">
            <div class="detailItem">
                <div class="detailLabel">Humidity</div>
                <div class="detailValue">${main.humidity}%</div>
            </div>
            <div class="detailItem">
                <div class="detailLabel">Wind</div>
                <div class="detailValue">${wind.speed.toFixed(1)} m/s</div>
            </div>
            <div class="detailItem">
                <div class="detailLabel">Pressure</div>
                <div class="detailValue">${main.pressure} hPa</div>
            </div>
            <div class="detailItem">
                <div class="detailLabel">Sunrise/Sunset</div>
                <div class="detailValue">${formatTime(sys.sunrise)} / ${formatTime(sys.sunset)}</div>
            </div>
        </div>
    `;
}

function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function displayForecast(data) {
    if (!data.list || data.list.length === 0) {
        forecastSection.style.display = "none";
        return;
    }

    // Group forecast by day (one forecast per day at noon if available)
    const forecastByDay = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        // Get forecast at noon (12:00), or closest time to noon
        if (!forecastByDay[day] || Math.abs(date.getHours() - 12) < Math.abs(new Date(forecastByDay[day].dt * 1000).getHours() - 12)) {
            forecastByDay[day] = item;
        }
    });

    // Convert object to array and take first 5 days
    const dailyForecasts = Object.values(forecastByDay).slice(0, 5);

    let forecastHTML = '';
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const temp = isCelsius ? Math.round(forecast.main.temp) : Math.round((forecast.main.temp * 9/5) + 32);
        const tempUnit = isCelsius ? '°C' : '°F';
        const weatherIcon = getWeatherEmoji(forecast.weather[0].id);
        const description = forecast.weather[0].main;

        forecastHTML += `
            <div class="forecastCard">
                <div class="forecastDay">${day}</div>
                <div class="forecastIcon">${weatherIcon}</div>
                <div class="forecastTemp">${temp}${tempUnit}</div>
                <div class="forecastDescription">${description}</div>
                <div class="forecastDetails">
                    <span class="forecastDetail"><strong>💧</strong> ${forecast.main.humidity}%</span>
                    <span class="forecastDetail"><strong>💨</strong> ${forecast.wind.speed.toFixed(1)}m/s</span>
                </div>
            </div>
        `;
    });

    forecastContainer.innerHTML = forecastHTML;
    forecastSection.style.display = "block";
}

function getWeatherEmoji(id) {
    if (id >= 200 && id < 300) return "⛈️";
    if (id >= 300 && id < 600) return "🌧️";
    if (id >= 600 && id < 700) return "❄️";
    if (id >= 700 && id < 800) return "🌫️";
    if (id === 800) return "☀️";
    if (id > 800) return "☁️";
    return "❓";
}

function displayError(message) {
    errorContainer.innerHTML = `<p class="errorDisplay">${message}</p>`;
    weatherDataCard.style.display = "none";
    forecastSection.style.display = "none";
    skeletonLoader.style.display = "none";
}

function clearError() {
    errorContainer.innerHTML = "";
}

function showLoading(show) {
    if (show) {
        skeletonLoader.style.display = "block";
        weatherDataCard.style.display = "none";
    } else {
        skeletonLoader.style.display = "none";
    }
}
