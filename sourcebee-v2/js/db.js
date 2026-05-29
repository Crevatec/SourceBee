// ============================================================
//  db.js  —  FIRESTORE DATABASE LAYER
//  Orders, Products (admin-managed), Admin check
// ============================================================

let db = null;

function initDB() {
  if (typeof firebase === 'undefined' || !firebase.apps.length) return;
  db = firebase.firestore();
  console.log('✅ Firestore connected — SourceBee');
  if (CONFIG.FEATURES.LOAD_PRODUCTS_FROM_DB) loadProductsFromDB();
}

// ── ADMIN CHECK ───────────────────────────────────────────────
function isAdmin(user) {
  return user && user.email === CONFIG.ADMIN_EMAIL;
}

function checkAdminAccess() {
  const user = firebase.auth().currentUser;
  if (!isAdmin(user)) {
    toast('🔒 Admin access only. Please sign in with the admin account.');
    showPage('home');
    return false;
  }
  return true;
}

// ── ORDERS ────────────────────────────────────────────────────

async function saveOrder(orderData) {
  if (!db || !CONFIG.FEATURES.SAVE_ORDERS_TO_DB) return false;
  try {
    await db.collection('orders').doc(orderData.ref).set({
      ...orderData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'pending_payment',
      storeName: CONFIG.STORE_NAME,
    });
    console.log('✅ Order saved:', orderData.ref);
    return true;
  } catch (err) {
    console.error('❌ Order save failed:', err);
    return false;
  }
}

async function fetchRecentOrders(limit = 30) {
  if (!db) return [];
  try {
    const snap = await db.collection('orders')
      .where('storeName', '==', CONFIG.STORE_NAME)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('❌ fetchRecentOrders failed:', err);
    return [];
  }
}

async function updateOrderStatus(ref, status) {
  if (!db) return;
  await db.collection('orders').doc(ref).update({
    status,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// ── CONFIRMATION CODE SYSTEM ──────────────────────────────────

/**
 * Generate a unique confirmation code for a paid order.
 * Called by admin when they confirm payment on WhatsApp.
 * Saves code to Firestore and returns it so admin can send to customer.
 *
 * @param {string} orderRef  e.g. "SBE-X7K2M9"
 * @returns {string|null}    e.g. "CONF-4829-BEE"
 */
async function generateConfirmationCode(orderRef) {
  if (!db) return null;
  try {
    // Build a unique code: CONF-XXXX-BEE
    const rand  = Math.random().toString(36).substr(2, 4).toUpperCase();
    const code  = `CONF-${rand}-BEE`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.collection('orders').doc(orderRef).update({
      confirmationCode: code,
      confirmationCodeGeneratedAt: firebase.firestore.FieldValue.serverTimestamp(),
      confirmationCodeExpiresAt: expiresAt,
      confirmationCodeUsed: false,
      status: 'confirmed',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Confirmation code generated for ${orderRef}: ${code}`);
    return code;
  } catch (err) {
    console.error('❌ generateConfirmationCode failed:', err);
    return null;
  }
}

/**
 * Verify a confirmation code entered by customer on the website.
 * Returns the order data if valid, null if not.
 *
 * @param {string} code  e.g. "CONF-4829-BEE"
 * @returns {object|null}
 */
async function verifyConfirmationCode(code) {
  if (!db || !code) return null;
  try {
    const snap = await db.collection('orders')
      .where('storeName', '==', CONFIG.STORE_NAME)
      .where('confirmationCode', '==', code.trim().toUpperCase())
      .limit(1)
      .get();

    if (snap.empty) return null;

    const order = { id: snap.docs[0].id, ...snap.docs[0].data() };

    // Check expiry
    if (order.confirmationCodeExpiresAt) {
      const expiry = order.confirmationCodeExpiresAt.toDate
        ? order.confirmationCodeExpiresAt.toDate()
        : new Date(order.confirmationCodeExpiresAt);
      if (new Date() > expiry) return { expired: true, order };
    }

    return { valid: true, order };
  } catch (err) {
    console.error('❌ verifyConfirmationCode failed:', err);
    return null;
  }
}

/**
 * Mark confirmation code as used after receipt is generated.
 */
async function markCodeUsed(orderRef) {
  if (!db) return;
  await db.collection('orders').doc(orderRef).update({
    confirmationCodeUsed: true,
    receiptGeneratedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// ── PRODUCTS ──────────────────────────────────────────────────

async function loadProductsFromDB() {
  if (!db) return;
  try {
    const snap = await db.collection('products')
      .where('storeName', '==', CONFIG.STORE_NAME)
      .where('active', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    if (!snap.empty) {
      allProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (typeof renderGrid === 'function') {
        renderGrid('featuredGrid', allProducts.slice(0, 8));
        renderGrid('newGrid', allProducts.filter(p => p.isNew).slice(0, 4));
        renderGrid('shopGrid', allProducts);
      }
      console.log(`✅ Loaded ${allProducts.length} products from Firestore`);
    }
  } catch (err) {
    console.warn('⚠️ Using local products (Firestore load failed):', err.message);
  }
}

async function saveProductToDB(product, existingId = null) {
  if (!db) return null;
  const data = {
    ...product,
    storeName: CONFIG.STORE_NAME,
    active: true,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  if (existingId) {
    await db.collection('products').doc(existingId).update(data);
    return existingId;
  } else {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const ref = await db.collection('products').add(data);
    return ref.id;
  }
}

async function deleteProductFromDB(id) {
  if (!db) return;
  await db.collection('products').doc(id).update({ active: false });
  toast('🗑️ Product removed');
  loadProductsFromDB();
}

async function loadAdminProducts() {
  if (!db) return [];
  try {
    const snap = await db.collection('products')
      .where('storeName', '==', CONFIG.STORE_NAME)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('❌ loadAdminProducts failed:', err);
    return [];
  }
}
