// Your OpenWeather API key (remember to secure this in production)
const apiKey = '6765d5c874c5fa77f2345c854dc9cf0e';

// Helper function to convert 24-hour time to 12-hour format with AM/PM
function formatTime(hour24, minutes) {
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Display current weather details in the widget
function displayCurrentWeather(data) {
  const widget = document.getElementById('weatherWidget');
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  widget.innerHTML = `
    <div class="weather-details">
      <h2>${data.name}</h2>
      <img src="${iconUrl}" alt="Weather icon" class="weather-icon">
      <p><strong>Temperature:</strong> ${data.main.temp}°F</p>
      <p><strong>Condition:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} mph</p>
    </div>
  `;
}

// Fetch current weather by city name
function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found or API error');
      }
      return response.json();
    })
    .then(data => {
      displayCurrentWeather(data);
      fetchForecastByCity(city);
    })
    .catch(error => {
      document.getElementById('weatherWidget').innerHTML = `<p style="color: var(--error-color);">${error.message}</p>`;
      document.getElementById('forecastWidget').innerHTML = "";
    });
}

// Fetch current weather by geographic coordinates
function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Location not found or API error');
      }
      return response.json();
    })
    .then(data => {
      displayCurrentWeather(data);
      fetchForecastByCoords(lat, lon);
    })
    .catch(error => {
      document.getElementById('weatherWidget').innerHTML = `<p style="color: var(--error-color);">${error.message}</p>`;
      document.getElementById('forecastWidget').innerHTML = "";
    });
}

// Fetch forecast by city name
function fetchForecastByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
  fetchForecast(url);
}

// Fetch forecast by geographic coordinates
function fetchForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetchForecast(url);
}

// Common function to fetch and display forecast until midnight
function fetchForecast(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Forecast not available');
      }
      return response.json();
    })
    .then(forecastData => {
      const forecastWidget = document.getElementById('forecastWidget');
      const tzOffset = forecastData.city.timezone; // seconds offset
      const nowUTC = Math.floor(Date.now() / 1000);
      const cityLocalNow = new Date((nowUTC + tzOffset) * 1000);
      const localYear = cityLocalNow.getUTCFullYear();
      const localMonth = cityLocalNow.getUTCMonth();
      const localDate = cityLocalNow.getUTCDate();
      
      let forecastHTML = `<h3>Forecast For The Day</h3>`;
      // Filter forecast items for later today only
      const todayForecasts = forecastData.list.filter(item => {
        const localTime = new Date((item.dt + tzOffset) * 1000);
        return (
          localTime.getUTCFullYear() === localYear &&
          localTime.getUTCMonth() === localMonth &&
          localTime.getUTCDate() === localDate &&
          localTime.getTime() > cityLocalNow.getTime()
        );
      });
      
      if (todayForecasts.length === 0) {
        forecastHTML += `<p>No forecast data available for later today.</p>`;
      } else {
        todayForecasts.forEach(item => {
          const localTime = new Date((item.dt + tzOffset) * 1000);
          const hours = localTime.getUTCHours();
          const minutes = localTime.getUTCMinutes();
          const timeStr = formatTime(hours, minutes);
          const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
          forecastHTML += `
            <div class="forecast-item">
              <div class="forecast-time">${timeStr}</div>
              <div class="forecast-details">
                <img src="${iconUrl}" alt="icon">
                <span>${item.main.temp}°F, ${item.weather[0].description}</span>
              </div>
            </div>
          `;
        });
      }
      forecastWidget.innerHTML = forecastHTML;
    })
    .catch(error => {
      document.getElementById('forecastWidget').innerHTML = `<p style="color: var(--error-color);">${error.message}</p>`;
    });
}

// Event listeners for user interactions
document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('citySelect').value;
  fetchWeather(city);
});
document.getElementById('getLocationWeatherBtn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        fetchWeatherByCoords(lat, lon);
      },
      () => {
        alert("Unable to retrieve your location. Please enable location services.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// On page load, fetch weather for the default city
window.addEventListener('load', () => {
  fetchWeather(document.getElementById('citySelect').value);
});