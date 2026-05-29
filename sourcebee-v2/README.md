# SourceBee — v3 (Production)

> *Shop It. We Source It. We Deliver It.* · Full-featured production build

![Version](https://img.shields.io/badge/version-3.0-brightgreen)
![Status](https://img.shields.io/badge/status-production-brightgreen)

This is the current production version. See the root [README](../README.md) for the full story.

## Everything in v3

- 🛍️ 30+ products across 9 categories
- 🌍 All 36 Nigerian states + FCT delivery
- 💳 3-step checkout — Delivery → Opay Payment → WhatsApp confirm
- 🔐 Confirmation code system (CONF-XXXX-BEE) — admin generates, customer redeems
- 🧾 Auto PDF receipt generation after code verification
- 🤖 Bee chatbot — smart rule-based assistant, no API needed
- ⚙️ Self-upload admin panel — add/edit/delete products without touching code
- 🔐 Firebase Auth (Google + email)
- 🗄️ Firestore — orders, products, confirmation codes, status tracking

## File Structure

```
sourcebee-v3/
├── index.html
├── assets/
│   └── logo.png
├── css/
│   └── styles.css
└── js/
    ├── config.js      # ⭐ Only file changed per business
    ├── products.js    # Starter catalogue
    ├── db.js          # Firestore layer
    ├── cart.js        # Cart state
    ├── checkout.js    # 3-step checkout
    ├── admin.js       # Self-upload admin panel
    ├── chatbot.js     # Bee chatbot
    ├── receipt.js     # Code verifier + PDF receipt
    ├── ui.js          # Nav, grids, filters
    └── auth.js        # Firebase auth
```

## What Changed from v2

| v2 | v3 |
|----|-----|
| 12 states | All 36 states + FCT |
| No chatbot | Bee smart chatbot |
| No confirmation | CONF-XXXX-BEE code system |
| No receipt | PDF receipt generator |
| Basic admin | Full self-upload admin panel |
| No brand assets | Logo + Purple/Gold/White identity |
| 7 JS files | 10 JS files |

## Setup

Update `js/config.js` with WhatsApp number, bank details, Firebase config, EmailJS keys and ADMIN_EMAIL. Deploy by dragging folder to netlify.com. Add Netlify URL to Firebase authorized domains.

*See [sourcebee-v2](../sourcebee-v2) for the previous version.*
