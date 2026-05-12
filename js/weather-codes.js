const WEATHER_CODES = new Map([
  [0, { icon: "☀️", text: "cielo despejado", theme: "sunny" }],
  [1, { icon: "🌤️", text: "principalmente despejado", theme: "sunny" }],
  [2, { icon: "⛅", text: "parcialmente nublado", theme: "cloudy" }],
  [3, { icon: "☁️", text: "nublado", theme: "cloudy" }],
  [45, { icon: "🌫️", text: "niebla", theme: "foggy" }],
  [48, { icon: "🌫️", text: "niebla con escarcha", theme: "foggy" }],
  [51, { icon: "🌦️", text: "llovizna ligera", theme: "rainy" }],
  [53, { icon: "🌦️", text: "llovizna moderada", theme: "rainy" }],
  [55, { icon: "🌧️", text: "llovizna intensa", theme: "rainy" }],
  [56, { icon: "🌧️", text: "llovizna helada ligera", theme: "rainy" }],
  [57, { icon: "🌧️", text: "llovizna helada intensa", theme: "rainy" }],
  [61, { icon: "🌧️", text: "lluvia ligera", theme: "rainy" }],
  [63, { icon: "🌧️", text: "lluvia moderada", theme: "rainy" }],
  [65, { icon: "🌧️", text: "lluvia intensa", theme: "rainy" }],
  [66, { icon: "🌧️", text: "lluvia helada ligera", theme: "rainy" }],
  [67, { icon: "🌧️", text: "lluvia helada intensa", theme: "rainy" }],
  [71, { icon: "🌨️", text: "nieve ligera", theme: "snowy" }],
  [73, { icon: "🌨️", text: "nieve moderada", theme: "snowy" }],
  [75, { icon: "❄️", text: "nieve intensa", theme: "snowy" }],
  [77, { icon: "❄️", text: "granos de nieve", theme: "snowy" }],
  [80, { icon: "🌦️", text: "chubascos ligeros", theme: "rainy" }],
  [81, { icon: "🌧️", text: "chubascos moderados", theme: "rainy" }],
  [82, { icon: "⛈️", text: "chubascos fuertes", theme: "stormy" }],
  [85, { icon: "🌨️", text: "chubascos de nieve ligeros", theme: "snowy" }],
  [86, { icon: "❄️", text: "chubascos de nieve fuertes", theme: "snowy" }],
  [95, { icon: "⛈️", text: "tormenta", theme: "stormy" }],
  [96, { icon: "⛈️", text: "tormenta con granizo ligero", theme: "stormy" }],
  [99, { icon: "⛈️", text: "tormenta con granizo fuerte", theme: "stormy" }]
]);

const DEFAULT_WEATHER = Object.freeze({ icon: "🌍", text: "clima variable", theme: "default" });
const NIGHT_CODES = new Set([0, 1, 2]);

export function getWeatherInfo(code, isDay = true) {
  const normalizedCode = Number(code);
  const weather = WEATHER_CODES.get(normalizedCode) ?? DEFAULT_WEATHER;

  if (!Boolean(isDay) && NIGHT_CODES.has(normalizedCode)) {
    return {
      ...weather,
      icon: normalizedCode === 0 ? "🌙" : "☁️",
      theme: "night"
    };
  }

  return weather;
}
