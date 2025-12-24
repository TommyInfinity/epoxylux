// === Global State ===
let cart = [];
let cartTotal = 0;

// === Product Data ===
const products = {
    1: { name: 'Gleam Noir Nyaklánc', price: 149900, desc: 'Elegáns fekete epoxy arany részletekkel. Kézzel készített, egyedi darab.', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    2: { name: 'Aurora Borealis Gyűrű', price: 89900, desc: 'Lila-rózsaszín árnyalatok színjátéka. Exkluzív design.', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    3: { name: 'Ocean Wave Fülbevaló', price: 79900, desc: 'Tengerkék árnyalatok ezüst kerettel. Könnyed elegancia.', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    4: { name: 'Sunset Crystal Dísztárgy', price: 129900, desc: 'Napnyugta színek kristályba zárva. Dekoratív művészet.', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    5: { name: 'Pastel Dream Karkötő', price: 99900, desc: 'Pasztell színek harmóniája. Finom kidolgozás.', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    6: { name: 'Golden Hour Medál', price: 169900, desc: 'Meleg árnyalatok arany lánccal. Limitált kiadás.', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }
};

// === Mobile Menu ===
const menuBtn = document.getElementById('menuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMenuBtn = document.getElementById('closeMenu');

menuBtn.addEventListener('click', () => {
    mobileMenuOverlay.classList.add('active');
    menuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenuBtn.addEventListener('click', closeMobileMenu);

mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
    }
});

function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// === Cart Management ===
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    updateCart();
    showNotification(`✓ ${name} hozzáadva`);

    // Vibrate on mobile if supported
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showNotification('Termék eltávolítva');
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">A kosár üres</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Mennyiség: ${item.quantity} db</p>
                </div>
                <div class="cart-item-actions">
                    <p class="cart-item-price">${(item.price * item.quantity).toLocaleString()} Ft</p>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Törlés</button>
                </div>
            </div>
        `).join('');
    }

    cartTotalEl.textContent = `${totalPrice.toLocaleString()} Ft`;
}

// === Cart Modal ===
document.getElementById('cartBtn').addEventListener('click', () => {
    document.getElementById('cartModal').classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('cartModal').addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') {
        closeCart();
    }
});

// === Search ===
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = prompt('Mit keresel?');
    if (query && query.trim()) {
        showNotification(`🔍 Keresés: "${query}"`);
        // Could implement actual search here
    }
});

// === Quick View ===
function quickView(id) {
    const product = products[id];
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    const body = document.getElementById('quickViewBody');

    body.innerHTML = `
        <div class="quick-view-image" style="background: ${product.gradient}">
            <span class="placeholder-text">${product.name}</span>
        </div>
        <h2 class="quick-view-title">${product.name}</h2>
        <p class="quick-view-desc">${product.desc}</p>
        <div class="quick-view-price">${product.price.toLocaleString()} Ft</div>
        <button class="btn btn-primary btn-full" onclick="addToCart(${id}, '${product.name}', ${product.price}); closeQuickView();">
            Kosárba helyezés
        </button>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('quickViewModal').addEventListener('click', (e) => {
    if (e.target.id === 'quickViewModal') {
        closeQuickView();
    }
});

// === Category Filter ===
function filterCategory(category) {
    showNotification(`📦 ${category} szűrő aktiválva`);
    scrollToProducts();
    // Could implement actual filtering here
}

// === Notifications ===
function showNotification(message) {
    // Remove any existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gradient);
        color: var(--bg-dark);
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.9rem;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// === Scroll Functions ===
function scrollToProducts() {
    const productsSection = document.getElementById('kollekcio');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = productsSection.offsetTop - headerHeight - 20;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// === Back to Top ===
const backToTopBtn = document.getElementById('backToTop');

let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Header background on scroll
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 15, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
        }
    }, 50);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Navigation Active State ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

let navTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(navTimeout);
    navTimeout = setTimeout(() => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100);
}, { passive: true });

// === Product Card Animations ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// === Checkout ===
function checkout() {
    if (cart.length === 0) {
        showNotification('⚠️ A kosár üres!');
        return;
    }

    showNotification('🔄 Átirányítás...');

    if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
    }

    setTimeout(() => {
        cart = [];
        updateCart();
        closeCart();
        showNotification('✓ Sikeres rendelés! (Demo)');
    }, 2000);
}

// === Contact Form ===
function handleSubmit(event) {
    event.preventDefault();
    showNotification('✓ Üzenet elküldve!');

    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }

    event.target.reset();
    return false;
}

// === Keyboard Support ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
        closeQuickView();
        closeMobileMenu();
    }
});

// === Touch Gestures ===
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeDistance = touchStartY - touchEndY;

    // Swipe up to close modals (when at top of modal)
    if (swipeDistance < -100) {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            const modalBody = activeModal.querySelector('.modal-body');
            if (modalBody && modalBody.scrollTop === 0) {
                closeCart();
                closeQuickView();
            }
        }
    }
}

// === Performance Monitoring ===
if ('performance' in window && 'PerformanceObserver' in window) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 100) {
                    console.warn(`Slow task detected: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
                }
            }
        });
        observer.observe({ entryTypes: ['measure'] });
    } catch (e) {
        // PerformanceObserver not fully supported
    }
}

// === Service Worker Registration (for PWA) ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('SW registered'))
        //     .catch(err => console.log('SW registration failed'));
    });
}

// === Animation Styles ===
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
    }

    .notification {
        pointer-events: none;
    }
`;
document.head.appendChild(animationStyles);

// === Initialize ===
console.log('📱 Epoxy Lux mobilra optimalizálva!');
console.log('✨ Touch gestures, animations, and performance optimizations active.');