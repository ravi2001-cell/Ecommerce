const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const products = [
    { id: 1, name: "Premium Wireless Headphones", price: 12999, description: "Noise-cancelling over-ear headphones.", image: "https://unsplash.com" },
    { id: 2, name: "Minimalist Smart Watch", price: 18499, description: "Amoled display with health monitoring.", image: "https://unsplash.com" },
    { id: 3, name: "Ergonomic Mechanical Keyboard", price: 7999, description: "RGB backlit tactile typing experience.", image: "https://unsplash.com" },
    { id: 4, name: "Ultra-Wide Gaming Monitor", price: 34999, description: "34-inch curved screen with 144Hz refresh rate.", image: "https://unsplash.com" }
];

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/checkout', (req, res) => {
    const { items } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: "Your shopping cart is empty." });
    }
    let calculatedTotal = 0;
    items.forEach(cartItem => {
        const matchingProduct = products.find(p => p.id === cartItem.id);
        if (matchingProduct) {
            calculatedTotal += matchingProduct.price * cartItem.quantity;
        }
    });
    res.json({ success: true, message: "Thank you! Order successfully validated.", total: calculatedTotal });
});

app.listen(PORT, () => console.log(`Server active on port ${PORT}`));
