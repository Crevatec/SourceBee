// ============================================================
//  config.js  —  SOURCEBEE BUSINESS IDENTITY
//  ✅ This is the ONLY file that changes per business.
// ============================================================

const CONFIG = {

  // ── STORE IDENTITY ──────────────────────────────────────
  STORE_NAME:     'SourceBee',
  STORE_TAGLINE:  'Find It. Source It. Deliver It. 🐝',
  STORE_COUNTRY:  'Nigeria',
  CURRENCY:       '₦',

  // ── WHATSAPP ─────────────────────────────────────────────
  WHATSAPP_NUMBER: '2349020740713',

  // ── BANK PAYMENT DETAILS ─────────────────────────────────
  BANK_NAME:      'Opay',
  ACCOUNT_NAME:   'Olatunji Oluwaseyi Elizabeth',
  ACCOUNT_NUMBER: '8118238821',

  // ── EMAILJS ───────────────────────────────────────────────
  EMAILJS_PUBLIC_KEY:  'WV44eM6x2-3QrxNg5',
  EMAILJS_SERVICE_ID:  'service_mnbdjgj',
  EMAILJS_TEMPLATE_ID: 'template_sourcebee',   // ← update after creating template

  // ── ADMIN (self-upload panel) ─────────────────────────────
  // Only users with this email can access the Admin Panel
  ADMIN_EMAIL: 'olakunle4olalekan@gmail.com',   // ← replace with her email when ready

  // ── FIREBASE ─────────────────────────────────────────────
  FIREBASE: {
    apiKey:            'AIzaSyBvrpt6gTsZe3mcjVOY_GoQNW7cBqlbJXA',
    authDomain:        'sourcebee-1456b.firebaseapp.com',
    projectId:         'sourcebee-1456b',
    storageBucket:     'sourcebee-1456b.firebasestorage.app',
    messagingSenderId: '277047648085',
    appId:             '1:277047648085:web:1cd32fee3065a5baf199dc',
    measurementId:     'G-LZ569SNQCE',
  },

  // ── BRAND COLOURS (CSS vars set in styles.css) ────────────
  // Purple = brand identity | Gold = premium trust | White = clean feel
  BRAND: {
    primary:    '#7C3AED',   // Purple
    secondary:  '#F59E0B',   // Gold
    dark:       '#1E1B2E',   // Dark navy-purple
    light:      '#FAF5FF',   // Soft purple-white
  },

  // ── FEATURE FLAGS ─────────────────────────────────────────
  FEATURES: {
    SHOW_ADMIN_PANEL:      true,   // Admin product upload panel
    SAVE_ORDERS_TO_DB:     true,   // Save orders to Firestore
    LOAD_PRODUCTS_FROM_DB: true,   // Load products from Firestore (admin-uploaded)
    CUSTOM_SOURCING:       true,   // Show "Request a Product" WhatsApp button
  },

};
