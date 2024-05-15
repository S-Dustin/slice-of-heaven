// Sample data for cart items (replace with actual data fetched from server)
const cartItems = [
    { id: 1, name: 'Item 1', price: 10.00, quantity: 2, discounted: true, discountPrice: 8.00 },
    { id: 2, name: 'Item 2', price: 15.00, quantity: 1, discounted: false },
    { id: 3, name: 'Item 3', price: 20.00, quantity: 3, discounted: true, discountPrice: 15.00 }
];

// Function to render cart items
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Clear existing content

    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <h4>Name: ${item.name}</h4>
            <p>
                Price: ${item.discounted ? `<del>$${item.price.toFixed(2)}</del> <span style="color: limegreen;"><i>$${item.discountPrice.toFixed(2)}</i></span>` : `$${item.price.toFixed(2)}`}
            </p>
            <p>Quantity: 
                <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
            </p>
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
    const totalPrice = cartItems.reduce((total, item) => total + (item.discounted ? item.discountPrice : item.price) * item.quantity, 0);
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Event listener for plus and minus buttons
document.addEventListener('click', function(event) {
    if (event.target.matches('.quantity-btn')) {
        const itemId = parseInt(event.target.getAttribute('data-id'), 10);
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            if (event.target.classList.contains('plus-btn')) {
                item.quantity++;
            } else if (event.target.classList.contains('minus-btn')) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    const confirmRemove = confirm('Are you sure you want to remove this item from the cart?');
                    if (confirmRemove) {
                        const itemIndex = cartItems.findIndex(item => item.id === itemId);
                        if (itemIndex !== -1) {
                            cartItems.splice(itemIndex, 1);
                        }
                    } else {
                        return; // Do nothing if user cancels removal
                    }
                }
            }
            renderCartItems();
        }
    } else if (event.target.matches('.remove-item-btn')) {
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