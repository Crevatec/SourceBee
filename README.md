# SourceBee 🐝

> *Shop It. We Source It. We Deliver It.*

[![Live](https://img.shields.io/badge/Netlify-Live-brightgreen)](#)
![Built With](https://img.shields.io/badge/built%20with-HTML%20%7C%20CSS%20%7C%20JS-blueviolet)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-orange)
![Brand](https://img.shields.io/badge/brand-Purple%20·%20Gold%20·%20White-purple)

---

SourceBee is a Nigerian online retail and product sourcing brand with 4–5 years of experience.
Customers can buy ready stock, place pre-orders, or request **any product** by sending a picture
or description. This repository documents the full journey of building the brand's e-commerce
website — from a first working version to a production-ready platform.

---

## 📁 Repository Structure

```
sourcebee/
├── README.md               ← You are here — full project story
├── sourcebee-v1/           ← First build — modular architecture + Firestore
│   ├── index.html
│   ├── css/styles.css
│   ├── js/  (7 files)
│   └── README.md
└── sourcebee-v2/           ← Current production — full featured
    ├── index.html
    ├── assets/logo.png
    ├── css/styles.css
    ├── js/  (10 files)
    └── README.md
```

> **Want to deploy?** Use `sourcebee-v2` — it is the current live version.
> `sourcebee-v1` is kept to document growth and for reference.

---

## 🚀 The Growth Story

### v1 — First Build: Breaking the Monolith

The project started life as a single 1,680-line `index.html` file (the S&E Enterprise template).
For SourceBee, the entire codebase was broken apart into focused modules, a real database was
connected, and a seller dashboard was introduced for the first time.

**What v1 introduced:**
- Split into **7 JS modules** — each file has one job
- **Firestore database** — every order is saved, not just sent to WhatsApp
- **Firebase Authentication** — Google + email/password login
- **3-step checkout** — Delivery → Bank Payment details → WhatsApp confirm
- **Opay bank card** — account number displayed with copy button
- **Seller dashboard** — add/edit products, view orders
- **EmailJS** — automatic order confirmation emails

**What v1 was missing:**
- Only 12 Nigerian states in delivery
- No way for customers to verify payment
- No official receipt for customers
- Business owner had to edit code to add products
- No customer support assistant

---

### v2 — Production: Complete Platform

Built directly on v1, every gap was closed. The codebase grew from 7 to 10 JS files. Three
entirely new systems were added — the chatbot, the confirmation code system, and the self-upload
admin panel — turning the website from a storefront into a complete business tool.

**What v2 added:**

| Feature | Detail |
|---------|--------|
| 🌍 All 36 states + FCT | Every Nigerian state in the delivery dropdown |
| 🔐 Confirmation code system | Admin confirms payment → generates `CONF-XXXX-BEE` → customer redeems on website |
| 🧾 PDF receipt generator | Auto-generated receipt downloads after code is verified |
| 🤖 Bee — smart chatbot | Rule-based assistant — products, delivery, payment, sourcing — no API cost |
| ⚙️ Self-upload admin panel | Business owner adds/edits/deletes products from the website — no code needed |
| 🐝 Brand identity | Logo, Purple/Gold/White colour scheme, brand copy from business document |
| 📦 More categories | Added Accessories — now 9 categories total |
| 🔁 Resend code | Admin can resend confirmation code anytime from order row |

---

## 📊 Version Comparison

| | v1 | v2 |
|---|---|---|
| **JS files** | 7 | 10 |
| **Total lines of code** | ~1,400 | ~2,800 |
| **Nigerian states** | 12 | 36 + FCT |
| **Product categories** | 8 | 9 |
| **Database** | Firestore orders | Firestore orders + products + codes |
| **Chatbot** | ❌ | ✅ Bee (rule-based) |
| **Payment verification** | WhatsApp only | WhatsApp + Confirmation code |
| **Customer receipt** | ❌ | ✅ Auto PDF |
| **Admin product upload** | Edit code | ✅ Website form |
| **Brand assets** | Generic | ✅ Logo + Purple/Gold |
| **Confirmation code** | ❌ | ✅ CONF-XXXX-BEE |

---

## 🔐 How the Confirmation Code System Works

This is the most important new feature in v3. It gives customers proof of payment and keeps
the business owner in full control of order confirmation.

```
1. Customer adds items → checks out → fills delivery details
2. Bank transfer details shown → customer pays to Opay account
3. Customer sends payment screenshot on WhatsApp
        ↓
4. Admin opens Admin Panel → finds the order → clicks "✅ Confirm Payment"
5. System generates a unique code:  CONF-XXXX-BEE
6. Code saved to Firestore against that order
7. WhatsApp opens pre-filled with the code → admin sends to customer
        ↓
8. Customer receives code on WhatsApp
9. Customer visits website → finds "Confirm My Order" section
10. Enters code → system verifies against Firestore
11. PDF receipt auto-generates and downloads
12. Order marked ✅ Confirmed in database
```

Code is valid for **7 days**. Admin can resend anytime.

---

## 🤖 How the Bee Chatbot Works

Bee is a rule-based assistant — no external API, no monthly cost, works offline.

It knows:
- All products and prices in the catalogue
- All 9 product categories
- Delivery to all 36 states (times and fees)
- How to pay (Opay bank transfer process)
- How the confirmation code system works
- How to request a custom-sourced product
- Returns and exchange policy
- How to track an order

If a question falls outside its knowledge, it routes automatically to WhatsApp.
Quick reply chips let customers tap common questions without typing.

---

## 🏗️ Architecture

Both versions use the same core pattern — **one config file per business**, everything else reusable.

```
config.js          ← Business identity: name, WhatsApp, bank, Firebase, colours
products.js        ← Product catalogue (fallback before Firestore has data)
db.js              ← All Firestore operations: orders, products, codes
cart.js            ← Cart state and all cart functions
checkout.js        ← 3-step checkout + WhatsApp + email
ui.js              ← Page navigation, grids, filters, toast
auth.js            ← Firebase auth: signin, signup, Google, signout
admin.js     (v3)  ← Self-upload admin panel
chatbot.js   (v3)  ← Bee rule-based chatbot
receipt.js   (v3)  ← Confirmation code verifier + PDF receipt
```

> To build for a new business: copy the folder, update only `config.js`, deploy.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Vanilla HTML/CSS/JS | Frontend — no framework, no build step |
| Firebase Auth | Customer + admin authentication |
| Firestore | Orders, products, confirmation codes |
| EmailJS | Order confirmation emails (browser-side) |
| Netlify | Hosting — drag and drop deploy |

---

## ⚙️ Setup (v2)

### 1 — config.js
Open `sourcebee-v2/js/config.js` and update:

```js
WHATSAPP_NUMBER: '2349020740713',   // International format, no +
BANK_NAME:      'Opay',
ACCOUNT_NAME:   'Olatunji Oluwaseyi Elizabeth',
ACCOUNT_NUMBER: '8118238821',
ADMIN_EMAIL:    'your@email.com',   // Only this email sees the Admin panel
EMAILJS_PUBLIC_KEY:  'WV44eM6x2-3QrxNg5',
EMAILJS_SERVICE_ID:  'service_mnbdjgj',
EMAILJS_TEMPLATE_ID: 'YOUR_TEMPLATE_ID',
FIREBASE: { /* paste your Firebase config object here */ },
```

### 2 — Firebase
1. [console.firebase.google.com](https://console.firebase.google.com)
2. Project `sourcebee-1456b` → Authentication → Email/Password + Google → Enable
3. Firestore Database → Create database → Start in test mode

### 3 — Deploy
1. Drag `sourcebee-v2` folder to [netlify.com](https://netlify.com)
2. Copy the Netlify URL (e.g. `sourcebee.netlify.app`)
3. Firebase → Authentication → Authorized domains → Add domain → paste URL

---

## 📅 Planned for v3

- [ ] Cloudinary image upload — product photos directly from phone
- [ ] Real-time order notifications for admin
- [ ] Mobile app (React Native)
- [ ] Facebook shop integration

---

## 👤 Built By

**Olakunle Sunday Olalekan**
Founder, [Crevagroup](https://crevagroup.com) · Clevatec Division

Built for **SourceBee** — Olatunji Oluwaseyi Elizabeth

---

*Hardware & Engineering · Programming & Software · Consultancy · Digital Media & Branding · Training & Skill Acquisition*
