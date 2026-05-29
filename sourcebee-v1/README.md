# SourceBee — v1

> *Shop It. We Source It. We Deliver It.* · First modular build

![Version](https://img.shields.io/badge/version-2.0-purple)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20Firebase%20%7C%20Firestore-orange)
![Status](https://img.shields.io/badge/status-superseded%20by%20v3-yellow)

---

## Overview

This is the first version of the SourceBee website. It was built by refactoring a monolithic
single-file codebase into a clean modular architecture, adding Firebase Authentication and
a Firestore database to save orders, and introducing a seller dashboard.

> ⚠️ This version has been superseded by **sourcebee-v3** which adds a chatbot, confirmation
> code system, PDF receipts, self-upload admin panel, and all 36 Nigerian states.
> See the root [README](../README.md) for the full comparison.

---

## What Was Built in v1

- 🔀 Split 1 monolithic file into **9 focused JS modules**
- 🗄️ Connected **Firestore** — every order is saved to the database
- 🔐 **Firebase Authentication** — Google + email/password login
- 💳 **3-step checkout** — Delivery → Bank Payment → WhatsApp confirm
- 🏦 Bank account card with one-tap copy button
- 📲 WhatsApp receipt upload flow with order details pre-filled
- 📧 EmailJS order confirmation emails
- 📊 Seller dashboard — add/edit products, view orders
- 🌍 12 Nigerian states in delivery dropdown

---

## File Structure

```
sourcebee-v2/
├── index.html          # Page shell — nav, grids, modals, script tags
├── css/
│   └── styles.css      # All styling
└── js/
    ├── config.js       # ⭐ All business settings — only file changed per business
    ├── products.js     # Starter product catalogue
    ├── db.js           # Firestore — save/fetch orders and products
    ├── cart.js         # Cart state and all cart functions
    ├── checkout.js     # 3-step checkout + WhatsApp redirect + email
    ├── ui.js           # Page navigation, grid render, filters, toast
    └── auth.js         # Firebase auth — signin, signup, Google, signout
```

---

## Key Config (config.js)

```js
const CONFIG = {
  STORE_NAME:      'SourceBee',
  WHATSAPP_NUMBER: '2349020740713',
  BANK_NAME:       'Opay',
  ACCOUNT_NAME:    'Olatunji Oluwaseyi Elizabeth',
  ACCOUNT_NUMBER:  '8118238821',
  EMAILJS_PUBLIC_KEY:  'YOUR_KEY',
  EMAILJS_SERVICE_ID:  'service_mnbdjgj',
  EMAILJS_TEMPLATE_ID: 'YOUR_TEMPLATE',
  FIREBASE: { /* Firebase config object */ },
  FEATURES: {
    SAVE_ORDERS_TO_DB:     true,
    LOAD_PRODUCTS_FROM_DB: false,
    SHOW_SELLER_DASHBOARD: true,
  },
};
```

---

## What Was Missing (Fixed in v2)

| Gap in v1 | Solution in v2 |
|-----------|---------------|
| Only 12 states in delivery | All 36 states + FCT |
| No chatbot | Bee — smart rule-based assistant |
| No payment verification system | Confirmation code (CONF-XXXX-BEE) |
| No receipt for customers | PDF receipt generator |
| Admin can't upload from website | Full self-upload admin panel |
| Generic S&E brand | SourceBee brand identity + logo |
| Limited categories | Fashion, Shoes, Accessories, Hair, Electronics, Home, Books, Pets, Sourcing |

---

*See [sourcebee-v3](../sourcebee-v2) for the current production version.*
