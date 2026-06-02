const detailElement = document.getElementById("product-detail");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function getReturnUrl() {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get("from");

  if (!filter || filter === "all") {
    return "./index.html#shop";
  }

  return `./index.html?filter=${encodeURIComponent(filter)}#shop`;
}

function getCategoryLabel(category) {
  const labels = {
    optical: "안경",
    sunglasses: "선글라스",
  };

  return labels[category] || category;
}

function renderEmptyMessage(message) {
  detailElement.innerHTML = `
    <div class="detail-empty">
      <p class="empty-message">${escapeHtml(message)}</p>
      <a href="./index.html#shop" class="primary-button">상품 목록으로</a>
    </div>
  `;
}

function renderDetail(product) {
  detailElement.innerHTML = `
    <div class="detail-image" role="img" aria-label="${escapeHtml(product.name)}" style="background-image: url('${product.image}');"></div>
    <div class="detail-info">
      <p class="section-kicker">${escapeHtml(getCategoryLabel(product.category))}</p>
      <h1>${escapeHtml(product.name)}</h1>
      <p>${escapeHtml(product.description)}</p>
      <strong>${escapeHtml(product.price)}</strong>
      <a href="${getReturnUrl()}" class="primary-button">상품 목록으로</a>
    </div>
  `;
}

async function loadProductDetail() {
  if (!detailElement) {
    return;
  }

  const productId = getProductId();

  if (!productId) {
    renderEmptyMessage("상품 번호가 올바르지 않습니다.");
    return;
  }

  try {
    const response = await fetch("./data/products.json");

    if (!response.ok) {
      throw new Error("상품 데이터 요청 실패");
    }

    const products = await response.json();
    const product = products.find((item) => item.id === productId);

    if (!product) {
      renderEmptyMessage("상품 정보를 찾을 수 없습니다.");
      return;
    }

    document.title = `GLANCE | ${product.name}`;
    renderDetail(product);
  } catch (error) {
    renderEmptyMessage("상품 정보를 불러오지 못했습니다.");
  }
}

loadProductDetail();
