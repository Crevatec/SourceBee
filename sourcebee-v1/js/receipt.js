// ============================================================
//  receipt.js  —  CONFIRMATION CODE VERIFICATION + PDF RECEIPT
//  Customer enters their code, system verifies, receipt downloads
// ============================================================

async function verifyAndGenerateReceipt() {
  const input = document.getElementById('confirmCodeInput');
  const code  = input?.value.trim().toUpperCase();
  const btn   = document.getElementById('verifyCodeBtn');
  const result= document.getElementById('codeVerifyResult');

  if (!code) { result.innerHTML = `<span style="color:var(--red)">⚠️ Please enter your confirmation code</span>`; return; }
  if (!code.startsWith('CONF-')) {
    result.innerHTML = `<span style="color:var(--red)">⚠️ Invalid code format. It should look like: CONF-XXXX-BEE</span>`;
    return;
  }

  btn.disabled = true; btn.textContent = '🔍 Verifying…';
  result.innerHTML = `<span style="color:var(--muted)">Checking your code…</span>`;

  const res = await verifyConfirmationCode(code);

  if (!res) {
    result.innerHTML = `<span style="color:var(--red)">❌ Code not found. Please check and try again, or contact us on WhatsApp.</span>`;
    btn.disabled = false; btn.textContent = '🔐 Verify & Get Receipt';
    return;
  }

  if (res.expired) {
    result.innerHTML = `<span style="color:var(--red)">⏰ This code has expired (valid for 7 days). Please contact us on WhatsApp for a new one.</span>`;
    btn.disabled = false; btn.textContent = '🔐 Verify & Get Receipt';
    return;
  }

  if (res.valid) {
    result.innerHTML = `<span style="color:var(--green)">✅ Code verified! Generating your receipt…</span>`;
    await generatePDFReceipt(res.order, code);
    await markCodeUsed(res.order.ref || res.order.id);
    btn.disabled = false; btn.textContent = '🔐 Verify & Get Receipt';
    result.innerHTML = `<span style="color:var(--green)">✅ Receipt downloaded! Check your downloads folder. 🧾</span>`;
    if (input) input.value = '';
  }
}

// ── PDF RECEIPT GENERATOR (pure HTML → print) ─────────────────

function generatePDFReceipt(order, code) {
  const cur   = CONFIG.CURRENCY;
  const date  = new Date().toLocaleDateString('en-NG', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const items = (order.items || []).map(i =>
    `<tr>
      <td style="padding:10px 8px;border-bottom:1px solid #eee">${i.emoji || '📦'} ${i.name}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right">${cur}${(i.price||0).toLocaleString()}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;font-weight:700">${cur}${((i.price||0)*(i.qty||1)).toLocaleString()}</td>
    </tr>`
  ).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SourceBee Receipt — ${order.ref}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #1E1B2E; padding: 40px; max-width: 680px; margin: 0 auto; }
    .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 24px; border-bottom: 3px solid #7C3AED; margin-bottom: 24px; }
    .brand { font-size: 1.8rem; font-weight: 900; color: #7C3AED; }
    .brand span { color: #F59E0B; }
    .receipt-title { font-size: 13px; color: #6B7280; text-align: right; }
    .receipt-title strong { font-size: 1.1rem; color: #1E1B2E; display: block; margin-top: 4px; }
    .confirmed-badge { background: #D1FAE5; color: #065F46; font-weight: 800; font-size: 13px; padding: 6px 16px; border-radius: 20px; border: 1.5px solid #6EE7B7; display: inline-block; margin-bottom: 20px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .info-box { background: #FAF5FF; border-radius: 10px; padding: 16px; }
    .info-label { font-size: 11px; font-weight: 700; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .info-val { font-size: 13px; line-height: 1.7; color: #1E1B2E; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    thead th { background: #7C3AED; color: #fff; padding: 10px 8px; text-align: left; font-size: 12px; font-weight: 700; }
    thead th:nth-child(2), thead th:nth-child(3), thead th:nth-child(4) { text-align: center; }
    thead th:nth-child(4) { text-align: right; }
    .total-row td { padding: 12px 8px; font-weight: 800; font-size: 15px; }
    .total-row td:last-child { color: #7C3AED; font-size: 1.2rem; }
    .code-section { background: linear-gradient(135deg, #2D1B69, #4C1D95); border-radius: 12px; padding: 20px; text-align: center; color: #fff; margin: 24px 0; }
    .code-label { font-size: 12px; opacity: 0.7; margin-bottom: 6px; }
    .code-value { font-size: 1.8rem; font-weight: 900; color: #F59E0B; letter-spacing: 4px; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #6B7280; line-height: 1.8; }
    .footer strong { color: #7C3AED; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Source<span>Bee</span> 🐝</div>
    <div class="receipt-title">
      Payment Receipt
      <strong>${order.ref}</strong>
      ${date}
    </div>
  </div>

  <div class="confirmed-badge">✅ PAYMENT CONFIRMED</div>

  <div class="info-grid">
    <div class="info-box">
      <div class="info-label">👤 Customer Details</div>
      <div class="info-val">
        <strong>${order.customer?.fname || ''} ${order.customer?.lname || ''}</strong><br>
        📞 ${order.customer?.phone || 'N/A'}<br>
        ✉️ ${order.customer?.email || 'N/A'}
      </div>
    </div>
    <div class="info-box">
      <div class="info-label">🚚 Delivery Address</div>
      <div class="info-val">
        ${order.customer?.address || 'N/A'}<br>
        ${order.customer?.city || ''}, ${order.customer?.state || ''}<br>
        Nigeria
      </div>
    </div>
    <div class="info-box">
      <div class="info-label">💳 Payment Details</div>
      <div class="info-val">
        Method: Bank Transfer<br>
        Bank: ${CONFIG.BANK_NAME}<br>
        Account: ${CONFIG.ACCOUNT_NUMBER}
      </div>
    </div>
    <div class="info-box">
      <div class="info-label">📦 Order Status</div>
      <div class="info-val">
        Status: <strong style="color:#065F46">Confirmed ✅</strong><br>
        Order Ref: <strong>${order.ref}</strong><br>
        Receipt Date: ${new Date().toLocaleDateString('en-NG')}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th></tr>
    </thead>
    <tbody>
      ${items}
      <tr class="total-row" style="background:#FAF5FF">
        <td colspan="3" style="text-align:right;padding:12px 8px;font-weight:800">TOTAL PAID</td>
        <td style="text-align:right;padding:12px 8px;color:#7C3AED;font-size:1.2rem;font-weight:900">${cur}${(order.subtotal||0).toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="code-section">
    <div class="code-label">CONFIRMATION CODE</div>
    <div class="code-value">${code}</div>
    <div style="font-size:11px;opacity:0.6;margin-top:6px">Keep this code safe — it confirms your payment</div>
  </div>

  <div class="footer">
    Thank you for shopping with <strong>SourceBee</strong>! 🐝<br>
    Questions? WhatsApp us: +${CONFIG.WHATSAPP_NUMBER}<br>
    <em>Find It. Source It. Deliver It.</em>
  </div>

  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

  // Open in new tab and trigger print/save as PDF
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (!win) toast('⚠️ Please allow popups to download your receipt');
  return Promise.resolve();
}
