// ============================================================
//  chatbot.js  —  SOURCEBEE SMART CHATBOT
//  Rule-based, no API needed, answers from product + store data
//  Add new Q&A pairs in the KNOWLEDGE BASE section below
// ============================================================

let chatOpen     = false;
let chatHistory  = []; // { role: 'bot'|'user', text: string }
let chatTyping   = false;

// ── KNOWLEDGE BASE ────────────────────────────────────────────
// Each entry: { patterns: [keywords], response: string | function }
// Patterns are checked against lowercased user input.

const CHAT_KB = [

  // GREETING
  {
    patterns: ['hi','hello','hey','good morning','good afternoon','good evening','start','help'],
    response: () => `Hi there! 👋 Welcome to *${CONFIG.STORE_NAME}*! 🐝\n\nI'm Bee, your shopping assistant. I can help you with:\n• 🛍️ Products & prices\n• 🚚 Delivery & states\n• 💳 How to pay\n• 🔐 Confirmation codes\n• 🔍 Custom sourcing\n\nWhat would you like to know?`,
  },

  // PRODUCTS
  {
    patterns: ['product','what do you sell','what do you have','catalogue','items','stock','available'],
    response: () => {
      const cats = [...new Set(allProducts.map(p => p.cat))];
      const catLabels = { fashion:'👗 Fashion', shoes:'👠 Shoes & Bags', hair:'💇 Wigs & Hair', electronics:'📱 Electronics', home:'🏠 Kitchen & Home', books:'📚 Books', pets:'🐾 Pet Items', sourcing:'🔍 Custom Sourcing' };
      return `We carry *${allProducts.filter(p=>p.cat!=='sourcing').length}+ products* across these categories:\n\n${cats.map(c => catLabels[c] || c).join('\n')}\n\nBrowse the shop or tell me a category and I'll show you what's available! 🐝`;
    },
  },

  // SPECIFIC CATEGORY — Fashion
  { patterns: ['fashion','dress','cloth','shirt','trouser','outfit','wear','ankara'],
    response: () => _showCatProducts('fashion', '👗 Fashion') },

  // Shoes & Bags
  { patterns: ['shoe','bag','sandal','heel','boot','sneaker','purse','handbag'],
    response: () => _showCatProducts('shoes', '👠 Shoes & Bags') },

  // Wigs & Hair
  { patterns: ['wig','hair','lace','frontal','bundle','braid','weave'],
    response: () => _showCatProducts('hair', '💇 Wigs & Hair') },

  // Electronics
  { patterns: ['phone','electronic','gadget','earphone','earbuds','powerbank','watch','charger','laptop'],
    response: () => _showCatProducts('electronics', '📱 Electronics') },

  // Home
  { patterns: ['kitchen','home','cookware','pot','pan','kettle','blender','appliance','furniture'],
    response: () => _showCatProducts('home', '🏠 Kitchen & Home') },

  // Books
  { patterns: ['book','read','novel','fiction','self help','business book'],
    response: () => _showCatProducts('books', '📚 Books') },

  // Pets
  { patterns: ['pet','dog','cat','animal','collar','leash'],
    response: () => _showCatProducts('pets', '🐾 Pet Items') },

  // PRICE RANGE
  { patterns: ['cheap','affordable','budget','low price','cheapest'],
    response: () => {
      const sorted = [...allProducts].filter(p=>p.price>0).sort((a,b)=>a.price-b.price).slice(0,5);
      return `Here are our most affordable items 💰:\n\n${sorted.map(p=>`${p.emoji} *${p.name}*\n   ${CONFIG.CURRENCY}${p.price.toLocaleString()}`).join('\n\n')}\n\nClick any product in the shop to add to cart!`;
    },
  },

  // DELIVERY
  { patterns: ['deliver','delivery','ship','shipping','location','state','where','nationwide','abuja','lagos','kano','rivers','ibadan','port harcourt'],
    response: `Yes! 🚚 We deliver to *all 36 states + FCT* across Nigeria!\n\nDelivery time is typically:\n• Lagos: 1–2 days\n• South West/South South: 2–3 days\n• North/East: 3–5 days\n\nDelivery fee is calculated based on your location and will be discussed on WhatsApp after your order. 📦`,
  },

  // PAYMENT
  { patterns: ['pay','payment','how to pay','transfer','bank','opay','account number','account'],
    response: () => `Here's how to pay 💳:\n\n1. Add items to cart & checkout\n2. Fill your delivery details\n3. Transfer the total to:\n\n   🏦 *${CONFIG.BANK_NAME}*\n   👤 *${CONFIG.ACCOUNT_NAME}*\n   🔢 *${CONFIG.ACCOUNT_NUMBER}*\n\n4. Screenshot your receipt\n5. Send it on WhatsApp\n6. We confirm & send your *Confirmation Code* 🔐\n\nSimple and secure! 🐝`,
  },

  // CONFIRMATION CODE
  { patterns: ['confirm','confirmation','code','serial','receipt','verify','verification'],
    response: `Here's how the confirmation system works 🔐:\n\n1. You place your order & pay\n2. Send your receipt on WhatsApp\n3. We verify your payment\n4. We send you a *CONF-XXXX-BEE* code on WhatsApp\n5. Enter the code in *"Confirm My Order"* on the website\n6. Your PDF receipt downloads automatically! 🧾\n\nYour code is valid for *7 days*. Need help? Chat us on WhatsApp!`,
  },

  // CUSTOM SOURCING
  { patterns: ['source','sourcing','custom','find','cant find','looking for','request','any product'],
    response: `That's our speciality! 🔍 *SourceBee can find almost any product!*\n\nHere's how:\n1. Click the WhatsApp button below\n2. Send us a description, photo, or link\n3. We confirm availability & price\n4. You pay & we deliver!\n\nWe source from local markets, online stores, and even international suppliers. 🌍\n\n*No product is too hard to find for the bee!* 🐝`,
  },

  // HOW LONG
  { patterns: ['how long','time','days','when will','fast','quick','duration'],
    response: `⏱️ Here's our typical timeline:\n\n📦 *Order Processing:* 24 hours after payment confirmed\n🚚 *Lagos delivery:* 1–2 days\n🚚 *Other South states:* 2–3 days\n🚚 *North/East states:* 3–5 days\n\nYou'll get WhatsApp updates at every step! 📱`,
  },

  // RETURN / REFUND
  { patterns: ['return','refund','exchange','wrong item','damaged','complaint'],
    response: `We want you 100% happy! 🐝 Here's our policy:\n\n✅ *Wrong item received* — Full replacement, no questions asked\n✅ *Damaged on arrival* — Replacement or refund\n✅ *Change of mind* — Contact us within 24hrs of delivery\n\nJust send us a WhatsApp message with your order ref and photos. We'll sort it out quickly! 💛`,
  },

  // TRACK ORDER
  { patterns: ['track','where is my order','order status','update'],
    response: `To track your order 📦:\n\n1. Have your *Order Ref* ready (e.g. SBE-X7K2M)\n2. Send it to us on WhatsApp\n3. We'll update you immediately!\n\nYou can also check your status using your *Confirmation Code* on the website. 🔐`,
  },

  // CONTACT
  { patterns: ['contact','call','whatsapp','reach','speak','talk','phone number'],
    response: () => `You can reach us on WhatsApp anytime! 📱\n\n*${CONFIG.STORE_NAME}*\n📞 +${CONFIG.WHATSAPP_NUMBER}\n\nWe're available:\n🕗 Mon–Sat: 8am – 9pm\n🕗 Sunday: 10am – 6pm\n\nClick the green WhatsApp button on the website to chat now! 💬`,
  },

  // THANKS
  { patterns: ['thank','thanks','thank you','appreciate','ok','okay','cool','nice','great','perfect'],
    response: `You're welcome! 🐝💛 Is there anything else I can help you with?\n\nFeel free to browse the shop or click the WhatsApp button to chat with our team directly!`,
  },

  // BYE
  { patterns: ['bye','goodbye','see you','exit','close','later'],
    response: `Goodbye! 🐝 Thanks for visiting ${CONFIG.STORE_NAME}!\n\nDon't forget to check out our latest products. See you soon! 💛`,
  },
];

// Helper — show products from a category
function _showCatProducts(cat, label) {
  const items = allProducts.filter(p => p.cat === cat).slice(0, 4);
  if (!items.length) return `We're updating our ${label} collection. Check back soon! 🐝`;
  return `Here are some of our *${label}* items 🛍️:\n\n${items.map(p =>
    `${p.emoji} *${p.name}*\n   ${CONFIG.CURRENCY}${p.price.toLocaleString()}${p.old ? ` ~~${CONFIG.CURRENCY}${p.old.toLocaleString()}~~` : ''}`
  ).join('\n\n')}\n\nVisit the shop to see all ${label} products!`;
}

// ── MATCH ENGINE ──────────────────────────────────────────────

function _matchResponse(input) {
  const lower = input.toLowerCase().trim();

  // Check each KB entry
  for (const entry of CHAT_KB) {
    const matched = entry.patterns.some(p => lower.includes(p));
    if (matched) {
      return typeof entry.response === 'function' ? entry.response() : entry.response;
    }
  }

  // Check if user mentions a specific product name
  const matchedProd = allProducts.find(p => lower.includes(p.name.toLowerCase().split(' ')[0]));
  if (matchedProd) {
    return `I found this for you! 🐝\n\n${matchedProd.emoji} *${matchedProd.name}*\n💰 ${CONFIG.CURRENCY}${matchedProd.price.toLocaleString()}${matchedProd.old ? `\n~~Was: ${CONFIG.CURRENCY}${matchedProd.old.toLocaleString()}~~` : ''}\n\nClick on the product in the shop to add it to your cart!`;
  }

  // Fallback
  return `Hmm, I'm not sure about that one! 🤔\n\nI can help you with:\n• Products & prices\n• Delivery info\n• Payment process\n• Confirmation codes\n• Custom sourcing\n\nOr click the WhatsApp button to chat with our team directly! 💬`;
}

// ── RENDER CHAT UI ────────────────────────────────────────────

function renderChatMessages() {
  const box = document.getElementById('chatMessages');
  if (!box) return;
  box.innerHTML = chatHistory.map(m => `
    <div class="chat-msg chat-msg-${m.role}">
      ${m.role === 'bot' ? `<div class="chat-avatar">🐝</div>` : ''}
      <div class="chat-bubble chat-bubble-${m.role}">${m.text.replace(/\n/g,'<br>').replace(/\*(.*?)\*/g,'<strong>$1</strong>').replace(/~~(.*?)~~/g,'<s>$1</s>')}</div>
    </div>`).join('');
  box.scrollTop = box.scrollHeight;
}

function _addMessage(role, text) {
  chatHistory.push({ role, text });
  renderChatMessages();
}

function _showTyping() {
  const box = document.getElementById('chatMessages');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'chat-msg chat-msg-bot';
  el.id = 'chatTypingIndicator';
  el.innerHTML = `<div class="chat-avatar">🐝</div><div class="chat-bubble chat-bubble-bot chat-typing"><span></span><span></span><span></span></div>`;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

function _hideTyping() {
  document.getElementById('chatTypingIndicator')?.remove();
}

// ── PUBLIC FUNCTIONS ──────────────────────────────────────────

function toggleChat() {
  chatOpen = !chatOpen;
  const window_ = document.getElementById('chatWindow');
  const badge   = document.getElementById('chatBadge');
  if (!window_) return;
  window_.style.display = chatOpen ? 'flex' : 'none';
  if (badge) badge.style.display = 'none';

  // Greet on first open
  if (chatOpen && chatHistory.length === 0) {
    setTimeout(() => {
      _addMessage('bot', `Hi there! 👋 Welcome to *${CONFIG.STORE_NAME}*! 🐝\n\nI'm Bee, your shopping assistant. How can I help you today?\n\nYou can ask me about products, delivery, payment, or anything else!`);
    }, 400);
  }
}

async function sendChatMessage() {
  if (chatTyping) return;
  const input = document.getElementById('chatInput');
  const text  = input?.value.trim();
  if (!text) return;

  input.value = '';
  _addMessage('user', text);
  chatTyping = true;
  _showTyping();

  // Simulate thinking delay (feels natural)
  const delay = 600 + Math.random() * 800;
  setTimeout(() => {
    _hideTyping();
    const response = _matchResponse(text);
    _addMessage('bot', response);
    chatTyping = false;

    // If response suggests WhatsApp, show quick action
    if (text.toLowerCase().includes('source') || text.toLowerCase().includes('custom') || text.toLowerCase().includes('contact')) {
      setTimeout(() => {
        _addMessage('bot', `💬 *Quick action:* <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi SourceBee! 🐝 I need help with: ' + text)}" target="_blank" style="color:var(--primary);font-weight:700">Chat us on WhatsApp →</a>`);
      }, 800);
    }
  }, delay);
}

function chatKeyPress(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

// Quick reply chips
function chatQuickReply(text) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = text; sendChatMessage(); }
}
