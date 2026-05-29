// ============================================================
//  checkout.js  —  3-STEP CHECKOUT + ORDER PLACEMENT
// ============================================================

let checkoutStep = 1;

function openCheckout() {
  if (!cart.length) { toast('🛒 Your cart is empty!'); return; }
  toggleCart();
  checkoutStep = 1;
  renderCheckout();
  document.getElementById('checkoutOverlay').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
}

function renderCheckout() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const body  = document.getElementById('modalBody');
  const title = document.getElementById('modalTitle');
  const cur   = CONFIG.CURRENCY;

  const steps = (active) => `
    <div class="checkout-steps">
      <div class="checkout-step ${active > 1 ? 'done' : active === 1 ? 'active' : ''}">
        <div class="step-num">${active > 1 ? '✓' : '1'}</div> Delivery
        <div class="step-line"></div>
      </div>
      <div class="checkout-step ${active > 2 ? 'done' : active === 2 ? 'active' : ''}">
        <div class="step-num">${active > 2 ? '✓' : '2'}</div> Payment
        <div class="step-line"></div>
      </div>
      <div class="checkout-step ${active === 3 ? 'active' : ''}">
        <div class="step-num">3</div> Confirm
      </div>
    </div>`;

  // ── STEP 1: Delivery ──────────────────────────────────────
  if (checkoutStep === 1) {
    title.textContent = '📦 Delivery Details';
    body.innerHTML = `
      ${steps(1)}
      <div class="checkout-form">
        <div class="checkout-row">
          <div class="checkout-field"><label>First Name</label><input type="text" id="fname" placeholder="Jane"></div>
          <div class="checkout-field"><label>Last Name</label><input type="text" id="lname" placeholder="Doe"></div>
        </div>
        <div class="checkout-field"><label>Email Address</label><input type="email" id="email" placeholder="you@example.com"></div>
        <div class="checkout-field"><label>Phone Number</label><input type="tel" id="phone" placeholder="+234 800 000 0000"></div>
        <div class="checkout-field"><label>Delivery Address</label><input type="text" id="address" placeholder="House number, street name"></div>
        <div class="checkout-row">
          <div class="checkout-field"><label>City / Town</label><input type="text" id="city" placeholder="e.g. Ikeja"></div>
          <div class="checkout-field"><label>State</label>
            <select id="state">
              <option value="">— Select State —</option>
              <option>Abia</option><option>Adamawa</option><option>Akwa Ibom</option><option>Anambra</option>
              <option>Bauchi</option><option>Bayelsa</option><option>Benue</option><option>Borno</option>
              <option>Cross River</option><option>Delta</option><option>Ebonyi</option><option>Edo</option>
              <option>Ekiti</option><option>Enugu</option><option>FCT — Abuja</option><option>Gombe</option>
              <option>Imo</option><option>Jigawa</option><option>Kaduna</option><option>Kano</option>
              <option>Katsina</option><option>Kebbi</option><option>Kogi</option><option>Kwara</option>
              <option>Lagos</option><option>Nasarawa</option><option>Niger</option><option>Ogun</option>
              <option>Ondo</option><option>Osun</option><option>Oyo</option><option>Plateau</option>
              <option>Rivers</option><option>Sokoto</option><option>Taraba</option><option>Yobe</option>
              <option>Zamfara</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-back" onclick="closeCheckout()">Cancel</button>
        <button class="btn-proceed" onclick="saveCustomerAndContinue()">Proceed to Payment →</button>
      </div>`;
  }

  // ── STEP 2: Payment ───────────────────────────────────────
  else if (checkoutStep === 2) {
    title.textContent = '💳 Make Payment';
    body.innerHTML = `
      ${steps(2)}
      <div style="background:var(--bg);border-radius:8px;padding:0.85rem 1.1rem;margin-bottom:1rem">
        ${cart.map(i => `
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid var(--border);color:var(--muted)">
            <span>${i.emoji} ${i.name.substring(0,30)} ×${i.qty}</span>
            <span style="font-weight:600;color:var(--text)">${cur}${(i.price*i.qty).toLocaleString()}</span>
          </div>`).join('')}
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:15px;padding-top:9px">
          <span>Total to Pay</span><span style="color:var(--primary)">${cur}${subtotal.toLocaleString()}</span>
        </div>
      </div>

      <!-- Bank Card -->
      <div style="background:linear-gradient(135deg,#2D1B69,#4C1D95);border-radius:14px;padding:1.3rem 1.5rem;margin-bottom:1rem;border:1.5px solid rgba(245,158,11,0.4)">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">🐝 Transfer Payment To</div>
        <div style="margin-bottom:8px">
          <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:2px">Bank</div>
          <div style="font-size:14px;font-weight:700;color:#F59E0B">${CONFIG.BANK_NAME}</div>
        </div>
        <div style="margin-bottom:10px">
          <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:2px">Account Name</div>
          <div style="font-size:14px;font-weight:600;color:#fff">${CONFIG.ACCOUNT_NAME}</div>
        </div>
        <div style="background:rgba(245,158,11,0.15);border:1.5px dashed rgba(245,158,11,0.5);border-radius:10px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,0.4);margin-bottom:4px">Account Number</div>
            <div style="font-weight:800;font-size:1.5rem;color:#F59E0B;letter-spacing:3px">${CONFIG.ACCOUNT_NUMBER}</div>
          </div>
          <button onclick="navigator.clipboard.writeText('${CONFIG.ACCOUNT_NUMBER}').then(()=>toast('✅ Copied!'))"
            style="background:rgba(245,158,11,0.25);border:1px solid rgba(245,158,11,0.5);border-radius:8px;color:#F59E0B;font-size:12px;font-weight:700;padding:8px 14px;cursor:pointer">
            Copy
          </button>
        </div>
      </div>

      <div style="background:#F5F3FF;border:1.5px solid #7C3AED;border-radius:10px;padding:12px 14px;margin-bottom:1rem">
        <div style="font-weight:700;color:#4C1D95;font-size:13px;margin-bottom:5px">📋 Steps to complete your order</div>
        <ol style="font-size:12px;color:#4C1D95;line-height:2;padding-left:1.1rem;margin:0">
          <li>Transfer <strong>${cur}${subtotal.toLocaleString()}</strong> to the Opay account above</li>
          <li>Screenshot your payment confirmation</li>
          <li>Click <strong>"I've Paid"</strong> below to send receipt via WhatsApp</li>
          <li>We confirm &amp; arrange your delivery 🚚</li>
        </ol>
      </div>
      <div class="modal-footer">
        <button class="btn-back" onclick="checkoutStep=1;renderCheckout()">← Back</button>
        <button class="btn-proceed" onclick="checkoutStep=3;renderCheckout()" style="background:#25D366;display:flex;align-items:center;justify-content:center;gap:8px">
          ${_waIcon()} I've Paid — Upload Receipt on WhatsApp
        </button>
      </div>`;
  }

  // ── STEP 3: Confirm ───────────────────────────────────────
  else if (checkoutStep === 3) {
    title.textContent = '✅ Confirm Order';
    const ref = 'SBE-' + Math.random().toString(36).substr(2,8).toUpperCase();
    window._pendingOrderRef = ref;
    body.innerHTML = `
      ${steps(3)}
      <div style="background:var(--bg);border-radius:8px;padding:1rem 1.25rem;margin-bottom:1rem">
        ${cart.map(i => `
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:5px 0;border-bottom:1px solid var(--border)">
            <span>${i.emoji} ${i.name.substring(0,30)} ×${i.qty}</span>
            <span style="font-weight:600">${cur}${(i.price*i.qty).toLocaleString()}</span>
          </div>`).join('')}
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:16px;padding-top:10px">
          <span>Total</span><span style="color:var(--primary)">${cur}${subtotal.toLocaleString()}</span>
        </div>
      </div>
      <div style="background:#FFF7ED;border:1.5px solid var(--gold);border-radius:10px;padding:12px 14px;margin-bottom:1rem;font-size:12px;color:#92400E;line-height:1.8">
        <strong>🐝 Almost done!</strong><br>
        Clicking below will open WhatsApp with your full order details.
        Please <strong>send your payment receipt</strong> there to confirm.
      </div>
      <div class="modal-footer">
        <button class="btn-back" onclick="checkoutStep=2;renderCheckout()">← Back</button>
        <button class="btn-proceed" onclick="placeOrder('${ref}')" style="background:#25D366;display:flex;align-items:center;justify-content:center;gap:8px">
          ${_waIcon()} Confirm &amp; Send Receipt on WhatsApp
        </button>
      </div>`;
  }
}

function saveCustomerAndContinue() {
  const fname   = document.getElementById('fname')?.value.trim()   || '';
  const lname   = document.getElementById('lname')?.value.trim()   || '';
  const email   = document.getElementById('email')?.value.trim()   || '';
  const phone   = document.getElementById('phone')?.value.trim()   || '';
  const address = document.getElementById('address')?.value.trim() || '';
  const city    = document.getElementById('city')?.value.trim()    || '';
  const state   = document.getElementById('state')?.value.trim()   || '';

  if (!fname || !email || !phone || !address) { toast('⚠️ Please fill in all required fields'); return; }
  if (!email.includes('@')) { toast('⚠️ Please enter a valid email address'); return; }

  window._checkoutCustomer = { fname, lname, email, phone, address, city, state };
  checkoutStep = 2;
  renderCheckout();
}

async function placeOrder(ref) {
  const subtotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const customer  = window._checkoutCustomer || {};
  const cur       = CONFIG.CURRENCY;
  const itemLines = cart.map(i => `${i.emoji} ${i.name} x${i.qty} — ${cur}${(i.price*i.qty).toLocaleString()}`).join('\n');

  // 1. OPEN WHATSAPP (sync)
  const waMessage = [
    `🐝 *New Order — ${CONFIG.STORE_NAME}*`,
    ``,
    `*Order Ref:* ${ref}`,
    `*Customer:* ${customer.fname} ${customer.lname}`,
    `*Phone:* ${customer.phone}`,
    `*Email:* ${customer.email}`,
    `*Delivery:* ${customer.address}, ${customer.city}, ${customer.state}`,
    ``,
    `*Items:*`,
    itemLines,
    ``,
    `*Total Paid: ${cur}${subtotal.toLocaleString()}*`,
    `*Bank:* ${CONFIG.BANK_NAME} — ${CONFIG.ACCOUNT_NUMBER} (${CONFIG.ACCOUNT_NAME})`,
    ``,
    `📎 *Please send your payment receipt/screenshot to confirm this order.*`,
    `Thank you for shopping with ${CONFIG.STORE_NAME}! 🐝`,
  ].join('\n');

  const waURL = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
  window.open(waURL, '_blank');

  // Loading screen
  document.getElementById('modalTitle').textContent = '⏳ Processing...';
  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;padding:3rem 1rem">
      <div style="font-size:3.5rem;margin-bottom:1rem">🐝</div>
      <p style="color:var(--muted);font-size:14px;line-height:1.8">
        Opening WhatsApp with your order…<br>
        Please <strong>upload your payment receipt</strong> in the chat.
      </p>
    </div>`;

  // 2. SAVE TO FIRESTORE + SEND EMAIL (parallel)
  const orderPayload = {
    ref, customer,
    items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, emoji: i.emoji })),
    subtotal, currency: CONFIG.CURRENCY,
    paymentMethod: 'bank_transfer',
    bank: { name: CONFIG.BANK_NAME, account: CONFIG.ACCOUNT_NAME, number: CONFIG.ACCOUNT_NUMBER },
  };

  const [, emailSent] = await Promise.all([
    saveOrder(orderPayload),
    _sendConfirmationEmail({ customer, ref, itemLines, subtotal, waURL }),
  ]);

  // 3. SUCCESS SCREEN
  document.getElementById('modalTitle').textContent = '🎉 Order Placed!';
  document.getElementById('modalBody').innerHTML = `
    <div class="order-success">
      <div class="success-icon">🐝</div>
      <div class="success-title">Order Submitted!</div>
      <p class="success-sub">
        Thank you for shopping with ${CONFIG.STORE_NAME}!<br>
        ${emailSent
          ? `Confirmation sent to <strong>${customer.email}</strong>.`
          : `<em style="color:var(--muted);font-size:12px">(Email pending — check EmailJS config)</em>`}
      </p>
      <div class="order-ref">Ref: ${ref}</div>
      <div style="background:#F5F3FF;border:1.5px solid var(--primary);border-radius:10px;padding:14px;margin:1rem 0;text-align:left">
        <div style="font-weight:700;color:var(--primary);font-size:13px;margin-bottom:6px">📲 Upload Your Receipt</div>
        <p style="font-size:12px;color:#4C1D95;line-height:1.7">
          WhatsApp opened with your order details.<br>
          <strong>Send your payment screenshot</strong> in that chat to confirm your order.
        </p>
      </div>
      <a href="${waURL}" target="_blank" style="display:block;width:100%;margin-bottom:10px">
        <button style="width:100%;background:#25D366;color:#fff;border:none;padding:14px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px">
          ${_waIcon()} Re-open WhatsApp →
        </button>
      </a>
      <button class="btn-back" style="width:100%;padding:12px"
        onclick="closeCheckout();cart.length=0;updateCartBadge();renderCartItems();toast('🐝 Order placed! Ref: ${ref}')">
        Continue Shopping
      </button>
    </div>`;
}

async function _sendConfirmationEmail({ customer, ref, itemLines, subtotal, waURL }) {
  try {
    await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, {
      to_name:      `${customer.fname} ${customer.lname}`,
      to_email:     customer.email,
      order_ref:    ref,
      order_items:  itemLines,
      order_total:  `${CONFIG.CURRENCY}${subtotal.toLocaleString()}`,
      phone:        customer.phone,
      address:      `${customer.address}, ${customer.city}, ${customer.state}`,
      store_name:   CONFIG.STORE_NAME,
      whatsapp_url: waURL,
      reply_to:     customer.email,
    });
    return true;
  } catch (err) {
    console.warn('EmailJS error:', err);
    return false;
  }
}

function openWhatsApp(message) {
  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function _waIcon(size = 18) {
  return `<svg style="width:${size}px;height:${size}px;fill:#fff;flex-shrink:0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
}
