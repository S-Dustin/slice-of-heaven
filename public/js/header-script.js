// Function to update cart count in the header
function updateCartCount() {
    // Retrieve cartItems from local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Calculate the total quantity
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Get the cart count element
    const cartCountElement = document.getElementById('cart-count');
    
    // Update the cart count
    if (cartCountElement) {
        cartCountElement.textContent = totalQuantity;
        // Toggle visibility based on total quantity
        cartCountElement.style.display = totalQuantity > 0 ? 'inline-block' : 'none';
    }
}

function updateHeaderButtons() {
    const role = sessionStorage.getItem('role');
    const accountButton = document.getElementById('account-button');
    const menuButton = document.getElementById('menu-button');

    if (role) {
        // Replace the login button with the account button and update href
        accountButton.innerHTML = '<img src="./images/account.png" alt="Account">';
        accountButton.href = '/account';
    }

    if (role === 'admin') {
        // Replace the account button with the admin button and update href
        accountButton.innerHTML = '<img src="./images/admin.png" alt="Account">';
        accountButton.href = '/account';

        // Replace the menu button with the admin dashboard button and update href
        menuButton.innerHTML = '<img src="./images/admin-dash.png" alt="Admin Dashboard">';
        menuButton.href = '/admin-dash';
    }
}

// Call the function to update cart count initially
updateCartCount();
updateHeaderButtons();