// Function to verify the token and check for admin role
async function verifyToken() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found');
    }

    try {
        const response = await fetch('/userInfo/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            throw new Error('Token verification failed');
        }

        const data = await response.json();
        console.log('Token is valid:', data);

        // Check if the user has the admin role
        if (data.user.role !== 'admin') {
            throw new Error('User is not an admin');
        }

        return data;
    } catch (error) {
        console.error('Error verifying token:', error.message);
        throw error;
    }
}

// Function to reset the form fields
function resetForm() {
    const itemForm = document.getElementById('itemForm');
    const formHeading = document.getElementById('formHeading');
    const submitButton = document.getElementById('submitButton');
    const updateButton = document.getElementById('updateButton');
    const cancelButton = document.getElementById('cancelButton');
    const itemNameInput = document.getElementById('itemName');
    const imagePreview = document.getElementById('imagePreview');

    if (itemForm) itemForm.reset();
    if (formHeading) formHeading.innerText = 'Add Menu Item';
    if (submitButton) {
        submitButton.innerText = 'Add Item';
        submitButton.style.display = 'inline';
    }
    if (updateButton) updateButton.style.display = 'none';
    if (itemNameInput) itemNameInput.disabled = false; // Re-enable the item name input
    if (imagePreview) imagePreview.src = ''; // Clear the image preview

    toggleDiscountPrice(); // Ensure discount price field is reset
}

// Function to handle form submission
document.addEventListener('DOMContentLoaded', async function() {
    // Verify token before proceeding
    try {
        await verifyToken();
    } catch (error) {
        // Redirect to login page if token is invalid
        alert('You are not authorized to access this page.');
        window.location.href = '/login';
        return;
    }

    displayImagePreview();

    document.getElementById('itemForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData();
        const imagePreview = document.getElementById('imagePreview');
        // Collect form data manually
        formData.append('name', document.getElementById('itemName').value);
        formData.append('category', document.getElementById('itemCategory').value);
        formData.append('description', document.getElementById('itemDescription').value);
        formData.append('price', document.getElementById('itemPrice').value);
        formData.append('discount', document.getElementById('itemDiscount').checked);
        formData.append('discountedPrice', document.getElementById('itemDiscountedPrice').value);
        // Append the Base64 image string if available
        const base64String = imagePreview.src;
        if (base64String && base64String.startsWith('data:image')) {
            formData.append('picture', base64String);
        } else {
            alert('Please select a valid image file.');
            return;
        }
        // Convert FormData to JSON object
        const formDataObject = {};
        for (const pair of formData.entries()) {
            formDataObject[pair[0]] = pair[1];
        }

        try {
            // Check if the item already exists by name
            const response = await fetch(`/menuUpdate?name=${encodeURIComponent(formDataObject.name)}`);
            const existingItem = await response.json();
            if (response.ok && existingItem) {
                // If item exists, call the PUT route
                const putResponse = await fetch('/menuUpdate', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataObject)
                });               
                if (!putResponse.ok) {
                    const errorMessage = await putResponse.text();
                    throw new Error(errorMessage);
                }
            } else {
                // If item does not exist, call the POST route
                const postResponse = await fetch('/menuUpdate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataObject)
                });
                if (!postResponse.ok) {
                    const errorMessage = await postResponse.text();
                    throw new Error(errorMessage);
                }
            }
            resetForm();
            // Refresh menu after adding/updating item
            fetchMenu();
        } catch (error) {
            console.error('Error adding/updating menu item:', error);
            alert('Failed to add/update menu item. Please try again.');
        }
    });
});

// Function to handle cancel button click
document.getElementById('cancelButton').addEventListener('click', function() {
    resetForm();
});

// Function to fetch menu items and display them
async function fetchMenu() {
    try {
        const response = await fetch('/menuUpdate');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const menuItems = await response.json();
        displayMenuItems(menuItems);
        console.log('Successfully fetched menu items.');
    } catch (error) {
        console.error('Error fetching menu:', error);
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
        <p>Name: ${item.name}</p>
        <p>Description: ${item.description}</p>
        <p>Price: $${item.price}</p>
        <p>Discount: ${item.discount ? 'Yes' : 'No'}</p>
        ${item.discount ? `<p>Discount Price: $${item.discountedPrice}</p>` : ''}
        <img src="${item.picture}" alt="${item.name}">
        <button id='item-button' onclick="startEditMenuItem('${item.name}')">Edit</button>
        <button id='item-button' onclick="deleteMenuItem('${item.name}')">Delete</button>
    `;
    container.appendChild(menuItemDiv);
}

// Function to start editing a menu item
async function startEditMenuItem(itemName) {
    try {
        const item = await fetchMenuItemByName(itemName);
        if (!item) {
            alert('Menu item not found');
            return;
        }

        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        const formHeading = document.getElementById('formHeading');
        const submitButton = document.getElementById('submitButton');
        const updateButton = document.getElementById('updateButton');

        if (formHeading) formHeading.innerText = 'Update Menu Item';
        if (submitButton) submitButton.style.display = 'none';
        if (updateButton) updateButton.style.display = 'inline';
        
        // Populate form fields with item data
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemDiscount').checked = item.discount;
        document.getElementById('itemDiscountedPrice').value = item.discountedPrice;
        
        // Populate image preview
        const imagePreview = document.getElementById('imagePreview');
        if (item.picture) {
            imagePreview.src = item.picture;
        } else {
            imagePreview.src = ''; // Clear the image preview if no picture available
        }

        // Disable the itemName and itemCategory fields
        document.getElementById('itemName').disabled = true;
        document.getElementById('itemCategory').disabled = true;

        // Toggle discount price input based on discount checkbox
        toggleDiscountPrice();

    } catch (error) {
        console.error('Error editing menu item:', error);
        alert('Failed to edit menu item. Please try again.');
    }
}

// Function to fetch a single menu item by name
async function fetchMenuItemByName(itemName) {
    try {
        const response = await fetch(`/menuUpdate?name=${encodeURIComponent(itemName)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            const responseText = await response.text();
            console.error('Received non-JSON response:', responseText);
            throw new Error('Received non-JSON response');
        }
    } catch (error) {
        console.error('Error fetching menu item:', error);
        alert('Failed to fetch menu item. Please try again.');
    }
}

// Function to delete a menu item
async function deleteMenuItem(itemName) {
    if (!confirm('Are you sure you want to delete this menu item?')) {
        return;
    }
    try {
        const response = await fetch(`/menuUpdate?name=${encodeURIComponent(itemName)}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        // Refresh menu after deleting item
        fetchMenu();
    } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item. Please try again.');
    }
}

// Function to toggle the discount price input
function toggleDiscountPrice() {
    const itemDiscount = document.getElementById('itemDiscount');
    const itemDiscountPrice = document.getElementById('itemDiscountedPrice');

    if (!itemDiscount || !itemDiscountPrice) {
        console.error('Item discount or discount price element not found');
        return;
    }

    if (itemDiscount.checked) {
        itemDiscountPrice.disabled = false;
        itemDiscountPrice.required = true; // Required when discount is enabled
    } else {
        itemDiscountPrice.disabled = true;
        itemDiscountPrice.required = false; // Remove required attribute
        itemDiscountPrice.value = ''; // Clear the value when disabled
    }
}

// Function to display image preview
function displayImagePreview() {
    const fileInput = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                // Ensure imagePreview exists before setting its src
                if (imagePreview) {
                    imagePreview.src = reader.result;
                } else {
                    console.error('Image preview element not found.');
                }
            };
            reader.readAsDataURL(file);
        } else {
            // Clear the image preview if no file selected
            if (imagePreview) {
                imagePreview.src = '';
            } else {
                console.error('Image preview element not found.');
            }
        }
    });
}

// Function to validate uploaded image
function validateImage(file) {
    const MAX_WIDTH = 300;
    const MAX_HEIGHT = 300;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg'];

    if (!ALLOWED_TYPES.includes(file.type)) {
        alert('Please upload a JPEG or JPG image file.');
        return false;
    }

    const image = new Image();
    image.src = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
        image.onload = function() {
            if (image.width > MAX_WIDTH || image.height > MAX_HEIGHT) {
                alert('Image dimensions should not exceed 300x300 pixels.');
                reject();
            } else {
                resolve();
            }
        };
        image.onerror = function() {
            reject();
        };
    });
}

// Function to handle item picture change
document.getElementById('itemImage').addEventListener('change', async function() {
    const file = this.files[0];
    if (!file) return;

    try {
        await validateImage(file);
        // Image is valid, continue processing or display image preview
        const reader = new FileReader();
        reader.onload = function() {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = reader.result;
        };
        reader.readAsDataURL(file);
    } catch (error) {
        // Validation failed, clear file input
        this.value = '';
    }
});

// Script to handle enabling/disabling the discount price input
document.addEventListener('DOMContentLoaded', function() {
    const itemDiscount = document.getElementById('itemDiscount');

    if (!itemDiscount) {
        console.error('Item discount checkbox not found');
        return;
    }

    // Initial toggle based on the current state of the checkbox
    toggleDiscountPrice();

    // Add event listener to the discount checkbox
    itemDiscount.addEventListener('change', toggleDiscountPrice);
});

// Fetch menu items on page load
document.addEventListener('DOMContentLoaded', fetchMenu);
