function whatsappLink(tierName) {
  const text = encodeURIComponent(`Hi! I'd like to book the ${tierName} trip plan.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function renderCard(tier) {
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

      <a class="book-btn" href="${whatsappLink(tier.name)}" target="_blank" rel="noopener">Book My Trip</a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pricing-cards");
  container.innerHTML = TIERS.map(renderCard).join("");

  const footerLink = document.getElementById("footer-whatsapp");
  if (footerLink) {
    footerLink.href = whatsappLink("general question");
  }
});
