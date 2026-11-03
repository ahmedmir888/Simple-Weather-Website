const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const weatherCard = document.querySelector(".weather-card");
const weatherContent = document.querySelector(".weather-content");
const cityName = document.querySelector(".city-name span");
const temperature = document.querySelector(".temperature span");
const weatherCondition = document.querySelector(".weather-condition span");
const windInfo = document.querySelector(".wind-info span");
const humidityInfo = document.querySelector(".humidity-info span");
const messageBox = document.querySelector(".message-box");
const weatherImg = document.querySelector(".weather-img");
const loading = document.querySelector(".loading");

searchButton.onclick = function () {
  const city = searchInput.value.trim();
  if (city !== "") {
    getWeather(city);
  } else {
    updateUiState("empty");
  }
  searchInput.value = "";
};

async function getWeather(city) {
  updateUiState("loading");
  try {
    const data = await fetchWeather(city);
    const weatherMain = data.weather[0].main;
    weatherCondition.textContent = weatherMain;
    // Image Function
    updateWeatherImage(weatherMain);
    // Text Function
    updateWeatherData(data);

    updateUiState("success");
  } catch (error) {
    updateUiState("error");
    if (error.message === "city not found") {
      messageBox.textContent = "Please enter the city name correctly.";
    } else if (error.message === "Failed to fetch") {
      messageBox.textContent = "Please check your internet connection.";
    } else {
      messageBox.textContent =
        "404 (Not Found) Please enter a valid city name.";
    }
  } finally {
    loading.style.display = "none";
  }
}

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d7a3df2265dbd72a86370fc88efcb48a&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

function updateWeatherImage(weatherMain) {
  switch (weatherMain) {
    case "Clear":
      weatherImg.src = "imgs/Clear.png";
      break;
    case "Clouds":
      weatherImg.src = "imgs/Clouds.png";
      break;
    case "Rain":
      weatherImg.src = "imgs/Rain.png";
      break;
    case "Snow":
      weatherImg.src = "imgs/Snow.png";
      break;
    case "Mist":
      weatherImg.src = "imgs/Rain.png";
      break;
    case "Thunderstorm":
      weatherImg.src = "imgs/Thunderstorm.png";
      break;
    case "Drizzle":
      weatherImg.src = "imgs/Drizzle.png";
      break;
    default:
      weatherImg.src = "imgs/Clouds.png";
  }
}

function updateWeatherData(data) {
  cityName.textContent = data.name;
  temperature.textContent = ` ${data.main.temp.toFixed(1)}°`;
  windInfo.textContent = `${data.wind.speed} m/s`;
  humidityInfo.textContent = `${data.main.humidity}%`;
}

function updateUiState(state) {
  if (state === "loading") {
    weatherCard.style.display = "flex";
    weatherContent.style.display = "none";
    loading.style.display = "flex";
  } else if (state === "success") {
    weatherContent.style.display = "flex";
    messageBox.style.display = "none";
  } else if (state === "error") {
    weatherCard.style.display = "none";
    messageBox.style.display = "flex";
  } else {
    weatherCard.style.display = "none";
    messageBox.style.display = "flex";
    messageBox.textContent = "Please enter a city name.";
  }
}

window.onload = function () {
  searchInput.focus();
};
