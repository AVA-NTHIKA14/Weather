const weatherForm = document.querySelector(".weatherform");
const cityInput = document.querySelector(".cityInput");
const weatherDataCard = document.getElementById("weather-data");
const skeletonLoader = document.getElementById("loading-skeleton");
const errorContainer = document.querySelector(".errorContainer");
const geoBtn = document.querySelector(".geoBtn");
const tempToggle = document.querySelector(".tempToggle");

let apiKey = null;
let isCelsius = true;
let currentWeatherData = null;

async function loadApiKey() {
    try {
        const response = await fetch("/api/config");
        const data = await response.json();
        apiKey = data.apiKey;
    } catch (error) {
        console.error("Could not load API key:", error);
    }
}

loadApiKey();

weatherForm.addEventListener("submit", handleFormSubmit);
geoBtn.addEventListener("click", handleGeolocation);
tempToggle.addEventListener("change", toggleTemperature);

async function handleFormSubmit(event) {
    event.preventDefault();
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

    if (!navigator.geolocation) {
        displayError("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoordinates(latitude, longitude);
        },
        () => displayError("Unable to get your location. Please enable location services.")
    );
}

function toggleTemperature() {
    isCelsius = !isCelsius;
    if (currentWeatherData) displayWeatherInfo(currentWeatherData);
}

async function fetchAndDisplayWeather(city) {
    try {
        showLoading(true);
        clearError();
        const weatherData = await getWeatherData(city);
        currentWeatherData = weatherData;
        displayWeatherInfo(weatherData);
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
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Error fetching weather for your location");

        const weatherData = await response.json();
        currentWeatherData = weatherData;
        displayWeatherInfo(weatherData);
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoading(false);
    }
}

async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) throw new Error(`City "${city}" not found.`);
        if (response.status === 401) throw new Error("Invalid API key.");
        throw new Error("Unable to fetch weather.");
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
