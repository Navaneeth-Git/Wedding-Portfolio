const collections = {
  Hindu: {
    description: "Warm, ceremonial and rooted in tradition.",
    templates: [
      { name: "The Saffron Edit", label: "Hindu · 01", url: "https://hindu-template1-1.vercel.app/" },
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