# GLANCE 쇼핑몰 연습 프로젝트

안경과 선글라스 상품을 보여주는 HTML, CSS, Vanilla JavaScript 연습용 프로젝트입니다.

## 주요 기능

- 메인 화면 섹션 전환
- 드롭다운 메뉴
- 상품 목록 출력
- 상품 필터링
- 추천 상품 슬라이더
- 상품 상세 페이지
- 현재 시간 표시
- 날씨 API 연동 영역
- 카카오맵 매장 위치 영역

## 실행 방법

상품 데이터는 `fetch()`로 `data/products.json`을 불러오기 때문에 `index.html`을 파일로 직접 여는 것보다 VS Code의 Live Server로 실행하는 것을 권장합니다.

1. VS Code에서 프로젝트 폴더 열기
2. Live Server 확장 설치
3. `index.html`에서 우클릭
4. `Open with Live Server` 선택

## 파일 구조

```text
.
|-- index.html
|-- product-detail.html
|-- redme.md
|-- css/
|   `-- style.css
|-- data/
|   `-- products.json
`-- js/
    |-- app.js
    |-- products.js
    |-- product-detail.js
    |-- weather.js
    `-- map.js
```

## 파일 역할

- `index.html`: 메인 페이지 구조
- `product-detail.html`: 상품 상세 페이지 구조
- `css/style.css`: 전체 레이아웃과 반응형 스타일
- `data/products.json`: 상품 데이터
- `js/app.js`: 섹션 전환과 헤더 상태 처리
- `js/products.js`: 상품 목록, 필터, 추천 슬라이더 처리
- `js/product-detail.js`: 상품 상세 데이터 출력
- `js/weather.js`: 현재 시간과 날씨 정보 출력
- `js/map.js`: 카카오맵 출력

## 참고

OpenWeatherMap과 Kakao Map API 키는 연습용으로 코드에 직접 들어가 있습니다. 실제 서비스에서는 API 키를 별도로 관리하는 것이 좋습니다.
