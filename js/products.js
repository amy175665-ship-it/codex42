const productListElement = document.getElementById("product-list");
const featuredTrackElement = document.getElementById("featured-track");
const filterButtons = document.querySelectorAll("[data-filter]");
const previousButton = document.querySelector(".slider-button-prev");
const nextButton = document.querySelector(".slider-button-next");

let products = [];
let featuredIndex = 0;
let selectedFilter = "all";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCategoryLabel(category) {
  const labels = {
    optical: "안경",
    sunglasses: "선글라스",
  };

  return labels[category] || category;
}

function getTagLabel(tag) {
  const labels = {
    new: "신상품",
    best: "베스트",
    restock: "재입고",
    metal: "메탈",
    horn: "뿔테",
    titanium: "티타늄",
    classic: "클래식",
    sports: "스포츠",
    tint: "틴트 렌즈",
  };

  return labels[tag] || tag;
}

function matchesFilter(product, filter) {
  if (filter === "all") {
    return true;
  }

  return product.category === filter || product.tags.includes(filter);
}

function getProductDetailUrl(product) {
  return `./product-detail.html?id=${product.id}&from=${encodeURIComponent(selectedFilter)}`;
}

function getInitialFilter() {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get("filter");

  if (!filter) {
    return "all";
  }

  return Array.from(filterButtons).some((button) => button.dataset.filter === filter) ? filter : "all";
}

function updateFilterUrl(filter) {
  const nextUrl = filter === "all" ? "#shop" : `?filter=${encodeURIComponent(filter)}#shop`;
  window.history.replaceState(null, "", nextUrl);
}

function createBadgeMarkup(product) {
  return [getCategoryLabel(product.category), ...product.tags]
    .map((tag) => `<span>${escapeHtml(getTagLabel(tag))}</span>`)
    .join("");
}

function createProductCard(product) {
  return `
    <article class="product-card">
      <a href="${getProductDetailUrl(product)}" class="product-card-link" aria-label="${escapeHtml(product.name)} 상세 보기">
        <div class="product-image" role="img" aria-label="${escapeHtml(product.name)}" style="background-image: url('${product.image}');"></div>
        <div class="product-content">
          <div class="product-badges">${createBadgeMarkup(product)}</div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description)}</p>
          <strong>${escapeHtml(product.price)}</strong>
          <span class="product-more">자세히 보기</span>
        </div>
      </a>
    </article>
  `;
}

function createFeaturedCard(product) {
  return `
    <a href="${getProductDetailUrl(product)}" class="preview-card" aria-label="${escapeHtml(product.name)} 상세 보기">
      <div class="preview-image" style="background-image: url('${product.image}');"></div>
      <span class="preview-hover-orb" style="background-image: url('${product.image}');" aria-hidden="true"></span>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.price)}</p>
    </a>
  `;
}

function renderProducts(filter = "all") {
  if (!productListElement) {
    return;
  }

  const filteredProducts = products.filter((product) => matchesFilter(product, filter));

  if (filteredProducts.length === 0) {
    productListElement.innerHTML = `<p class="empty-message">조건에 맞는 상품이 없습니다.</p>`;
    return;
  }

  productListElement.innerHTML = filteredProducts.map(createProductCard).join("");
}

function updateFeaturedSlider() {
  if (!featuredTrackElement) {
    return;
  }

  const firstCard = featuredTrackElement.querySelector(".preview-card");

  if (!firstCard) {
    return;
  }

  const totalItems = featuredTrackElement.children.length;
  const visibleItems = Math.max(1, Math.round(featuredTrackElement.parentElement.offsetWidth / firstCard.offsetWidth));
  const maxIndex = Math.max(0, totalItems - visibleItems);

  if (featuredIndex > maxIndex) {
    featuredIndex = maxIndex;
  }

  featuredTrackElement.style.transform = `translateX(-${featuredIndex * firstCard.offsetWidth}px)`;
}

function bindFeaturedHoverOrbs() {
  if (!featuredTrackElement) {
    return;
  }

  featuredTrackElement.querySelectorAll(".preview-card").forEach((card) => {
    const orb = card.querySelector(".preview-hover-orb");

    if (!orb) {
      return;
    }

    card.addEventListener("pointermove", (event) => {
      const cardRect = card.getBoundingClientRect();
      const x = event.clientX - cardRect.left;
      const y = event.clientY - cardRect.top;

      orb.style.setProperty("--orb-x", `${x}px`);
      orb.style.setProperty("--orb-y", `${y}px`);
    });
  });
}

function renderFeaturedProducts() {
  if (!featuredTrackElement) {
    return;
  }

  const featuredProducts = products.filter((product) => product.tags.includes("new") || product.tags.includes("best"));

  featuredTrackElement.innerHTML = featuredProducts.map(createFeaturedCard).join("");
  featuredIndex = 0;
  bindFeaturedHoverOrbs();
  updateFeaturedSlider();
}

function moveFeaturedSlider(direction) {
  if (!featuredTrackElement) {
    return;
  }

  const totalItems = featuredTrackElement.children.length;
  const firstCard = featuredTrackElement.querySelector(".preview-card");

  if (totalItems === 0 || !firstCard) {
    return;
  }

  const visibleItems = Math.max(1, Math.round(featuredTrackElement.parentElement.offsetWidth / firstCard.offsetWidth));
  const maxIndex = Math.max(0, totalItems - visibleItems);

  featuredIndex += direction;

  if (featuredIndex < 0) {
    featuredIndex = maxIndex;
  }

  if (featuredIndex > maxIndex) {
    featuredIndex = 0;
  }

  updateFeaturedSlider();
}

function setActiveFilter(filter) {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
}

function applyFilter(filter, shouldUpdateUrl = true) {
  selectedFilter = filter || "all";

  setActiveFilter(selectedFilter);
  renderProducts(selectedFilter);

  if (shouldUpdateUrl && window.location.hash === "#shop") {
    updateFilterUrl(selectedFilter);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter(button.dataset.filter);
  });
});

if (previousButton) {
  previousButton.addEventListener("click", () => {
    moveFeaturedSlider(-1);
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    moveFeaturedSlider(1);
  });
}

window.addEventListener("resize", updateFeaturedSlider);

async function loadProducts() {
  if (productListElement) {
    productListElement.innerHTML = `<p class="empty-message">상품을 불러오는 중입니다.</p>`;
  }

  try {
    const response = await fetch("./data/products.json");

    if (!response.ok) {
      throw new Error("상품 데이터 요청 실패");
    }

    products = await response.json();
    selectedFilter = getInitialFilter();

    renderFeaturedProducts();
    applyFilter(selectedFilter, false);
  } catch (error) {
    if (productListElement) {
      productListElement.innerHTML = `<p class="empty-message">상품 데이터를 불러오지 못했습니다.</p>`;
    }

    if (featuredTrackElement) {
      featuredTrackElement.innerHTML = `<p class="empty-message">추천 상품을 불러오지 못했습니다.</p>`;
    }
  }
}

loadProducts();
