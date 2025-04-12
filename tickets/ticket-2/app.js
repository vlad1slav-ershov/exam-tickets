// Мок данные
const products = [
    {
        id: 1,
        name: 'Смартфон Premium',
        price: 499,
        image: 'https://picsum.photos/400/600?1',
        description: 'Флагманский смартфон с лучшей камерой 2024 года. OLED экран 6.7", процессор Snapdragon 8 Gen 3'
    },
    {
        id: 2,
        name: 'Ноутбук Pro',
        price: 1299,
        image: 'https://picsum.photos/400/600?2',
        description: 'Мощный ноутбук для профессионалов: 32GB RAM, 1TB SSD, RTX 4080'
    }
];

// Состояние приложения
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;

// Инициализация
function init() {
    renderProducts();
    updateCartCount();
    showPage('home');
}

// Рендер товаров
function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(product => `
        <article class="product-card" onclick="showProduct(${product.id})">
            <div class="product-image-container">
                <img src="${product.image}" class="product-image" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price.toLocaleString()}₽</p>
            </div>
        </article>
    `).join('');
}

// Показать товар
function showProduct(id) {
    currentProduct = products.find(p => p.id === id);
    document.getElementById('product-title').textContent = currentProduct.name;
    document.getElementById('product-price').textContent = currentProduct.price.toLocaleString() + '₽';
    document.getElementById('product-description').textContent = currentProduct.description;
    document.getElementById('product-image').src = currentProduct.image;
    showPage('product');
}

// Работа с корзиной
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if(existing) {
        existing.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h3>${item.name}</h3>
                <p>${item.price.toLocaleString()}₽ × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()}₽</p>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="btn-danger" onclick="removeItem(${item.id})">Удалить</button>
            </div>
        </div>
    `).join('');

    document.getElementById('cart-total').textContent = cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toLocaleString();
}

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    item.quantity += delta;
    if(item.quantity < 1) removeItem(id);
    updateCart();
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Навигация
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(`${page}-page`).classList.remove('hidden');
    if(page === 'cart') renderCartItems();
}

function checkout() {
    if(cart.length === 0) return alert('Корзина пуста!');
    if(confirm(`Подтвердить заказ на сумму ${document.getElementById('cart-total').textContent}₽?`)) {
        cart = [];
        updateCart();
        showPage('home');
        alert('Заказ оформлен! Спасибо за покупку!');
    }
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart
        .reduce((sum, item) => sum + item.quantity, 0);
}

// Запуск приложения
init();