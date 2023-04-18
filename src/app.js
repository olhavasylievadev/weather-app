function searchCity(event) {
    event.preventDefault();
    let cityName = document.querySelector("#my-city");
    cityName = cityName.value;

    if (cityName.length > 0) {
        axios.get(`${apiUrl}q=${cityName}&appid=${apiKey}&units=${unitsCel}`).then(updateCity);
    } else {
        event.preventDefault();
        alert("Please, enter your city");
    }
}

function updateCity(response) {
    let currentCity = document.querySelector("h1");
    let currentTemperature = document.querySelector("#temperature");
    let realFeel = document.querySelector("#real-feel strong");
    let humidity = document.querySelector("#humidity strong");
    let wind = document.querySelector("#wind-speed strong");

    console.log(response.data)

    currentCity.innerHTML = response.data.name;
    currentTemperature.innerHTML = Math.round(response.data.main.temp);
    realFeel.innerHTML = `${Math.round(response.data.main.feels_like)}°C`;
    humidity.innerHTML = `${response.data.main.humidity}%`;
    wind.innerHTML = `${response.data.wind.speed} km/h`;
}

function updateLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(updateGeo);
}

function updateGeo(location) {
    let lat = location.coords.latitude;
    let lon = location.coords.longitude;

    axios.get(`${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unitsCel}`).then(updateCity);
}

function convertToFar(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temperature");
    temperature.innerHTML = "52";
}

function convertToCel(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temperature");
    temperature.innerHTML = "13";
}

let apiKey = "8402ccd9e55983fce71eeeaa1d2bd1fc";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
let unitsCel = "metric";

let currentDate = new Date();
let today = currentDate.getDay();
let hour = currentDate.getHours();
if (hour < 10) {
    hour = `0${hour}`;
}
let minute = currentDate.getMinutes();
if (minute < 10) {
    minute = `0${minute}`
}
let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let myDate = document.querySelector("#date");
myDate.innerHTML = (`${week[today]} ${hour}:${minute}`);

let newCity = document.querySelector(".d-flex")
newCity.addEventListener("submit", searchCity);

let myLocation = document.querySelector("#my-location")
myLocation.addEventListener("click", updateLocation)

let temperatureCel = document.querySelector("#celsius");
let temperatureFar = document.querySelector("#fahrenheit");

temperatureFar.addEventListener("click", convertToFar);

temperatureCel.addEventListener("click", convertToCel);