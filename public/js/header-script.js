// public/header-script.js

// Function to verify user's token
async function decodeToken(token) {
    try {
        const response = await fetch('/userInfo/decode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

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
    // Get the JWT from session storage
    const token = sessionStorage.getItem('token');

    if (token) {
        // Decode the JWT using decodeToken function
        decodeToken(token)
            .then(decodedToken => {
                if (decodedToken) {
                    // Extract the role from the decoded payload
                    const role = decodedToken.role;

                    // Get the account and menu buttons
                    const accountButton = document.getElementById('account-button');
                    const menuButton = document.getElementById('menu-button');

                    // Update buttons based on the role
                    if (role === 'user') {
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
                } else {
                    console.error('Failed to decode JWT token');
                }
            })
            .catch(error => {
                console.error('Error decoding JWT token:', error);
            });
    }
}

// Call the function to update cart count initially
updateCartCount();
updateHeaderButtons();