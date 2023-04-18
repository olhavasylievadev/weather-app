function searchCity(event) {
    event.preventDefault();
    let cityName = document.querySelector("#my-city");
    cityName = cityName.value;

    if (cityName.length > 0) {
        axios.get(`${apiUrl}query=${cityName}&key=${apiKey}&units=${unitsCel}`).then(updateCity);
    } else {
        event.preventDefault();
        alert("Please, enter your city");
    }
}

function formatDate(timestamp) {
    let currentDate = new Date(timestamp);

    let hour = currentDate.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }

    let minute = currentDate.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let today = week[currentDate.getDay()];

    return `${today} ${hour}:${minute}`
}

function getForecast(coords) {
    console.log(coords)
    let apiForecast = `https://api.shecodes.io/weather/v1/forecast?lon=${coords.longitude}&lat=${coords.latitude}&key=${apiKey}&units=${unitsCel}`;
    axios.get(apiForecast).then(displayForecast);
}

function updateCity(response) {
    let currentCity = document.querySelector("h1");
    let currentTemperature = document.querySelector("#temperature");
    let realFeel = document.querySelector("#real-feel strong");
    let humidity = document.querySelector("#humidity strong");
    let wind = document.querySelector("#wind-speed strong");
    let description = document.querySelector("#weather-is");
    let currentDate = document.querySelector("#date");
    let weatherIcon = document.querySelector("#icon")

    celsiusTemp = Math.round(response.data.temperature.current);

    console.log(response.data)

    currentCity.innerHTML = response.data.city;
    currentTemperature.innerHTML = Math.round(response.data.temperature.current);
    realFeel.innerHTML = `${Math.round(response.data.temperature.feels_like)}°C`;
    humidity.innerHTML = `${response.data.temperature.humidity}%`;
    wind.innerHTML = `${Math.round(response.data.wind.speed)}km/h`;
    description.innerHTML = response.data.condition.description;
    currentDate.innerHTML = formatDate(response.data.time * 1000);
    weatherIcon.setAttribute("src", `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`)
    weatherIcon.setAttribute("alt", `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.description}.png`)

    getForecast(response.data.coordinates);
}

function updateLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(updateGeo);
}

function updateGeo(location) {
    let lat = location.coords.latitude;
    let lon = location.coords.longitude;

    axios.get(`${apiUrl}lon=${lon}&lat=${lat}&key=${apiKey}&units=${unitsCel}`).then(updateCity);
}

function convertToFar(event) {
    event.preventDefault();
    let fahTemp = (celsiusTemp * 9) / 5 + 32;
    let temperature = document.querySelector("#temperature");
    temperature.innerHTML = Math.round(fahTemp);
    temperatureCel.classList.remove("active");
    temperatureFar.classList.add("active");
}

function convertToCel(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temperature");
    temperature.innerHTML = celsiusTemp;
    temperatureFar.classList.remove("active");
    temperatureCel.classList.add("active");
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return week[day];
}

function displayForecast(response) {
    console.log(response.data)
    let dailyForecast = response.data.daily;
    let forecast = document.querySelector("#forecast");

    let forecastHTML = `<div class="row">`;
    dailyForecast.forEach(function (forecastDay, index) {
        if (index < 5) {
            forecastHTML =
                forecastHTML +
                `
      <div class="col">
        <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
        <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                    forecastDay.condition.icon
                }.png"
          alt="rain-day"
          width=""
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"><strong> ${Math.round(
                    forecastDay.temperature.maximum
                )}° / </strong></span>
          <span class="weather-forecast-temperature-min">${Math.round(
                    forecastDay.temperature.minimum
                )}° </span>
        </div>
      </div>
  `;
        }
    });

    forecastHTML = forecastHTML + `</div>`;
    forecast.innerHTML = forecastHTML;
}

let apiKey = "06fa5f0c173ae8o9ctd4134fb2530e34";
let apiUrl = "https://api.shecodes.io/weather/v1/current?";
let unitsCel = "metric";

let celsiusTemp = null;

let newCity = document.querySelector(".d-flex")
newCity.addEventListener("submit", searchCity);

let myLocation = document.querySelector("#my-location")
myLocation.addEventListener("click", updateLocation)

let temperatureCel = document.querySelector(".units");
let temperatureFar = document.querySelector(".imperial");

temperatureFar.addEventListener("click", convertToFar);

temperatureCel.addEventListener("click", convertToCel);