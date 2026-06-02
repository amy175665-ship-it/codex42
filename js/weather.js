const clockElement = document.getElementById("clock");
const weatherElement = document.getElementById("weather-info");

const WEATHER_API_KEY = "879be6633aa90d15165bf84e6de8391d";
const WEATHER_CITY = "Seoul";
const WEATHER_CITY_LABEL = "서울";

function formatDateTime(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function updateClock() {
  if (!clockElement) {
    return;
  }

  clockElement.innerHTML = `
    <strong>현재 시간</strong>
    <span>${formatDateTime(new Date())}</span>
  `;
}

async function loadWeather() {
  if (!weatherElement) {
    return;
  }

  if (!WEATHER_API_KEY) {
    weatherElement.innerHTML = `
      <strong>날씨</strong>
      <span>날씨 API 키를 연결하면 현재 날씨가 표시됩니다.</span>
    `;
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("날씨 요청 실패");
    }

    const data = await response.json();
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;

    weatherElement.innerHTML = `
      <strong>${WEATHER_CITY_LABEL}</strong>
      <span>${temperature}°C / ${description}</span>
    `;
  } catch (error) {
    weatherElement.innerHTML = `
      <strong>날씨</strong>
      <span>날씨 정보를 불러오지 못했습니다.</span>
    `;
  }
}

updateClock();
setInterval(updateClock, 1000);
loadWeather();
