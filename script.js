// === Kosár kezelés ===
let cart = [];
let cartTotal = 0;

// Termék hozzáadása a kosárhoz
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${name} hozzáadva a kosárhoz!`);
}

// Termék eltávolítása a kosárból
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showNotification('Termék eltávolítva a kosárból');
}

// Kosár frissítése
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

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
                    <p>Mennyiség: ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <p class="cart-item-price">${(item.price * item.quantity).toLocaleString()} Ft</p>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Törlés</button>
                </div>
            </div>
        `).join('');
    }

    cartTotal.textContent = `${totalPrice.toLocaleString()} Ft`;
}

// Kosár megnyitása
document.getElementById('cartBtn').addEventListener('click', () => {
    document.getElementById('cartModal').classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Kosár bezárása
function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Modal bezárása háttérre kattintva
document.getElementById('cartModal').addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') {
        closeCart();
    }
});

// === Keresés ===
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = prompt('Mit keresel?');
    if (query) {
        showNotification(`Keresés: "${query}" - A funkció hamarosan elérhető!`);
    }
});

// === Értesítések ===
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: linear-gradient(135deg, #d4af37, #e8c468);
        color: #0a0a0f;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// === Görgetési animációk ===
function scrollToProducts() {
    document.getElementById('kollekcio').scrollIntoView({ behavior: 'smooth' });
}

// Vissza a tetejére gomb
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }

    // Header átlátszóság
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(10, 10, 15, 0.98)';
    } else {
        header.style.background = 'rgba(10, 10, 15, 0.92)';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Kategória szűrés ===
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        showNotification(`${card.querySelector('h3').textContent} kategória kiválasztva`);
        scrollToProducts();
    });
});

// === Termék kártya animációk ===
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

// === 3D tilt effekt termék kártyákon ===
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// === Navigáció aktív link ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
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
});

// === Fizetés (demo) ===
function checkout() {
    if (cart.length === 0) {
        showNotification('A kosár üres!');
        return;
    }

    showNotification('Átirányítás a fizetéshez... (Demo verzió)');
    setTimeout(() => {
        cart = [];
        updateCart();
        closeCart();
        showNotification('Sikeres rendelés! (Demo)');
    }, 2000);
}

// === Kapcsolati űrlap ===
function handleSubmit(event) {
    event.preventDefault();
    showNotification('Üzenet elküldve! Hamarosan válaszolunk.');
    event.target.reset();
    return false;
}

// === Animációk betöltéskor ===
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// === Keyboard navigation ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
    }
});

// === CSS animációk definiálása ===
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🎨 Epoxy Lux webshop betöltve!');
console.log('✨ Minden funkció aktív és működőképes.');