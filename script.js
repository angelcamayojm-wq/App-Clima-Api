const inputCiudad = document.getElementById("inputCiudad");
const btnBuscar = document.getElementById("btnBuscar");
const resultado = document.getElementById("resultado");

const apiKey = "15e81241dc1a2c9cd032fb7471896c20";

btnBuscar.addEventListener("click", async function () {
  const ciudad = inputCiudad.value.trim();

  if (ciudad === "") {
    alert("Escribe una ciudad");
    return;
  }

  resultado.innerHTML = "";
  resultado.innerHTML = "Cargando... ⏳";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    const respuesta = await fetch(url);
    const data = await respuesta.json();

    if (data.cod !== 200) {
      resultado.innerHTML = `Error: ${data.message}`;
      return;
    }

    let icono = "🌍";
let fondo = "#f4f4f4";

let climaTexto = data.weather[0].description.toLowerCase();

if (data.weather[0].main === "Clear") {
  icono = "☀️";
  fondo = "#FFD54F";
} else if (data.weather[0].main === "Clouds") {
  icono = "☁️";
  fondo = "#90A4AE";
} else if (data.weather[0].main === "Rain") {
  icono = "🌧️";
  fondo = "#4FC3F7";
} else if (data.weather[0].main === "Thunderstorm") {
  icono = "⛈️";
  fondo = "#616161";
} else if (data.weather[0].main === "Snow") {
  icono = "❄️";
  fondo = "#E1F5FE";
}

if (climaTexto === "clear sky") {
  climaTexto = "cielo despejado";
} else if (climaTexto === "few clouds") {
  climaTexto = "pocas nubes";
} else if (climaTexto === "scattered clouds") {
  climaTexto = "nubes dispersas";
} else if (climaTexto === "broken clouds") {
  climaTexto = "nublado";
} else if (climaTexto === "overcast clouds") {
  climaTexto = "muy nuboso";
} else if (climaTexto === "light rain") {
  climaTexto = "lluvia ligera";
} else if (climaTexto === "moderate rain") {
  climaTexto = "lluvia moderada";
} else if (climaTexto === "thunderstorm") {
  climaTexto = "tormenta";
}

document.body.style.backgroundColor = fondo;

    resultado.innerHTML = `
      <h2>${icono} ${data.name}</h2>
      <p>🌡️ Temperatura: ${data.main.temp} °C</p>
      <p>☁️ Clima: ${data.weather[0].description}</p>
      <p>💧 Humedad: ${data.main.humidity}%</p>
    `;
  } catch (error) {
    resultado.innerHTML = "Error al obtener datos 😓";
    console.log(error);
  }
});

inputCiudad.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    btnBuscar.click();
  }
});