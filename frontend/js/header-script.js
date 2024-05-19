// Function to update cart count in the header
function updateCartCount() {
    // Retrieve cartItems from local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Calculate the total quantity
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Get the cart count element
    const cartCount = document.getElementById('cart-count');
    
    // Update the cart count
    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }
}

function updateHeaderButtons() {
 
    console.log('Updating Header.');
    const role = sessionStorage.getItem('role');
    const loginButton = document.getElementById('login-button');
    const menuButton = document.getElementById('menu-button');

    if (role) {
        loginButton.innerHTML = '<a href="account.html"><img src="../images/account.png" alt="Account"></a>';
    }

    if (role === 'admin') {
        loginButton.innerHTML = '<a href="account.html"><img src="../images/admin.png" alt="Account"></a>';
        menuButton.innerHTML = '<a href="admin-dash.html"><img src="../images/admin-dash.png" alt="Admin Dashboard"></a>';
    }

    // Set the flag indicating the header has been updated
    sessionStorage.setItem('headerUpdated', 'true');
}

// Call the function to update cart count initially
updateCartCount();