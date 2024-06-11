const apiKey = '584c39a75024e99ded83aeec5c4fcbd6'; // Replace with your actual API key

// DOM Elements
const cityForm = document.querySelector('#city-form');
const cityInput = document.querySelector('#city-input');
const historyEl = document.querySelector('#history');
const currentWeatherEl = document.querySelector('#current-weather');
const forecastEl = document.querySelector('#forecast');

// Event listener for form submission
cityForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    saveCityToHistory(city);
    cityInput.value = '';
  }
});

// Fetch weather data
function fetchWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
    .then(response => response.ok ? response.json() : Promise.reject('City not found'))
    .then(data => {
      const { lat, lon } = data.coord;
      displayCurrentWeather(data);
      fetchForecastData(lat, lon);
    })
    .catch(error => {
      alert(error);
    });
}

// Fetch forecast data
function fetchForecastData(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      alert('Error fetching forecast data');
    });
}

// Display current weather
function displayCurrentWeather(data) {
  const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const currentWeatherHtml = `
    <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
    <img src="${weatherIcon}" alt="${data.weather[0].description}">
    <p>Temperature: ${data.main.temp} °F</p>
    <p>Wind: ${data.wind.speed} MPH</p>
    <p>Humidity: ${data.main.humidity} %</p>
  `;
  currentWeatherEl.innerHTML = currentWeatherHtml;
}

// Display forecast
function displayForecast(data) {
  forecastEl.innerHTML = '';
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const forecastDate = new Date(forecast.dt_txt).toLocaleDateString();
    const weatherIcon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
    const forecastHtml = `
      <div class="forecast-item">
        <h3>${forecastDate}</h3>
        <img src="${weatherIcon}" alt="${forecast.weather[0].description}">
        <p>Temp: ${forecast.main.temp} °F</p>
        <p>Wind: ${forecast.wind.speed} MPH</p>
        <p>Humidity: ${forecast.main.humidity} %</p>
      </div>
    `;
    forecastEl.innerHTML += forecastHtml;
  }
}

// Save city to search history
function saveCityToHistory(city) {
  let cities = JSON.parse(localStorage.getItem('cities')) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
    renderHistory();
  }
}

// Render search history
function renderHistory() {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  historyEl.innerHTML = '';
  cities.forEach(city => {
    const cityBtn = document.createElement('button');
    cityBtn.textContent = city;
    cityBtn.classList.add('history-btn');
    cityBtn.addEventListener('click', () => fetchWeatherData(city));
    historyEl.appendChild(cityBtn);
  });
}

// Load search history on page load
document.addEventListener('DOMContentLoaded', renderHistory);
