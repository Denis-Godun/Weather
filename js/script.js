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
  console.log(days.data);
  let daysData = days.data;
  for (let i = 0; i < daysData.length - 1; i++) {
    const date = new Date(daysData[i + 1].datetime);
    const dayOfWeek = daysOfWeek[date.getDay()];
    console.log(dayOfWeek);
    console.log(daysData[i]);
    console.log(oneDayTitle[i]);
    oneDayTemperature[i].textContent = `${Math.round(
      daysData[i + 1].app_max_temp
    )} °`;
    oneDayTitle[i].textContent = dayOfWeek;
  }
}

// const dateStr = "2023-05-22";
// const date = new Date(dateStr);
// const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
// const dayOfWeek = daysOfWeek[date.getDay()];

// console.log(`День недели: ${dayOfWeek}`);
