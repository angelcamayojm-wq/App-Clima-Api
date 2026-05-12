import { APP_CONFIG, WEATHER_PARAMS } from "./config.js";
import { buildUrl } from "./utils.js";

export async function searchCity(city, { signal } = {}) {
  const url = buildUrl(APP_CONFIG.endpoints.geocoding, {
    name: city,
    count: 1,
    language: "es",
    format: "json"
  });

  const data = await fetchJson(url, {
    signal,
    errorMessage: "El servicio de búsqueda de ciudades no respondió bien."
  });

  if (!data.results?.length) {
    throw new Error(`No encontré una ciudad llamada "${city}". Revisa la escritura e intenta de nuevo.`);
  }

  return data.results[0];
}

export async function getForecast({ latitude, longitude }, { signal } = {}) {
  const url = buildUrl(APP_CONFIG.endpoints.forecast, {
    latitude,
    longitude,
    current: WEATHER_PARAMS.current,
    daily: WEATHER_PARAMS.daily,
    timezone: "auto",
    forecast_days: APP_CONFIG.forecastDays
  });

  return fetchJson(url, {
    signal,
    errorMessage: "El servicio del clima no respondió. Puede ser conexión o la API tomando cafecito."
  });
}

async function fetchJson(url, { signal, errorMessage }) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}
