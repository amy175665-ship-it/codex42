const navLinks = document.querySelectorAll(".nav-link");
const routeLinks = document.querySelectorAll('a[href^="#"]');
const pageSections = document.querySelectorAll(".page-section");
const siteHeader = document.querySelector(".site-header");

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

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.getAttribute("href").replace("#", "");
    const sectionExists = document.getElementById(sectionId);

    if (!sectionExists) {
      return;
    }

    event.preventDefault();

    showSection(sectionId, getMainNavLink(link));
    window.location.hash = sectionId;
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const initialSection = window.location.hash.replace("#", "") || "home";
  const sectionExists = document.getElementById(initialSection);

  showSection(sectionExists ? initialSection : "home");
  updateHeaderState();
});

window.addEventListener("scroll", updateHeaderState);
