import { APP_CONFIG } from "./config.js";

const HTML_ESCAPES = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;"
});

export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

export function buildUrl(baseUrl, params = {}) {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    const formattedValue = Array.isArray(value) ? value.join(",") : String(value);
    url.searchParams.set(key, formattedValue);
  });

  return url;
}

export function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => HTML_ESCAPES[character]);
}

export function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat(APP_CONFIG.locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...options
  }).format(new Date(`${value}T00:00:00`));
}

export function formatTime(value, options = {}) {
  return new Intl.DateTimeFormat(APP_CONFIG.locale, {
    hour: "2-digit",
    minute: "2-digit",
    ...options
  }).format(new Date(value));
}

export function round(value) {
  return Math.round(Number(value));
}

export function windDirection(degrees = 0) {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const index = Math.round(Number(degrees) / 45) % directions.length;
  return directions[index];
}

export function getReadableError(error, fallbackMessage) {
  if (error?.name === "AbortError") return "";
  return error?.message || fallbackMessage;
}
