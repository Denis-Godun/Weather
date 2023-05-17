function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  let lati = position.coords.latitude;
  let loni = position.coords.longitude;

  const GEO_API = `https://api.geoapify.com/v1/geocode/reverse?lang=ru&lat=${lati}&lon=${loni}&apiKey=84e61ddd819c4e07b10468ea4382d82b`;
  fetch(GEO_API)
    .then((response) => response.json())
    .then((data) => {
      let myData = data.features[0].properties.city;
      getCityData(myData);
      getWeather(myData);
    });
}
getCityData = (data) => {
  console.log(data);
  let city = document.querySelector(".main-data__city");
  city.textContent = data;
};
getLocation();

function getWeather(city) {
  const apiKey = "c1013406c3f6800cf6818bc474abeb88";
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ru&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      weather = data;
      weatherData(weather);
    })
    .catch((error) => {
      // Обработка ошибок
      console.log(error);
    });
}

function weatherData(data) {
  let nowWeather = data.list[0];
  console.log(nowWeather);
  document.querySelector(".main-data__temperature").textContent = `${Math.round(
    nowWeather.main.temp
  )} °C`;
  document.getElementById("wind-speed").textContent = `${Math.round(
    nowWeather.wind.speed
  )} м/с`;
  document.getElementById(
    "air-humidity"
  ).textContent = `${nowWeather.main.humidity} %`;
  const firstKey = Object.keys(nowWeather.rain)[0];
const firstValue = nowWeather.rain[firstKey];
  document.getElementById("rainfall").textContent = `${firstValue} мм`;

  console.log(data);
}
