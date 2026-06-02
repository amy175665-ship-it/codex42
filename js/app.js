const navLinks = document.querySelectorAll(".nav-link");
const routeLinks = document.querySelectorAll('a[href^="#"]');
const pageSections = document.querySelectorAll(".page-section");
const siteHeader = document.querySelector(".site-header");
const featureLinks = document.querySelectorAll("[data-feature]");
const featureCards = document.querySelectorAll("[data-feature-card]");
const featureTitleElement = document.getElementById("feature-title");
const featureDescriptionElement = document.getElementById("feature-description");
const featureShopLink = document.getElementById("feature-shop-link");

const featureContent = {
  work: {
    title: "작업 컬렉션",
    description: "블랙 프레임과 투명 렌즈를 중심으로 매일 쓰기 좋은 GLANCE의 시그니처 라인을 모았습니다.",
    filter: "optical",
  },
  lookbook: {
    title: "시즌 룩북",
    description: "선글라스와 얇은 프레임으로 완성하는 이번 시즌의 간결한 스타일 제안입니다.",
    filter: "sunglasses",
  },
  event: {
    title: "매장 이벤트",
    description: "오프라인 매장에서 직접 착용하고 얼굴형에 맞는 프레임을 추천받는 피팅 프로그램입니다.",
    filter: "best",
  },
};

function updateHeaderState() {
  if (!siteHeader) {
    return;
  }

  const activeSection = document.querySelector(".page-section.active");
  const isHomeActive = activeSection && activeSection.id === "home";

  siteHeader.classList.toggle("is-scrolled", !isHomeActive || window.scrollY > 24);
}

function getMainNavLink(link) {
  const navItem = link.closest(".nav-item");

  if (navItem) {
    return navItem.querySelector(".nav-link");
  }

  return link.classList.contains("nav-link") ? link : null;
}

function showSection(sectionId, activeLink = null) {
  const targetId = sectionId || "home";

  pageSections.forEach((section) => {
    section.classList.toggle("active", section.id === targetId);
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  if (activeLink) {
    activeLink.classList.add("active");
    updateHeaderState();
    return;
  }

  const fallbackLink = Array.from(navLinks).find((link) => {
    const linkTarget = link.getAttribute("href").replace("#", "");
    return linkTarget === targetId;
  });

  if (fallbackLink) {
    fallbackLink.classList.add("active");
  }

  updateHeaderState();
}

function selectFeature(featureKey = "work") {
  const selectedFeature = featureContent[featureKey] ? featureKey : "work";
  const content = featureContent[selectedFeature];

  if (featureTitleElement) {
    featureTitleElement.textContent = content.title;
  }

  if (featureDescriptionElement) {
    featureDescriptionElement.textContent = content.description;
  }

  if (featureShopLink) {
    featureShopLink.setAttribute("href", `?filter=${encodeURIComponent(content.filter)}#shop`);
  }

  featureLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.feature === selectedFeature);
  });

  featureCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.featureCard === selectedFeature);
  });
}

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.getAttribute("href").replace("#", "");
    const sectionExists = document.getElementById(sectionId);

    if (!sectionExists) {
      return;
    }

    event.preventDefault();

    showSection(sectionId, getMainNavLink(link));

    if (sectionId === "features") {
      selectFeature(link.dataset.feature);
    }

    window.location.hash = sectionId;
  });
});

featureCards.forEach((card) => {
  const handleSelect = () => {
    selectFeature(card.dataset.featureCard);
  };

  card.addEventListener("click", handleSelect);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect();
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const initialSection = window.location.hash.replace("#", "") || "home";
  const sectionExists = document.getElementById(initialSection);

  showSection(sectionExists ? initialSection : "home");
  selectFeature();
  updateHeaderState();
});

window.addEventListener("scroll", updateHeaderState);
