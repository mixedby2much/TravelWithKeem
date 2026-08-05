function whatsappLink(number, tierName) {
  const text = encodeURIComponent(`Hi! I'd like to book the ${tierName} trip plan.`);
  return `https://wa.me/${number}?text=${text}`;
}

function renderCard(tier, whatsappNumber) {
  const priceRows = tier.prices.map(p => `
    <div class="price-row">
      <div>
        <div class="price-row-name">${p.label}</div>
        <div class="price-row-desc">${p.desc}</div>
      </div>
      <div class="price-row-amount">${p.amount}</div>
    </div>
  `).join("");

  const includeItems = tier.includes.map(item => `
    <li>
      <span class="check-icon">✓</span>
      <span>${item}</span>
    </li>
  `).join("");

  return `
    <div class="card${tier.popular ? " popular" : ""}">
      ${tier.popular ? `<span class="card-badge">Popular</span>` : ""}
      <div class="card-header">
        <div class="card-icon">${tier.icon}</div>
        <div>
          <h3 class="card-title">${tier.name}</h3>
          <p class="card-tagline">${tier.tagline}</p>
        </div>
      </div>

      <p class="best-for-label">Best For</p>
      <p class="best-for-text">${tier.bestFor}</p>

      <div class="price-box">${priceRows}</div>

      <p class="section-label">Includes</p>
      <ul class="includes-list">${includeItems}</ul>

      <div class="addons">
        <strong>Add-ons</strong>
        ${tier.addons}
      </div>

      <a class="book-btn" href="${whatsappLink(whatsappNumber, tier.name)}" target="_blank" rel="noopener">Book My Trip</a>
    </div>
  `;
}

function renderGalleryItem(photo) {
  return `
    <figure class="gallery-item">
      <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
      <figcaption>${photo.caption}</figcaption>
    </figure>
  `;
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [settings, tiersData, galleryData] = await Promise.all([
      loadJSON("data/settings.json"),
      loadJSON("data/tiers.json"),
      loadJSON("data/gallery.json")
    ]);

    const whatsappNumber = settings.whatsappNumber;

    const pricingContainer = document.getElementById("pricing-cards");
    pricingContainer.innerHTML = tiersData.tiers
      .map(tier => renderCard(tier, whatsappNumber))
      .join("");

    const galleryContainer = document.getElementById("gallery-grid");
    if (galleryContainer) {
      galleryContainer.innerHTML = galleryData.photos.map(renderGalleryItem).join("");
    }

    const footerLink = document.getElementById("footer-whatsapp");
    if (footerLink) {
      footerLink.href = whatsappLink(whatsappNumber, "general question");
    }
  } catch (err) {
    console.error("Error loading site content:", err);
  }
});
