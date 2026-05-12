import { APP_CONFIG } from "./config.js";
import { getForecast, searchCity } from "./weather-api.js";
import { $, $$, getReadableError } from "./utils.js";
import { renderError, renderLoading, renderWeather } from "./ui.js";

const state = {
  requestController: null
};

const elements = {
  form: $("#formBusqueda"),
  input: $("#inputCiudad"),
  result: $("#resultado"),
  searchButton: $("#btnBuscar"),
  locationButton: $("#btnUbicacion"),
  chips: $$(".chip")
};

window.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  elements.form.addEventListener("submit", handleSubmit);
  elements.locationButton.addEventListener("click", handleLocationSearch);
  elements.chips.forEach((chip) => chip.addEventListener("click", () => handleChipClick(chip)));

  elements.input.value = APP_CONFIG.defaultCity;
  handleCitySearch(APP_CONFIG.defaultCity);
}

function handleSubmit(event) {
  event.preventDefault();
  handleCitySearch(elements.input.value.trim());
}

function handleChipClick(chip) {
  const city = chip.dataset.city;
  elements.input.value = city;
  handleCitySearch(city);
}

async function handleCitySearch(city) {
  if (!city) {
    renderError(
      elements.result,
      "Escribe una ciudad",
      "Necesito una ciudad para consultar el clima. Mi bola de cristal está en mantenimiento."
    );
    return;
  }

  const controller = resetRequestController();
  renderLoading(elements.result, `Buscando clima en ${city}`);
  setControlsDisabled(true);

  try {
    const place = await searchCity(city, { signal: controller.signal });
    const forecast = await getForecast(place, { signal: controller.signal });
    renderWeather(elements.result, forecast, place);
  } catch (error) {
    const message = getReadableError(error, "No pude obtener el clima.");
    if (message) renderError(elements.result, "No pude obtener el clima", message);
  } finally {
    if (state.requestController === controller) setControlsDisabled(false);
  }
}

async function handleLocationSearch() {
  if (!navigator.geolocation) {
    renderError(elements.result, "Ubicación no disponible", "Tu navegador no soporta geolocalización.");
    return;
  }

  const controller = resetRequestController();
  renderLoading(elements.result, "Detectando tu ubicación");
  setControlsDisabled(true);

  try {
    const { coords } = await getCurrentPosition(APP_CONFIG.geolocationOptions);
    const place = createGpsPlace(coords);
    const forecast = await getForecast(place, { signal: controller.signal });
    renderWeather(elements.result, forecast, place);
  } catch (error) {
    const message = error?.code ? getGeolocationErrorMessage(error) : getReadableError(error, "No pude leer tu clima.");
    if (message) renderError(elements.result, "No pude leer tu ubicación", message);
  } finally {
    if (state.requestController === controller) setControlsDisabled(false);
  }
}

function resetRequestController() {
  state.requestController?.abort();
  state.requestController = new AbortController();
  return state.requestController;
}

function setControlsDisabled(isDisabled) {
  elements.searchButton.disabled = isDisabled;
  elements.locationButton.disabled = isDisabled;
  elements.chips.forEach((chip) => {
    chip.disabled = isDisabled;
  });
}

function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function createGpsPlace({ latitude, longitude }) {
  return {
    name: "Tu ubicación",
    country: "GPS",
    latitude,
    longitude
  };
}

function getGeolocationErrorMessage(error) {
  const messages = {
    1: "Permiso denegado. Activa la ubicación o escribe una ciudad manualmente.",
    2: "No pude detectar tu posición. Revisa el GPS o intenta escribir una ciudad.",
    3: "La ubicación tardó demasiado. El GPS se fue por empanadas."
  };

  return messages[error.code] ?? "No pude detectar tu ubicación.";
}
