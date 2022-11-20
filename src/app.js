function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  let hours = date.getHours();
  if (hours <= 9) {
    hours = "0" + hours;
  }
  let minutes = date.getMinutes();
  if (minutes <= 9) {
    minutes = "0" + minutes;
  }
  return `${day} ${hours}:${minutes}`;
}

function searchSubmit(event) {
  event.preventDefault();

  let searchCityElement = document.querySelector("#search-city");
  let city = searchCityElement.value;
  searchCity(city);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showAll);
}

function currentSubmit(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(showCurrent);
}

function showCurrent(response) {
  let latitude = response.coords.latitude;
  let longitude = response.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&&units=metric`;
  //console.log(apiUrl);
  axios.get(apiUrl).then(showAll);
}

function showAll(response) {
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  let temperature = Math.round(Number(response.data.main.temp));
  currentGradCtemperature = temperature;
  let gradElement = document.querySelector("#grad");
  gradElement.innerHTML = `${temperature}`;

  let weatherMainElement = document.querySelector("#wather-main");
  weatherMainElement.innerHTML = response.data.weather[0].main;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `Wind: ${response.data.wind.speed} km/h`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function getForecast(coord) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
           
            <div class="col-2">
              <div class="weather-forecast-date">${formatDay(
                forecastDay.dt
              )}</div>

              <img src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" alt="${
          forecastDay.weather[0].description
        }" width="36" />
              <div class="weather-forecast-temperature">
                <span class="weather-forecast-temperature-max">${Math.round(
                  forecastDay.temp.max
                )}°</span>
                <span class="weather-forecast-temperature-min">${Math.round(
                  forecastDay.temp.max
                )}°</span>
              </div>
            </div>
          `;
    }
  });

  forecastElement.innerHTML = forecastHTML + `</div>`;
}

let dateElement = document.querySelector("#date");
dateElement.innerHTML = formatDate(new Date());

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchSubmit);

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", currentSubmit);

let apiKey = "a710bd8bd76400c9658ef649d9e81728";

searchCity("Kyiv");
