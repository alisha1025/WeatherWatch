// scripts.js

const apiKey = https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const cityInput = document.getElementById('cityInput');
    const currentWeatherElement = document.getElementById('currentWeather');
    const forecastElement = document.getElementById('forecast');
    const historyList = document.getElementById('historyList');

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    });

    // Event listener for search history
    historyList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            fetchWeatherData(event.target.textContent);
        }
    });

    // Fetch weather data
    async function fetchWeatherData(city) {
        // Get coordinates for the city
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            alert('City not found!');
            return;
        }

        const { lat, lon, name } = geoData[0];

        // Fetch current weather data
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();

        const { weather, main, wind } = currentWeatherData;
        const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
        const currentWeatherHtml = `
            <h2>${name} - Current Weather</h2>
            <img src="${weatherIcon}" alt="${weather[0].description}" />
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Temperature: ${main.temp}°C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} m/s</p>
        `;
        currentWeatherElement.innerHTML = currentWeatherHtml;

        // Fetch 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=40`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        const forecastHtml = `
            <h2>${name} - 5-Day Forecast</h2>
            ${forecastData.list.filter((item, index) => index % 8 === 0).map
