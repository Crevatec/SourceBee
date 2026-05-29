// ============================================================
//  admin.js  —  SELF-UPLOAD ADMIN PANEL
//  Only accessible to CONFIG.ADMIN_EMAIL
//  She can: Add / Edit / Delete products, view orders
// ============================================================

let adminProducts = [];
let editingProductId = null;

async function openAdminPanel() {
  const user = firebase.auth ? firebase.auth().currentUser : null;
  if (!isAdmin(user)) {
    toast('🔒 Admin access only');
    openAuthModal();
    return;
  }
  showPage('admin');
  await loadAdminView();
}

async function loadAdminView() {
  renderAdminStats();
  await loadAdminProductList();
  await loadAdminOrders();
}

// ── STATS ─────────────────────────────────────────────────────

async function renderAdminStats() {
  const orders = await fetchRecentOrders(100);
  const revenue = orders.reduce((s, o) => s + (o.subtotal || 0), 0);
  const el = document.getElementById('adminStats');
  if (!el) return;
  el.innerHTML = `
    <div class="metric-card"><div class="metric-icon">💰</div><div class="metric-value">${CONFIG.CURRENCY}${revenue.toLocaleString()}</div><div class="metric-label">Total Revenue</div></div>
    <div class="metric-card"><div class="metric-icon">📦</div><div class="metric-value">${orders.length}</div><div class="metric-label">Total Orders</div></div>
    <div class="metric-card"><div class="metric-icon">🛍️</div><div class="metric-value">${adminProducts.length}</div><div class="metric-label">Products Live</div></div>
    <div class="metric-card"><div class="metric-icon">⏳</div><div class="metric-value">${orders.filter(o=>o.status==='pending_payment').length}</div><div class="metric-label">Awaiting Payment</div></div>`;
}

// ── PRODUCT LIST ──────────────────────────────────────────────

async function loadAdminProductList() {
  adminProducts = await loadAdminProducts();
  const el = document.getElementById('adminProductList');
  if (!el) return;
  if (!adminProducts.length) {
    el.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--muted)">No products yet. Add your first product below! 🐝</div>`;
    return;
  }
  el.innerHTML = adminProducts.map(p => `
    <div class="admin-product-row ${p.active === false ? 'deleted' : ''}">
      <div class="admin-prod-emoji">${p.emoji || '📦'}</div>
      <div class="admin-prod-info">
        <div class="admin-prod-name">${p.name}</div>
        <div class="admin-prod-meta">${p.brand} · ${p.cat} · ${CONFIG.CURRENCY}${(p.price||0).toLocaleString()}</div>
      </div>
      <div class="admin-prod-actions">
        <span class="status-chip ${p.active !== false ? 'status-live' : 'status-hidden'}">${p.active !== false ? 'Live' : 'Hidden'}</span>
        <button class="admin-btn-edit" onclick="editProduct('${p.id}')">✏️ Edit</button>
        <button class="admin-btn-del"  onclick="confirmDelete('${p.id}','${p.name.replace(/'/g,"\\'")}')">🗑️</button>
      </div>
    </div>`).join('');
}

// ── ADD / EDIT PRODUCT FORM ────────────────────────────────────

function openAddProductForm() {
  editingProductId = null;
  document.getElementById('productFormTitle').textContent = '➕ Add New Product';
  clearProductForm();
  document.getElementById('productFormWrap').style.display = 'block';
  document.getElementById('productFormWrap').scrollIntoView({ behavior: 'smooth' });
}

function editProduct(id) {
  const p = adminProducts.find(p => p.id == id);
  if (!p) return;
  editingProductId = id;
  document.getElementById('productFormTitle').textContent = '✏️ Edit Product';
  document.getElementById('pName').value   = p.name    || '';
  document.getElementById('pBrand').value  = p.brand   || '';
  document.getElementById('pPrice').value  = p.price   || '';
  document.getElementById('pOld').value    = p.old     || '';
  document.getElementById('pCat').value    = p.cat     || 'fashion';
  document.getElementById('pEmoji').value  = p.emoji   || '📦';
  document.getElementById('pBadge').value  = p.badge   || 'new';
  document.getElementById('pDesc').value   = p.desc    || '';
  document.getElementById('pImgUrl').value = p.imgUrl  || '';
  document.getElementById('productFormWrap').style.display = 'block';
  document.getElementById('productFormWrap').scrollIntoView({ behavior: 'smooth' });
}

function clearProductForm() {
  ['pName','pBrand','pPrice','pOld','pEmoji','pDesc','pImgUrl'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const cat = document.getElementById('pCat');
  if (cat) cat.value = 'fashion';
  const badge = document.getElementById('pBadge');
  if (badge) badge.value = 'new';
}

function cancelProductForm() {
  document.getElementById('productFormWrap').style.display = 'none';
  editingProductId = null;
  clearProductForm();
}

async function saveProduct() {
  const name  = document.getElementById('pName')?.value.trim();
  const brand = document.getElementById('pBrand')?.value.trim();
  const price = parseFloat(document.getElementById('pPrice')?.value);
  const old   = parseFloat(document.getElementById('pOld')?.value) || null;
  const cat   = document.getElementById('pCat')?.value;
  const emoji = document.getElementById('pEmoji')?.value.trim() || '📦';
  const badge = document.getElementById('pBadge')?.value;
  const desc  = document.getElementById('pDesc')?.value.trim()   || '';
  const imgUrl= document.getElementById('pImgUrl')?.value.trim() || '';

  if (!name)       { toast('⚠️ Product name is required');  return; }
  if (!brand)      { toast('⚠️ Brand is required');          return; }
  if (!price || isNaN(price)) { toast('⚠️ Valid price is required'); return; }

  const btn = document.getElementById('saveProductBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  const product = {
    name, brand, price, old, cat, emoji, badge, desc, imgUrl,
    rating: 5.0, reviews: 0, isNew: badge === 'new',
    active: true,
  };

  try {
    const id = await saveProductToDB(product, editingProductId);
    toast(editingProductId ? '✅ Product updated!' : '✅ Product published!');
    cancelProductForm();
    await loadAdminProductList();
    await loadProductsFromDB(); // refresh storefront
  } catch (err) {
    toast('❌ Failed to save — check Firestore connection');
    console.error(err);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🐝 Publish Product'; }
  }
}

function confirmDelete(id, name) {
  if (confirm(`Remove "${name}" from the store?`)) {
    deleteProductFromDB(id).then(() => loadAdminProductList());
  }
}

// ── ORDERS TABLE ──────────────────────────────────────────────

async function loadAdminOrders() {
  const orders = await fetchRecentOrders(30);
  const el = document.getElementById('adminOrdersList');
  if (!el) return;
  if (!orders.length) {
    el.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--muted)">No orders yet.</div>`;
    return;
  }
  el.innerHTML = `
    <table class="orders-table">
      <thead><tr><th>Ref</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Code</th><th>Action</th></tr></thead>
      <tbody>
        ${orders.map(o => {
          const phone = (o.customer?.phone || '').replace(/\D/g,'');
          const name  = `${o.customer?.fname || ''} ${o.customer?.lname || ''}`.trim();
          const isPending = o.status === 'pending_payment';
          const hasCode   = !!o.confirmationCode;
          return `
          <tr>
            <td><span class="order-ref-chip">${o.ref}</span></td>
            <td>
              <div style="font-weight:600;font-size:13px">${name}</div>
              <div style="font-size:11px;color:var(--muted)">${o.customer?.phone || ''}</div>
              <div style="font-size:11px;color:var(--muted)">${o.customer?.city || ''}, ${o.customer?.state || ''}</div>
            </td>
            <td style="font-size:12px;color:var(--muted)">${(o.items||[]).length} item(s)</td>
            <td style="font-weight:700;color:var(--primary)">${CONFIG.CURRENCY}${(o.subtotal||0).toLocaleString()}</td>
            <td><span class="order-status status-${o.status||'pending_payment'}">${_statusLabel(o.status)}</span></td>
            <td id="code-display-${o.ref}">
              ${hasCode
                ? `<span style="background:#D1FAE5;color:#065F46;font-weight:800;padding:3px 10px;border-radius:6px;font-size:12px">${o.confirmationCode}</span>`
                : `<span style="color:var(--muted);font-size:11px">Not yet</span>`}
            </td>
            <td style="display:flex;flex-direction:column;gap:6px;min-width:160px">
              ${isPending && !hasCode ? `
                <button id="confirm-btn-${o.ref}"
                  onclick="confirmPaymentAndSendCode('${o.ref}','${phone}','${name}')"
                  style="background:var(--green);color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap">
                  ✅ Confirm Payment
                </button>` : ''}
              ${hasCode ? `
                <button onclick="confirmPaymentAndSendCode('${o.ref}','${phone}','${name}')"
                  style="background:var(--primary-l);color:var(--primary);border:1px solid var(--primary);border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;cursor:pointer">
                  📲 Resend Code
                </button>` : ''}
              <select onchange="updateOrderStatus('${o.ref}',this.value).then(()=>{toast('✅ Status updated');loadAdminOrders()})"
                style="font-size:11px;padding:4px 6px;border:1px solid var(--border);border-radius:6px;cursor:pointer">
                <option value="pending_payment" ${o.status==='pending_payment'?'selected':''}>⏳ Awaiting</option>
                <option value="confirmed"       ${o.status==='confirmed'?'selected':''}>✅ Confirmed</option>
                <option value="processing"      ${o.status==='processing'?'selected':''}>⚙️ Processing</option>
                <option value="shipped"         ${o.status==='shipped'?'selected':''}>🚚 Shipped</option>
                <option value="delivered"       ${o.status==='delivered'?'selected':''}>📬 Delivered</option>
                <option value="cancelled"       ${o.status==='cancelled'?'selected':''}>❌ Cancelled</option>
              </select>
            </td>
          </tr>`}).join('')}
      </tbody>
    </table>`;
}

function _statusLabel(s) {
  const map = {
    pending_payment: '⏳ Awaiting',
    confirmed:       '✅ Confirmed',
    processing:      '⚙️ Processing',
    shipped:         '🚚 Shipped',
    delivered:       '📬 Delivered',
    cancelled:       '❌ Cancelled',
  };
  return map[s] || s;
}

// ── CONFIRM PAYMENT & GENERATE CODE ──────────────────────────

async function confirmPaymentAndSendCode(orderRef, customerPhone, customerName) {
  const btn = document.getElementById(`confirm-btn-${orderRef}`);
  if (btn) { btn.disabled = true; btn.textContent = 'Generating…'; }

  const code = await generateConfirmationCode(orderRef);
  if (!code) {
    toast('❌ Failed to generate code — check Firestore');
    if (btn) { btn.disabled = false; btn.textContent = '✅ Confirm Payment'; }
    return;
  }

  // Build WhatsApp message to send to customer
  const waMsg = [
    `🐝 *${CONFIG.STORE_NAME} — Payment Confirmed!*`,
    ``,
    `Hi ${customerName}! Your payment has been confirmed. 🎉`,
    ``,
    `*Your Confirmation Code:*`,
    `━━━━━━━━━━━━━━━`,
    `🔐 *${code}*`,
    `━━━━━━━━━━━━━━━`,
    ``,
    `*How to get your receipt:*`,
    `1. Go to our website`,
    `2. Click *"Confirm My Order"*`,
    `3. Enter the code above`,
    `4. Download your receipt 🧾`,
    ``,
    `Your order is now being processed. We'll update you on delivery. Thank you for shopping with ${CONFIG.STORE_NAME}! 🐝`,
  ].join('\n');

  // Open WhatsApp with the code pre-filled (admin sends manually)
  const waURL = `https://wa.me/${customerPhone.replace(/\D/g,'')}?text=${encodeURIComponent(waMsg)}`;
  window.open(waURL, '_blank');

  toast(`✅ Code generated: ${code} — WhatsApp opened!`);

  // Show code in UI for admin reference
  const codeEl = document.getElementById(`code-display-${orderRef}`);
  if (codeEl) {
    codeEl.innerHTML = `<span style="background:#D1FAE5;color:#065F46;font-weight:800;padding:3px 10px;border-radius:6px;font-size:12px">${code}</span>`;
  }

  // Refresh orders list
  setTimeout(() => loadAdminOrders(), 1500);
}
