// Retrieve existing cart items from local storage or initialize an empty array
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function updateCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-btn');
    if (cartItems.length === 0) {
        checkoutButton.disabled = true;
    } else {
        checkoutButton.disabled = false;
    }
}

// Function to remove an item from the cart
function removeFromCart(itemId) {
    // Find the index of the item to remove
    const index = cartItems.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
        // Remove the item from the cart
        cartItems.splice(index, 1);
        
        // Save the updated cart items to local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update the cart count in the header
        updateCartCount();
        updateCheckoutButton();
    }
}

// Function to render cart items
function renderCartItems() {
    const cartContainer = document.getElementById('cartItems');
    cartContainer.innerHTML = ''; // Clear existing content

    if (cartItems.length === 0) {
        // Create a div for the empty cart message
        const emptyCartDiv = document.createElement('div');
        emptyCartDiv.classList.add('empty-cart');
        emptyCartDiv.innerHTML = `
            <p>Your cart is empty!</p>
            <p><a href="/menu">View the menu?</a></p>
        `;

        cartContainer.appendChild(emptyCartDiv);
    } else {
        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <h4>Name: ${item.name}</h4>
                <p>
                    Price: ${item.discount ? `<del>$${item.price.toFixed(2)}</del> <span style="color: limegreen;"><i>$${item.discountedPrice.toFixed(2)}</i></span>` : `$${item.price.toFixed(2)}`}
                </p>
                <p>Quantity: 
                    <button class="quantity-btn minus-btn" data-name="${item.name}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus-btn" data-name="${item.name}">+</button>
                </p>
                <button class="remove-item-btn" data-name="${item.name}">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        });

    }
    updateTotalPrice();
    updateCheckoutButton();
}

// Function to update total price
function updateTotalPrice() {
    const totalPriceElement = document.getElementById('total-price');
    const totalPrice = cartItems.reduce((total, item) => total + (item.discount ? item.discountedPrice : item.price) * item.quantity, 0);
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Event listener for plus and minus buttons
document.addEventListener('click', function(event) {
    const target = event.target;

    // Check if the clicked element is a quantity button
    if (target.matches('.quantity-btn')) {
        // Get the item name from the data-name attribute
        const itemName = target.getAttribute('data-name');
        console.log('Clicked item:', itemName);
        
        // Find the corresponding item in the cartItems array
        const item = cartItems.find(item => item.name === itemName);
        console.log('Found item:', item);
        
        if (item) {
            // Check if the clicked button is a plus button
            if (target.classList.contains('plus-btn')) {
                item.quantity++; // Increment the quantity
            } else if (target.classList.contains('minus-btn')) {
                // Check if the quantity is greater than 1 before decrementing
                if (item.quantity > 1) {
                    item.quantity--; // Decrement the quantity
                } else {
                    // If the quantity is 1, ask for confirmation before removing the item
                    const confirmRemove = confirm('Are you sure you want to remove this item from the cart?');
                    if (confirmRemove) {
                        // Remove the item from the cartItems array
                        const itemIndex = cartItems.findIndex(item => item.name === itemName);
                        if (itemIndex !== -1) {
                            cartItems.splice(itemIndex, 1);
                        }
                    } else {
                        return; // Do nothing if user cancels removal
                    }
                }
            }
            // Save the updated cart items to local storage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            // Re-render the cart items
            renderCartItems();
        }
    } else if (target.matches('.remove-item-btn')) {
        // Handle click on remove item button
        const itemName = target.getAttribute('data-name');
        console.log('Remove clicked item:', itemName);
        
        const itemIndex = cartItems.findIndex(item => item.name === itemName);
        console.log('Remove item index:', itemIndex);
        
        if (itemIndex !== -1) {
            cartItems.splice(itemIndex, 1); // Remove the item from the cartItems array
            // Save the updated cart items to local storage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            // Re-render the cart items
            renderCartItems();
        }
    }
    updateCartCount();
    updateCheckoutButton();
});

// Initial rendering of cart items
renderCartItems();
updateCheckoutButton();