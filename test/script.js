/**
 * GYFTAR — Complete JavaScript Engine
 * ─────────────────────────────────────────────────────────────
 * Pure vanilla JS. No frameworks.
 * - Data-driven product rendering
 * - localStorage cart persistence
 * - Glassmorphism navbar scroll states
 * - Modal product details
 * - WhatsApp checkout compilation
 * - Scroll reveal animations
 */

/* ────────────────────────────────────────────────────────────
   CONSTANTS & CONFIGURATION
   ──────────────────────────────────────────────────────────── */

const WHATSAPP_NUMBER = '2348000000000';
const STORAGE_KEY = 'gyftar_cart_v1';

/* ────────────────────────────────────────────────────────────
   PRODUCT DATA — Single Source of Truth
   ──────────────────────────────────────────────────────────── */

const products = [
  {
    id: '001',
    name: 'The Executive Box',
    price: 75000,
    category: 'Corporate Prestige',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect fill="%23f4f1ed" width="400" height="500"/><text x="200" y="250" font-size="16" fill="%23999" text-anchor="middle">The Executive Box</text></svg>',
    shortDesc: 'Premium cognac, artisan chocolates & hand-stitched leather.',
    whatsInside: [
      'Hennessy VSOP Cognac (70cl)',
      'Bespoke Monogrammed Leather Notebook',
      'Handcrafted Swiss Dark Chocolates',
      'Gold-plated Executive Pen'
    ]
  },
  {
    id: '002',
    name: 'The Milestone',
    price: 120000,
    category: 'Celebration',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect fill="%23f4f1ed" width="400" height="500"/><text x="200" y="250" font-size="16" fill="%23999" text-anchor="middle">The Milestone</text></svg>',
    shortDesc: 'Champagne, 24K-touch jewellery & bespoke memory book.',
    whatsInside: [
      'Moët & Chandon Impérial Brut',
      '24K Gold Trimmed Champagne Flutes (Pair)',
      'Scented Oud Luxury Candle',
      'Custom Engraved Keepsake Box'
    ]
  },
  {
    id: '003',
    name: 'The Botanica',
    price: 58000,
    category: 'Wellness & Calm',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect fill="%23f4f1ed" width="400" height="500"/><text x="200" y="250" font-size="16" fill="%23999" text-anchor="middle">The Botanica</text></svg>',
    shortDesc: 'Rare tea leaves, hand-poured soy candle & organic bath salts.',
    whatsInside: [
      'Atlas Mountain Rose Bath Salts',
      'Kyoto Matcha Green Tea Set',
      'Hand-poured Lavender Soy Candle',
      'Silk Sleep Mask'
    ]
  },
];

/* ────────────────────────────────────────────────────────────
   CART STATE — localStorage Persistence
   ──────────────────────────────────────────────────────────── */

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Gyftar: Could not parse stored cart. Resetting.', e);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState));
  } catch (e) {
    console.warn('Gyftar: Could not save cart to localStorage.', e);
  }
}

let cartState = loadCart();

/* ────────────────────────────────────────────────────────────
   CART MUTATIONS
   ──────────────────────────────────────────────────────────── */

function addItem(product) {
  const existing = cartState.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartState.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCart();
}

function updateQty(id, delta) {
  const item = cartState.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cartState = cartState.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}

/* ────────────────────────────────────────────────────────────
   UTILITY FUNCTIONS
   ──────────────────────────────────────────────────────────── */

const getTotalItems = () => cartState.reduce((sum, i) => sum + i.qty, 0);
const getTotalPrice = () => cartState.reduce((sum, i) => sum + i.price * i.qty, 0);
const formatNGN = (n) => '₦' + n.toLocaleString('en-NG');
const escapeHTML = (str) => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

/* ────────────────────────────────────────────────────────────
   CART RENDERING
   ──────────────────────────────────────────────────────────── */

function renderCart() {
  const itemCount = getTotalItems();
  const totalPrice = getTotalPrice();
  const hasItems = itemCount > 0;

  const badge = document.getElementById('cartBadge');
  badge.textContent = itemCount;
  badge.classList.toggle('visible', hasItems);

  document.getElementById('cartCountLabel').textContent =
    `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;

  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');

  if (!hasItems) {
    cartItemsEl.innerHTML = '';
    cartItemsEl.appendChild(document.getElementById('cartEmpty'));
    cartFooter.style.display = 'none';
    return;
  }

  cartItemsEl.innerHTML = '';
  cartState.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-thumb">
        <span>IMG</span>
      </div>
      <div class="cart-item-info">
        <span class="cart-item-name">${escapeHTML(item.name)}</span>
        <span class="cart-item-price">${formatNGN(item.price)} × ${item.qty} = ${formatNGN(item.price * item.qty)}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = formatNGN(totalPrice);
  cartFooter.style.display = 'flex';
}

/* ────────────────────────────────────────────────────────────
   CART DRAWER CONTROLS
   ──────────────────────────────────────────────────────────── */

const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('cartOverlay');

function openCart() {
  drawer.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  drawer.focus();
}

function closeCart() {
  drawer.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('cartOpenBtn').addEventListener('click', openCart);
document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer.classList.contains('open')) {
    closeCart();
  }
});

/* ────────────────────────────────────────────────────────────
   EVENT DELEGATION — Add to Cart & Qty Updates
   ──────────────────────────────────────────────────────────── */

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-add-to-cart')) {
    const btn = e.target;
    const card = btn.closest('.product-card') || btn.closest('.modal-details');
    if (!card) return;

    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price, 10),
    };

    addItem(product);
    btn.classList.add('added');
    btn.textContent = 'Added ✓';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.textContent = 'Add to Cart';
    }, 1800);

    showToast(`${product.name} added to cart`);
    openCart();
  }

  if (e.target.classList.contains('qty-btn')) {
    const btn = e.target;
    const id = btn.dataset.id;
    const delta = parseInt(btn.dataset.delta, 10);
    updateQty(id, delta);
  }
});

/* ────────────────────────────────────────────────────────────
   WHATSAPP CHECKOUT
   ──────────────────────────────────────────────────────────── */

function buildWhatsAppMessage() {
  const divider = '─────────────────────';
  const lines = [];

  lines.push('🎁 *New Gyftar Order*');
  lines.push(divider);
  lines.push('');

  cartState.forEach(item => {
    const lineTotal = formatNGN(item.price * item.qty);
    lines.push(`• *${item.name}* × ${item.qty}  →  ${lineTotal}`);
  });

  lines.push('');
  lines.push(divider);
  lines.push(`*Total: ${formatNGN(getTotalPrice())}*`);
  lines.push('');
  lines.push('Please process my order. Thank you! 🙏');

  return lines.join('\n');
}

function checkoutViaWhatsApp() {
  if (cartState.length === 0) return;

  const message = buildWhatsAppMessage();
  const encoded = encodeURIComponent(message);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

document.getElementById('whatsappBtn').addEventListener('click', checkoutViaWhatsApp);

/* ────────────────────────────────────────────────────────────
   TOAST NOTIFICATIONS
   ──────────────────────────────────────────────────────────── */

let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastTimer = null;
  }, 2500);
}

/* ────────────────────────────────────────────────────────────
   PRODUCT GRID RENDERING
   ──────────────────────────────────────────────────────────── */

function renderProductGrid() {
  const grid = document.getElementById('dynamic-product-grid');
  grid.innerHTML = '';

  products.forEach(prod => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = prod.id;
    card.dataset.name = prod.name;
    card.dataset.price = prod.price;
    card.onclick = () => openProductModal(prod);

    card.innerHTML = `
      <div class="product-image">
        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
      </div>
      <div class="product-meta">
        <span class="product-category">${prod.category}</span>
        <h3 class="product-name">${prod.name}</h3>
        <div class="product-footer">
          <span class="product-price">${formatNGN(prod.price)}</span>
          <span class="btn-text">View Details →</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ────────────────────────────────────────────────────────────
   PRODUCT MODAL
   ──────────────────────────────────────────────────────────── */

const modal = document.getElementById('productModal');
const modalOverlay = document.getElementById('productModalOverlay');
const modalContent = document.getElementById('modalContent');

function openProductModal(prod) {
  const insideList = prod.whatsInside.map(item => `<li>${escapeHTML(item)}</li>`).join('');

  modalContent.innerHTML = `
    <div class="modal-image-container">
      <img src="${prod.image}" alt="${prod.name}">
    </div>
    <div class="modal-details">
      <span class="product-category">${prod.category}</span>
      <h2 class="product-name" style="font-size: 2rem; margin-bottom: 0.5rem;">${prod.name}</h2>
      <span class="product-price" style="font-size: 1.2rem;">${formatNGN(prod.price)}</span>
      
      <p style="margin-top: 1.5rem; color: var(--text-secondary); line-height: 1.6;">${prod.shortDesc}</p>
      
      <div class="modal-box-contents">
        <h4>What's Inside</h4>
        <ul>${insideList}</ul>
      </div>
      
      <button class="btn-primary btn-add-to-cart" 
              data-id="${prod.id}" 
              data-name="${prod.name}" 
              data-price="${prod.price}"
              style="width: 100%; margin-top: auto; justify-content: center;">
        Add to Cart
      </button>
    </div>
  `;

  modal.classList.add('open');
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  modal.classList.remove('open');
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modalCloseBtn').addEventListener('click', closeProductModal);
modalOverlay.addEventListener('click', closeProductModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeProductModal();
  }
});

/* ────────────────────────────────────────────────────────────
   NAVBAR SCROLL STATE — Glassmorphism Trigger
   ──────────────────────────────────────────────────────────── */

const header = document.getElementById('siteHeader');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* ────────────────────────────────────────────────────────────
   MOBILE NAVIGATION DRAWER
   ──────────────────────────────────────────────────────────── */

const mobileNavDrawer = document.getElementById('mobileNavDrawer');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeNavBtn = document.getElementById('closeNavBtn');

function openMobileNav() {
  mobileNavDrawer.classList.add('open');
  mobileNavOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNavDrawer.classList.remove('open');
  mobileNavOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', openMobileNav);
closeNavBtn.addEventListener('click', closeMobileNav);
mobileNavOverlay.addEventListener('click', closeMobileNav);

const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

/* ────────────────────────────────────────────────────────────
   SCROLL REVEAL ANIMATIONS — IntersectionObserver
   ──────────────────────────────────────────────────────────── */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
  revealObserver.observe(el);
});

/* ────────────────────────────────────────────────────────────
   TYPEWRITER EFFECT — Hero Title
   ──────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const textElement = document.getElementById('typewriter-text');
  const textToType = 'The Art of Exceptional Gifting.';
  const baseTypingSpeed = 80;
  const initialDelay = 500;

  let charIndex = 0;

  function type() {
    if (charIndex < textToType.length) {
      textElement.textContent += textToType.charAt(charIndex);
      charIndex++;
      const randomSpeed = baseTypingSpeed + (Math.random() * 40 - 20);
      setTimeout(type, randomSpeed);
    }
  }

  setTimeout(type, initialDelay);

  // Render product grid after DOM is ready
  renderProductGrid();
});

/* ────────────────────────────────────────────────────────────
   INITIALIZATION
   ──────────────────────────────────────────────────────────── */

renderCart();
