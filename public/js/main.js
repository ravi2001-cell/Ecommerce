let cart = JSON.parse(localStorage.getItem('nexus_cart')) || [];

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

async function loadStoreProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const grid = document.getElementById('product-grid');
        grid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price-tag">${formatCurrency(product.price)}</div>
                    <button class="add-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add To Cart</button>
                </div>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) { existingItem.quantity += 1; } else { cart.push({ id, name, price, quantity: 1 }); }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-counter').innerText = totalItems;
    const container = document.getElementById('cart-items-container');
    if (cart.length === 0) {
        container.innerHTML = '<p style="color:#777; text-align:center;">Your cart is empty</p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div><h4>${item.name}</h4><small>${item.quantity} x ${formatCurrency(item.price)}</small></div>
                <button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; cursor:pointer;">Remove</button>
            </div>
        `).join('');
    }
    const finalTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total-price').innerText = formatCurrency(finalTotal);
}

async function submitCheckout() {
    if(cart.length === 0) return alert("Your cart is empty!");
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });
        const result = await response.json();
        if(result.success) {
            alert(`${result.message}\nTotal Charged: ${formatCurrency(result.total)}`);
            cart = []; updateCartUI(); toggleCart();
        }
    } catch (error) { alert("Error processing checkout."); }
}

loadStoreProducts();
updateCartUI();
