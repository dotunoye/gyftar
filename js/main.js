/**
 * GYFTAR - Luxury E-Commerce Platform
 * Complete refactor with localStorage cart, drawers, & WhatsApp checkout
 * 
 * Key systems:
 * - localStorage cart engine with quantity & price tracking (₦ Naira)
 * - Dual drawers: mobile nav (left) & cart (right)
 * - Modal: product details with vertical layout
 * - Global scope: all functions attached to window object
 */

// ===========================
// GLOBAL STATE & DOM ELEMENTS
// ===========================

// Modal elements
const productModalOverlay = document.getElementById('productModalOverlay');
const productModal = document.getElementById('productModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalContent = document.getElementById('modalContent');

// Navbar elements
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarLinks = document.querySelector('.navbar-links');
const navLinks = document.querySelectorAll('.navbar-links a');
const cartIcon = document.getElementById('cartIcon');
const cartBadge = document.getElementById('cartBadge');

// Drawer elements
const mobileNavDrawer = document.getElementById('mobileNavDrawer');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsList = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const whatsappBtn = document.getElementById('whatsappBtn');

// Hero elements
let heroSlider = null;

// Modal global instance
let modalInstance = null;

// Cart state (in-memory cache of localStorage)
let cartState = [];

// ===========================
// CURRENCY FORMATTER - NGN (Naira)
// ===========================

function formatNGN(amount) {
  return '₦' + amount.toLocaleString('en-NG');
}

// ===========================
// LOCALSTORAGE CART ENGINE
// ===========================

// Initialize cart from localStorage
function initializeCart() {
  const stored = localStorage.getItem('gyftarCart');
  cartState = stored ? JSON.parse(stored) : [];
  updateCartBadge();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('gyftarCart', JSON.stringify(cartState));
  updateCartBadge();
}

// Add item to cart (global: window.addToCart)
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error(`Product ${productId} not found`);
    return;
  }

  // Check if item already in cart
  const existingItem = cartState.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cartState.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: product.image
    });
  }

  // Update DOM and storage
  saveCart();
  updateCartDrawerUI();
  
  // Open drawer to show user
  openCartDrawer();
  
  console.log(`Added '${product.name}' to cart`);
}

// Remove item from cart
function removeFromCart(productId) {
  cartState = cartState.filter(item => item.id !== productId);
  saveCart();
  updateCartDrawerUI();
}

// Update item quantity
function updateItemQty(productId, newQty) {
  const item = cartState.find(i => i.id === productId);
  if (item) {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      item.qty = newQty;
      saveCart();
      updateCartDrawerUI();
    }
  }
}

// Get total price of all items in cart
function getCartTotal() {
  return cartState.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// Get total quantity of items in cart
function getCartQuantity() {
  return cartState.reduce((sum, item) => sum + item.qty, 0);
}

// ===========================
// CART UI UPDATES
// ===========================

// Update badge showing item count
function updateCartBadge() {
  const qty = getCartQuantity();
  if (cartBadge) {
    cartBadge.textContent = qty;
    cartBadge.style.display = qty > 0 ? 'flex' : 'none';
  }
}

// Update cart drawer UI (items list + total)
function updateCartDrawerUI() {
  if (!cartItemsList) return;

  // Build items list HTML
  let itemsHTML = '';
  if (cartState.length === 0) {
    itemsHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Your cart is empty</div>';
  } else {
    itemsHTML = cartState.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-main">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <span class="cart-item-unit-price">${formatNGN(item.price)} each</span>
          
          <button class="btn-remove" onclick="window.removeFromCart('${item.id}')">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Remove
          </button>
        </div>
        <div class="cart-item-actions">
          <span class="cart-item-total">${formatNGN(item.price * item.qty)}</span>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="window.updateItemQty('${item.id}', ${item.qty -1})">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="window.updateItemQty('${item.id}', ${item.qty +1})">+</button>
          </div>
        </div>
      </div>
      </div>
    `).join('');
  }

  cartItemsList.innerHTML = itemsHTML;

  // Update total
  if (cartTotal) {
    cartTotal.textContent = formatNGN(getCartTotal());
  }

  updateCartBadge();
}

// ===========================
// DRAWER CONTROLS (Left=Mobile Nav, Right=Cart)
// ===========================

// Mobile Nav Drawer (slides from LEFT)
function openMobileNavDrawer() {
  if (mobileNavDrawer && mobileNavOverlay) {
    mobileNavDrawer.classList.add('open');
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileNavDrawer() {
  if (mobileNavDrawer && mobileNavOverlay) {
    mobileNavDrawer.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Cart Drawer (slides from RIGHT)
function openCartDrawer() {
  updateCartDrawerUI()
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ===========================
// WHATSAPP CHECKOUT
// ===========================

function checkoutViaWhatsApp() {
  if (cartState.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const formatNGN = (n) => '₦' + n.toLocaleString('en-NG');
  const lines = ['🎁 *New Gyftar Order*', '─────────────────────', ''];
  
  cartState.forEach(item => {
    const itemTotal = item.price * item.qty;
    lines.push(`• *${item.name}* × ${item.qty}  →  ${formatNGN(itemTotal)}`);
  });

  const grandTotal = getCartTotal();
  lines.push('', '─────────────────────', `*Total: ${formatNGN(grandTotal)}*`, '', 'Please process my order. Thank you! 🙏');

  const encodedMessage = encodeURIComponent(lines.join('\n'));
  const whatsappNumber = '2348000000000'; // Replace with actual number
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
}

// ===========================
// HERO SLIDER - Fixed auto-play
// ===========================

class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.dots = document.querySelectorAll('.hero-dot');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    
    if (this.slides.length === 0) {
      console.warn('No hero slides found');
      return;
    }
    
    // Initialize first slide
    this.showSlide(0);
    this.startAutoPlay();
    this.setupDotListeners();
  }

  showSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.dots.forEach(dot => dot.classList.remove('active'));

    this.slides[index].classList.add('active');
    this.dots[index].classList.add('active');
    this.currentSlide = index;
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(next);
  }

  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prev);
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }

  setupDotListeners() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.stopAutoPlay();
        this.showSlide(index);
        this.startAutoPlay();
      });
    });
  }
}

// ===========================
// MODAL SYSTEM - GYFTAR EDITION
// ===========================

class Modal {
  constructor() {
    this.backdrop = document.getElementById('productModalOverlay');
    this.modal = document.getElementById('productModal');
    this.closeBtn = document.getElementById('modalCloseBtn');
    this.content = document.getElementById('modalContent');

    if (!this.backdrop || !this.modal) {
      console.error('Gyftar Error: Modal elements not found in DOM.');
      return;
    }

    this.setupListeners();
  }

  setupListeners() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('open')) {
        this.close();
      }
    });
  }

  open(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return;
    }

    this.populateModal(product);
    
    this.modal.classList.add('open');
    this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('open');
    this.backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  populateModal(product) {
    const insideList = product.whatsInside ? product.whatsInside.map(item => `<li>${item}</li>`).join('') : '';
    
    this.content.innerHTML = `
      <div class="modal-image-container">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      
      <div class="modal-details">
        <span class="product-category" style="color: var(--accent); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700;">
          ${product.category}
        </span>
        
        <h2 class="product-name" style="font-size: 2rem; margin: 0.5rem 0; color: var(--text-main);">
          ${product.name}
        </h2>
        
        <span class="product-price" style="font-size: 1.2rem; font-weight: 700; color: var(--accent); display: block; margin-bottom: 1rem;">
          ${formatNGN(product.price)}
        </span>
        
        <p style="margin-top: 1rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
          ${product.shortDesc}
        </p>
        
        <div class="modal-box-contents" style="background: #0f53ba18; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <h4 style="color: var(--accent); margin-bottom: 0.75rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">What's Inside</h4>
          <ul style="list-style: none; padding: 0;">
            ${insideList}
          </ul>
        </div>
        
        <div class="modal-actions" style="display: flex; gap: 1rem; margin-top: auto; padding-top: 1rem;">
          <button class="btn btn-secondary" onclick="window.gyftarModal.close();" style="flex: 1;">Close</button>
          <button class="btn btn-primary" onclick="window.addToCart('${product.id}'); window.gyftarModal.close();" style="flex: 2; min-height: 44px;">Add to Cart</button>
        </div>
      </div>
    `;
  }
}

// ===========================
// MOBILE NAVIGATION SETUP
// ===========================

function setupMobileNav() {
  if (!navbarToggle || !navbarLinks) {
    console.warn('Mobile nav elements not found');
    return;
  }

  // Hamburger toggle
  navbarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navbarToggle.classList.toggle('active');
    navbarLinks.classList.toggle('active');
    
    // Slide drawer
    if (navbarToggle.classList.contains('active')) {
      openMobileNavDrawer();
    } else {
      closeMobileNavDrawer();
    }
  });

  // Close drawer when link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarToggle.classList.remove('active');
      navbarLinks.classList.remove('active');
      closeMobileNavDrawer();
      updateActiveNav();
    });
  });

  // Close drawer when overlay clicked
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', () => {
      navbarToggle.classList.remove('active');
      navbarLinks.classList.remove('active');
      closeMobileNavDrawer();
    });
  }

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && !e.target.closest('#mobileNavDrawer')) {
      navbarToggle.classList.remove('active');
      navbarLinks.classList.remove('active');
      closeMobileNavDrawer();
    }
  });
}

// ===========================
// CART DRAWER SETUP
// ===========================

function setupCartDrawer() {
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      openCartDrawer();
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
      closeCartDrawer();
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', checkoutViaWhatsApp);
  }
}

// ===========================
// ACTIVE NAV HIGHLIGHTING
// ===========================

function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isActive = 
      (currentPage === '' && href === 'index.html') ||
      (href === currentPage) ||
      (currentPage === 'index.html' && href === 'index.html');
    
    if (isActive) {
      link.classList.add('active');
      link.style.color = 'var(--accent)';
    } else {
      link.classList.remove('active');
      link.style.color = 'var(--text-main)';
    }
  });
}

// ===========================
// GLOBAL SCOPE BRIDGE
// ===========================

// Attach critical functions to window for inline onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateItemQty = updateItemQty;
window.checkoutViaWhatsApp = checkoutViaWhatsApp;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.openMobileNavDrawer = openMobileNavDrawer;
window.closeMobileNavDrawer = closeMobileNavDrawer;

// ===========================
// INITIALIZATION - DOMContentLoaded
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  console.log('GYFTAR - Initializing...');

  // Initialize cart from localStorage
  initializeCart();

  // Initialize hero slider
  const heroElement = document.querySelector('.hero-slider');
  if (heroElement) {
    heroSlider = new HeroSlider();
  }

  // Initialize modal
  window.gyftarModal = new Modal();

  // Setup mobile navigation
  setupMobileNav();
  updateActiveNav();

  // Setup cart drawer
  setupCartDrawer();

  // Setup scroll detection for navbar
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });

  // Populate product grids if on home page
  if (document.getElementById('featuredCarsContainer')) {
    const featuredCart = products.filter(p => p.featured === true).slice(0, 3);
    if (featuredCart.length > 0) {
      const html = featuredCart.map(product => `
        <div class="car-card" onclick="window.gyftarModal.open('${product.id}')">
          <div class="car-card-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="car-card-content">
            <div class="car-card-header">
              <div class="car-card-info">
                <h3>${product.name}</h3>
              </div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem;">${product.shortDesc}</p>
            <div class="car-card-price">${formatNGN(product.price)}</div>
            <button class="btn btn-primary" style="width: 100%; margin-top: auto;" onclick="window.addToCart('${product.id}'); event.stopPropagation();">Add to Cart</button>
          </div>
        </div>
      `).join('');
      document.getElementById('featuredCarsContainer').innerHTML = html;
    }
  }

  if (document.getElementById('dealsContainer')) {
    const dealsCart = products.filter(p => p.bestSeller === true).slice(0, 3);
    if (dealsCart.length > 0) {
      const html = dealsCart.map(product => `
        <div class="car-card" onclick="window.gyftarModal.open('${product.id}')">
          <div class="car-card-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="car-card-content">
            <div class="car-card-header">
              <div class="car-card-info">
                <h3>${product.name}</h3>
              </div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem;">${product.shortDesc}</p>
            <div class="car-card-price">${formatNGN(product.price)}</div>
            <button class="btn btn-primary" style="width: 100%; margin-top: auto;" onclick="window.addToCart('${product.id}'); event.stopPropagation();">Add to Cart</button>
          </div>
        </div>
      `).join('');
      document.getElementById('dealsContainer').innerHTML = html;
    }
  }

  console.log('GYFTAR - Ready!');
});

// Handle window resize to close drawers
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navbarToggle?.classList.remove('active');
    navbarLinks?.classList.remove('active');
    closeMobileNavDrawer();
    closeCartDrawer();
  }
});


