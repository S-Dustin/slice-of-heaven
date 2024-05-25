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
    // Optionally, provide feedback to the user (e.g., display a confirmation message)
    alert('Item added to cart: ' + item.name);
}

document.addEventListener('click', function(event) {
    if (event.target.matches('.add-to-cart-btn')) {
        // Get the item data stored in a data attribute
        const itemData = JSON.parse(event.target.getAttribute('data-item'));

        // Call the handleMenuItemClick function with the item data
        handleMenuItemClick(itemData);
    }
});
