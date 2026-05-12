import { getWeatherInfo } from "./weather-codes.js";
import { escapeHTML, formatDate, formatTime, round, windDirection } from "./utils.js";

export function setTheme(theme = "default") {
  document.body.dataset.weather = theme;
}

export function renderLoading(container, message) {
  container.classList.remove("is-empty");
  container.setAttribute("aria-busy", "true");
  container.innerHTML = `
    <div class="loading-state" role="status">
      <div>
        <div class="loader" aria-hidden="true"></div>
        <h2>${escapeHTML(message)}</h2>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>
  `;
}

export function renderError(container, title, message) {
  setTheme("default");
  container.classList.remove("is-empty");
  container.setAttribute("aria-busy", "false");
  container.innerHTML = `
    <div class="error-state" role="alert">
      <div>
        <span class="error-icon" aria-hidden="true">🌩️</span>
        <h2>${escapeHTML(title)}</h2>
        <p>${escapeHTML(message)}</p>
      </div>
    </div>
  `;
}

export function renderWeather(container, forecast, place) {
  const current = forecast.current;
  const weather = getWeatherInfo(current.weather_code, current.is_day);

  setTheme(weather.theme);
  container.classList.remove("is-empty");
  container.setAttribute("aria-busy", "false");
  container.innerHTML = weatherTemplate({ current, forecast, place, weather });
}

function weatherTemplate({ current, forecast, place, weather }) {
  const location = getLocationName(place);

  return `
    <article class="weather-current">
      <div class="weather-main">
        <div class="weather-icon" aria-hidden="true">${weather.icon}</div>
        <div>
          <h2 class="city-name">${escapeHTML(location)}</h2>
          <p class="weather-description">${weather.text}</p>
        </div>
      </div>

      <div class="temperature-row">
        <p class="temperature">${round(current.temperature_2m)}<sup>°C</sup></p>
        <p class="updated-at">Actualizado ${formatTime(current.time)}</p>
      </div>

      <div class="details-grid">
        ${detailCard("🥵", "Sensación", `${round(current.apparent_temperature)} °C`)}
        ${detailCard("💧", "Humedad", `${current.relative_humidity_2m}%`)}
        ${detailCard("💨", "Viento", `${round(current.wind_speed_10m)} km/h`)}
        ${detailCard("🧭", "Dirección", windDirection(current.wind_direction_10m))}
      </div>

      <h3 class="forecast-title">Pronóstico de 5 días</h3>
      <div class="forecast-grid">
        ${forecastTemplate(forecast.daily)}
      </div>
    </article>
  `;
}

function detailCard(icon, label, value) {
  return `
    <div class="detail-card">
      <p class="detail-label"><span aria-hidden="true">${icon}</span>${label}</p>
      <p class="detail-value">${value}</p>
    </div>
  `;
}

function forecastTemplate(daily) {
  return daily.time.map((date, index) => forecastDayTemplate(daily, date, index)).join("");
}

function forecastDayTemplate(daily, date, index) {
  const weather = getWeatherInfo(daily.weather_code[index], true);
  const max = round(daily.temperature_2m_max[index]);
  const min = round(daily.temperature_2m_min[index]);
  const rainChance = daily.precipitation_probability_max[index] ?? 0;

  return `
    <article class="forecast-day" title="${weather.text}">
      <time datetime="${date}">${formatDate(date)}</time>
      <span class="forecast-icon" aria-hidden="true">${weather.icon}</span>
      <strong>${max}° / ${min}°</strong>
      <small>💧 ${rainChance}%</small>
    </article>
  `;
}

function getLocationName(place) {
  return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
}
