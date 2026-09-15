const collections = {
  Hindu: {
    description: "Warm, ceremonial and rooted in tradition.",
    templates: [
      { name: "The Saffron Edit", label: "Hindu · 01", url: "https://hindu-template1.vercel.app/" },
      { name: "Marigold", label: "Hindu · 02", url: "https://hindu-template2.vercel.app/" },
      { name: "Together", label: "Hindu · 03", url: "https://common-template1.vercel.app/" }
    ]
  },
  Muslim: {
    description: "Elegant, intimate and made for a beautiful union.",
    templates: [
      { name: "Noor", label: "Muslim · 01", url: "https://muslim-wedding.netlify.app/" },
      { name: "Together", label: "Muslim · 02", url: "https://common-template1.vercel.app/" }
    ]
  },
  Christian: {
    description: "Quietly romantic, joyful and full of grace.",
    templates: [
      { name: "Ever After", label: "Christian · 01", url: "https://christian-invitation.netlify.app/" },
      { name: "Together", label: "Christian · 02", url: "https://common-template1.vercel.app/" }
    ]
  }
};

const grid = document.querySelector("#template-grid");
const collectionName = document.querySelector("#collection-name");
const collectionDescription = document.querySelector("#collection-description");
const previewModal = document.querySelector("#preview-modal");
const previewFrame = document.querySelector("#preview-frame");
const previewTitle = document.querySelector("#preview-title");
const externalLink = document.querySelector("#open-external");
const loading = document.querySelector("#iframe-loading");

function renderCollection(category) {
  const collection = collections[category];
  collectionName.textContent = category;
  collectionDescription.textContent = collection.description;
  grid.dataset.category = category.toLowerCase();
  grid.innerHTML = collection.templates.map((template, index) => `
    <article class="template-card" tabindex="0" data-url="${template.url}" data-name="${template.name}" style="animation-delay: ${index * 0.08}s">
      <div class="card-top"><span>${template.label}</span><span class="card-number">0${index + 1}</span></div>
      <div class="card-name">${template.name}</div>
      <div class="view-template">View invitation <span class="icon-arrow" aria-hidden="true"></span></div>
    </article>
  `).join("") + `
    <article class="template-card custom-card" tabindex="0" data-custom-card>
      <div class="card-top"><span>Made for you</span><span class="card-number">*</span></div>
      <div class="card-name">Fully custom</div>
      <div class="view-template">Build yours <span class="icon-arrow icon-arrow-down" aria-hidden="true"></span></div>
    </article>
  `;

  grid.querySelectorAll(".template-card").forEach((card) => {
    if (card.hasAttribute("data-custom-card")) {
      card.addEventListener("click", scrollToContact);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          scrollToContact();
        }
      });
      return;
    }
    card.addEventListener("click", () => openPreview(card.dataset.url, card.dataset.name));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview(card.dataset.url, card.dataset.name);
      }
    });
  });
}

function scrollToContact() {
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth", block: "center" });
}

function openPreview(url, name) {
  previewTitle.textContent = name;
  externalLink.href = url;
  loading.hidden = false;
  previewFrame.src = url;
  previewModal.classList.add("is-open");
  previewModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePreview() {
  previewModal.classList.remove("is-open");
  previewModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  window.setTimeout(() => { previewFrame.src = "about:blank"; }, 250);
}

document.querySelectorAll(".category-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".category-tab").forEach((item) => {
      item.classList.toggle("is-active", item === tab);
      item.setAttribute("aria-selected", item === tab ? "true" : "false");
    });
    renderCollection(tab.dataset.category);
  });
});

document.querySelectorAll("[data-close-preview]").forEach((element) => element.addEventListener("click", closePreview));
previewFrame.addEventListener("load", () => { loading.hidden = true; });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && previewModal.classList.contains("is-open")) closePreview(); });
renderCollection("Hindu");

const offerGrid = document.querySelector(".offer-grid");
if (offerGrid) {
  offerGrid.querySelectorAll(".offer-item").forEach((item) => {
    const duplicate = item.cloneNode(true);
    duplicate.classList.add("offer-duplicate");
    duplicate.setAttribute("aria-hidden", "true");
    duplicate.setAttribute("tabindex", "-1");
    offerGrid.appendChild(duplicate);
  });

  let isDragging = false;
  let lastX = 0;
  let lastPointerTime = 0;
  let inertiaVelocity = 0;
  let position = 0;
  let loopWidth = 0;
  let lastTimestamp = performance.now();
  const carouselSpeed = 55;
  const wrapPosition = () => {
    if (position <= -loopWidth) position += loopWidth;
    if (position > 0) position -= loopWidth;
  };
  const renderPosition = () => {
    offerGrid.style.setProperty("--carousel-position", `${position}px`);
  };
  const animateCarousel = (timestamp) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = Math.min(timestamp - lastTimestamp, 100);
    lastTimestamp = timestamp;
    if (!isDragging) {
      if (Math.abs(inertiaVelocity) > 1) {
        position += inertiaVelocity * elapsed / 1000;
        inertiaVelocity *= Math.pow(0.001, elapsed / 1000);
      } else {
        inertiaVelocity = 0;
        position -= carouselSpeed * elapsed / 1000;
      }
      wrapPosition();
      renderPosition();
    }
    requestAnimationFrame(animateCarousel);
  };
  offerGrid.addEventListener("pointerdown", (event) => {
    isDragging = true;
    lastX = event.clientX;
    lastPointerTime = performance.now();
    inertiaVelocity = 0;
    offerGrid.classList.add("is-dragging");
    offerGrid.setPointerCapture(event.pointerId);
  });
  offerGrid.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const now = performance.now();
    const movement = event.clientX - lastX;
    const elapsed = Math.max(now - lastPointerTime, 1);
    inertiaVelocity = (movement / elapsed) * 1000;
    position += movement;
    lastX = event.clientX;
    lastPointerTime = now;
    wrapPosition();
    renderPosition();
  });
  offerGrid.addEventListener("wheel", (event) => {
    const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!movement) return;
    event.preventDefault();
    position -= movement;
    wrapPosition();
    renderPosition();
  }, { passive: false });
  const stopDragging = () => {
    isDragging = false;
    offerGrid.classList.remove("is-dragging");
  };
  offerGrid.addEventListener("pointerup", stopDragging);
  offerGrid.addEventListener("pointercancel", stopDragging);
  offerGrid.addEventListener("pointerleave", stopDragging);
  loopWidth = offerGrid.querySelector(".offer-duplicate").offsetLeft;
  position = -loopWidth / 2;
  renderPosition();
  requestAnimationFrame(animateCarousel);
}