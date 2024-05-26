// menu-script.js
// Function to fetch menu items from the server
async function fetchMenuItems() {
    try {
        const response = await fetch(`/menuUpdate`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const menuItems = await response.json();
        displayMenuItems(menuItems);
        console.log('Successfully fetched menu items.');
    } catch (error) {
        console.error('Error fetching menu items:', error);
    }
}

// Function to display menu items
function displayMenuItems(menuItems) {
    const categories = ['pizzas', 'sides', 'drinks'];
    categories.forEach(category => {
        const container = document.getElementById(`${category}-container`);
        if (!container) {
            console.error(`Container with ID ${category}-container not found`);
            return;
        }
        container.innerHTML = ''; // Clear existing content
        menuItems
            .filter(item => item.category === category)
            .forEach(item => displayMenuItem(item, container));
    });
    console.log('Building display containers...');
}

// Function to display a single menu item
function displayMenuItem(item, container) {
    const menuItemDiv = document.createElement('div');
    menuItemDiv.classList.add('menu-item');
    menuItemDiv.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p class="price">${item.discount ? `<del>$${item.price.toFixed(2)}</del> <span class="discount-price">$${item.discountedPrice.toFixed(2)}</span>` : `$${item.price.toFixed(2)}`}</p>
        <img src="${item.picture}" alt="${item.name}">
        <button class="add-to-cart-btn" data-item='${JSON.stringify(item)}'>Add to Cart</button>
    `;
    container.appendChild(menuItemDiv);
}

// Call the function to fetch and display menu items
fetchMenuItems();

// Function to add a menu item to the cart
function addToCart(item) {
    // Retrieve existing cart items from local storage or initialize an empty array
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the item already exists in the cart by name
    const existingItem = cartItems.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
        // If the item already exists, increase its quantity by 1
        existingItem.quantity++;
    } else {
        // If the item doesn't exist, add it to the cart with a quantity of 1
        const newItem = {
            name: item.name,
            price: item.price,
            discount: item.discount,
            discountedPrice: item.discountedPrice,
            quantity: 1
        };
        cartItems.push(newItem);
    }

    // Save the updated cart items to local storage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update the cart count in the header
    updateCartCount();
}

// Function to handle click events on menu items and add them to the cart
function handleMenuItemClick(item) {
    console.log(`Adding item to cart: ${item.name}`);
    // Add the item to the cart
    addToCart(item);
    // Display the custom alert
    showCustomAlert('Item added to cart: ' + item.name);
}

function showCustomAlert(message) {
    // Create the alert element
    var alertElement = document.createElement('div');
    alertElement.id = 'customAlert';
    alertElement.classList.add('alert');
    
    // Create the message element
    var messageElement = document.createElement('span');
    messageElement.id = 'alertMessage';
    messageElement.innerText = message;

    // Append the message to the alert
    alertElement.appendChild(messageElement);

    // Append the alert to the body
    document.body.appendChild(alertElement);

    // Display the custom alert
    alertElement.style.top = '-100px'; // Start position above the screen
    alertElement.style.display = 'block';
    
    // Slide down animation
    alertElement.style.transition = 'top 0.5s ease-out';
    alertElement.style.top = '0';

    // Hide the custom alert after a delay
    setTimeout(function() {
        // Slide up animation
        alertElement.style.top = '-100px';
        // Remove the alert element from the DOM after hiding
        setTimeout(function() {
            document.body.removeChild(alertElement);
        }, 500); // Adjust the duration of the slide up animation (in milliseconds)
    }, 2000); // Adjust the delay (in milliseconds) before hiding the alert
}

document.addEventListener('click', function(event) {
    if (event.target.matches('.add-to-cart-btn')) {
        // Get the item data stored in a data attribute
        const itemData = JSON.parse(event.target.getAttribute('data-item'));

        // Call the handleMenuItemClick function with the item data
        handleMenuItemClick(itemData);
    }
});
