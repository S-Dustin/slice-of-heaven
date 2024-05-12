// Sample data for cart items (replace with actual data fetched from server)
const cartItems = [
    { id: 1, name: 'Item 1', price: 10.00, quantity: 2 },
    { id: 2, name: 'Item 2', price: 15.00, quantity: 1 },
    { id: 3, name: 'Item 3', price: 20.00, quantity: 3 }
];

// Function to render cart items
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Clear existing content

    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <p>Name: ${item.name}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>Quantity: <input type="number" value="${item.quantity}" min="1"></p>
            <button class="remove-item-btn" data-id="${item.id}">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    // Update total price
    updateTotalPrice();
}

// Function to update total price
function updateTotalPrice() {
    const totalPriceElement = document.getElementById('total-price');
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Event listener for quantity change
document.addEventListener('change', function(event) {
    if (event.target.matches('.cart-item input[type="number"]')) {
        const itemId = parseInt(event.target.parentNode.querySelector('.remove-item-btn').getAttribute('data-id'), 10);
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            item.quantity = parseInt(event.target.value, 10);
            updateTotalPrice();
        }
    }
});

// Event listener for remove item button
document.addEventListener('click', function(event) {
    if (event.target.matches('.remove-item-btn')) {
        const itemId = parseInt(event.target.getAttribute('data-id'), 10);
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cartItems.splice(itemIndex, 1);
            renderCartItems();
        }
    }
});

// Initial rendering of cart items
renderCartItems();