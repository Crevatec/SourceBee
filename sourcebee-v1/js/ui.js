// ============================================================
//  ui.js  —  UI UTILITIES
// ============================================================

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'shop')  renderGrid('shopGrid', allProducts);
  if (page === 'admin') openAdminPanel();
}

function filterAndGoShop(cat) {
  showPage('shop');
  const filtered = cat === 'all' ? allProducts : allProducts.filter(p => p.cat === cat);
  renderGrid('shopGrid', filtered);
}

function renderGrid(gridId, products) {
  const el = document.getElementById(gridId);
  if (!el) return;
  if (!products || !products.length) {
    el.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;padding:2rem 0;text-align:center">No products found. 🐝</p>`;
    return;
  }
  const cur = CONFIG.CURRENCY;
  el.innerHTML = products.map(p => {
    const isCustom = p.cat === 'sourcing';
    return `
    <div class="product-card" onclick="${isCustom ? `openWhatsApp('Hi SourceBee! I want to request a custom product: ')` : `quickAddToCart(${JSON.stringify(p.id)})`}">
      <div class="product-img">
        ${p.imgUrl
          ? `<img src="${p.imgUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px 8px 0 0">`
          : `<span>${p.emoji || '📦'}</span>`}
        ${p.badge ? `<span class="badge badge-${p.badge}">${p.badge.toUpperCase()}</span>` : ''}
        <button class="wishlist-btn" onclick="event.stopPropagation();toast('❤️ Saved to wishlist!')">❤️</button>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        ${!isCustom ? `<div class="stars">${'★'.repeat(Math.floor(p.rating||5))}${'☆'.repeat(5-Math.floor(p.rating||5))}<span>(${(p.reviews||0).toLocaleString()})</span></div>` : ''}
        <div class="product-bottom">
          <div class="price-group">
            ${isCustom
              ? `<div class="product-price" style="color:var(--primary)">Request →</div>`
              : `<div class="product-price">${cur}${(p.price||0).toLocaleString()}</div>
                 ${p.old ? `<div class="product-old">${cur}${p.old.toLocaleString()}</div>` : ''}`}
          </div>
          ${!isCustom
            ? `<button class="add-btn" id="addbtn-${p.id}" onclick="event.stopPropagation();addToCart(${JSON.stringify(p.id)})">+</button>`
            : `<button class="add-btn" style="font-size:12px;width:auto;padding:0 10px" onclick="event.stopPropagation();openWhatsApp('Hi SourceBee! I want to request a custom product: ')">🐝</button>`}
        </div>
      </div>
    </div>`}).join('');
}

function filterProducts(query) {
  const q = query.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(q) || (p.brand||'').toLowerCase().includes(q) || (p.cat||'').includes(q)
  );
  if (document.getElementById('page-shop')?.classList.contains('active')) renderGrid('shopGrid', filtered);
}

function filterCat(el, cat) {
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const filtered = cat === 'all' ? allProducts : allProducts.filter(p => p.cat === cat);
  renderGrid('featuredGrid', filtered.slice(0, 8));
}

function sortProducts(val) {
  let sorted = [...allProducts];
  if      (val === 'price-low')  sorted.sort((a,b) => a.price - b.price);
  else if (val === 'price-high') sorted.sort((a,b) => b.price - a.price);
  else if (val === 'rating')     sorted.sort((a,b) => b.rating - a.rating);
  else if (val === 'new')        sorted.sort((a,b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  renderGrid('shopGrid', sorted);
}

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}
window.toast = toast;

function showLogin() { openAuthModal(); }
