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
      getDayData(myData);
    });
}
getCityData = (data) => {
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
  let rainfall = document.getElementById("rainfall");

  if (nowWeather.rain) {
    const firstKey = Object.keys(nowWeather.rain)[0];
    if (typeof firstKey !== "undefined") {
      const firstValue = nowWeather.rain[firstKey];
      rainfall.textContent = `${firstValue} мм`;
    } else {
      rainfall.textContent = "Без осадков";
    }
  } else {
    rainfall.textContent = "Без осадков";
  }
}

function getDayData(city) {
  const apiKey = "076bcf111ff04827b46625e186673128";
  const apiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&days=6&lang=ru&key=${apiKey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      let days = data;
      dayData(days);
    })
    .catch((error) => {
      // Обработка ошибок
      console.log(error);
    });
}

function dayData(days) {
  const daysOfWeek = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  let oneDayTitle = document.querySelectorAll(".week-data__title");
  let oneDayTemperature = document.querySelectorAll(
    ".week-data__temperature-day"
  );
  let iconifyWeek = document.querySelectorAll(".iconify-week");
  console.log(days.data);
  let daysData = days.data;
  for (let i = 0; i < daysData.length - 1; i++) {
    const date = new Date(daysData[i + 1].datetime);
    const dayOfWeek = daysOfWeek[date.getDay()];
    oneDayTemperature[i].textContent = `${Math.round(
      daysData[i + 1].app_max_temp
    )} °`;
    oneDayTitle[i].textContent = dayOfWeek;
    console.log(daysData[i].weather.code);
    switch (daysData[i].weather.code) {
      case 800:
        iconifyWeek[i].setAttribute("data-icon", "twemoji:sun");
        break;
      case 801:
      case 802:
        iconifyWeek[i].setAttribute("data-icon", "twemoji:cloud");
        break;
      case 803:
        iconifyWeek[i].setAttribute(
          "data-icon",
          "twemoji:sun-behind-rain-cloud"
        );
        break;
      case 200:
        iconifyWeek[i].setAttribute("data-icon", "cloud-with-lightning");
        break;
      case 500:
      case 501:
      case 502:
      case 520:
      case 521:
      case 522:
        iconifyWeek[i].setAttribute("data-icon", "twemoji:cloud-with-rain");
        break;
      case 600:
      case 601:
      case 602:
      case 611:
      case 612:
        iconifyWeek[i].setAttribute("data-icon", "twemoji:cloud-with-snow");
        break;
      case 701:
      case 741:
      case 711:
      case 721:
        iconifyWeek[i].setAttribute("data-icon", "twemoji:fog");
        break;
      case 751:
      case 761:
        iconifyWeek[i].setAttribute("data-icon", "game-icons:sandstorm");
        break;
    }
  }
}
