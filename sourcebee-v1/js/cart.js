// ============================================================
//  cart.js  —  CART STATE & FUNCTIONS
// ============================================================

const cart = [];

function addToCart(id) {
  const prod = allProducts.find(p => p.id == id);
  if (!prod) return;
  // Custom sourcing goes straight to WhatsApp
  if (prod.cat === 'sourcing') {
    openWhatsApp(`Hi SourceBee! 🐝 I'd like to request a custom product sourcing. Please help me find: `);
    return;
  }
  const existing = cart.find(i => i.id == id);
  if (existing) { existing.qty++; }
  else { cart.push({ ...prod, qty: 1 }); }
  updateCartBadge();
  renderCartItems();
  toast('🛒 Added: ' + prod.name.substring(0, 32));
  const btn = document.getElementById('addbtn-' + id);
  if (btn) {
    btn.textContent = '✓';
    btn.style.background = '#22C55E';
    setTimeout(() => { btn.textContent = '+'; btn.style.background = ''; }, 1500);
  }
}

function quickAddToCart(id) { addToCart(id); }

function removeFromCart(id) {
  const idx = cart.findIndex(i => i.id == id);
  if (idx > -1) cart.splice(idx, 1);
  updateCartBadge();
  renderCartItems();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id == id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { updateCartBadge(); renderCartItems(); }
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = total;
}

function renderCartItems() {
  const el    = document.getElementById('cartItems');
  const foot  = document.getElementById('cartFoot');
  const label = document.getElementById('cartCountLabel');
  if (!el) return;

  if (!cart.length) {
    el.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🐝</div>
        <p>Your cart is empty.<br>Let the bee find something for you!</p>
      </div>`;
    if (foot)  foot.style.display = 'none';
    if (label) label.textContent  = '';
    return;
  }

  if (label) label.textContent = `(${cart.reduce((s,i) => s + i.qty, 0)} items)`;

  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.brand}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${CONFIG.CURRENCY}${item.price.toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const subEl = document.getElementById('cartSubtotal');
  const totEl = document.getElementById('cartTotal');
  if (subEl) subEl.textContent = CONFIG.CURRENCY + subtotal.toLocaleString();
  if (totEl) totEl.textContent = CONFIG.CURRENCY + subtotal.toLocaleString();
  if (foot)  foot.style.display = 'block';
}

function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  const drawer  = document.getElementById('cartDrawer');
  if (!overlay || !drawer) return;
  overlay.classList.toggle('open');
  drawer.classList.toggle('open');
  renderCartItems();
}
