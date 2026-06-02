const mapElement = document.getElementById("map");

const KAKAO_MAP_API_KEY = "42f94fd5b3b8d883d21c91ad85139dd2";
const STORE_POSITION = {
  lat: 37.522295,
  lng: 127.023254,
};
const STORE_NAME = "강남 GLANCE 스토어";

function showMapMessage(message) {
  if (!mapElement) {
    return;
  }

  mapElement.innerHTML = `
    <div class="map-message">
      <strong>카카오맵</strong>
      <span>${message}</span>
    </div>
  `;
}

function loadKakaoMapScript() {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function createKakaoMap() {
  const storeLatLng = new kakao.maps.LatLng(STORE_POSITION.lat, STORE_POSITION.lng);
  const map = new kakao.maps.Map(mapElement, {
    center: storeLatLng,
    level: 3,
  });

  const marker = new kakao.maps.Marker({
    position: storeLatLng,
  });

  const infoWindow = new kakao.maps.InfoWindow({
    content: `<div class="kakao-info-window">${STORE_NAME}</div>`,
  });

  marker.setMap(map);
  infoWindow.open(map, marker);
}

async function initKakaoMap() {
  if (!mapElement) {
    return;
  }

  if (!KAKAO_MAP_API_KEY) {
    showMapMessage("카카오맵 키를 연결하면 지도가 표시됩니다.");
    return;
  }

  try {
    await loadKakaoMapScript();
    kakao.maps.load(createKakaoMap);
  } catch (error) {
    showMapMessage("카카오맵을 불러오지 못했습니다.");
  }
}

initKakaoMap();
