document.addEventListener('DOMContentLoaded', () => {
    // Retrieve item details from local storage
    const items = JSON.parse(localStorage.getItem('cartItems'));

    // Display item details on the checkout page
    const itemDetailsContainer = document.getElementById('item-details');
    itemDetailsContainer.innerHTML = '';

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        
        // Determine the price to display based on whether discount is applicable
        const priceToDisplay = item.discount ? item.discountedPrice : item.price;
        
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${priceToDisplay.toFixed(2)}</p>
        `;
        itemDetailsContainer.appendChild(itemElement);
    });

    // Calculate total amount
    let subtotal = 0;
    items.forEach(item => {
        // Determine the price to use for subtotal calculation based on whether discount is applicable
        const priceToUse = item.discount ? item.discountedPrice : item.price;
        subtotal += item.quantity * priceToUse;
    });
    const deliveryFees = 0.06 * subtotal + 3.00;
    const tax = 0.18 * subtotal;
    const total = subtotal + deliveryFees + tax;

    // Display order summary
    const orderSummaryContainer = document.getElementById('order-summary');
    orderSummaryContainer.innerHTML = `
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Delivery Fees: $${deliveryFees.toFixed(2)}</p>
        <p>Tax: $${tax.toFixed(2)}</p>
        <p>Total: $${total.toFixed(2)}</p>
    `;

    // Add expiration date formatting
    const expirationDateInput = document.getElementById('expiration-date');
    expirationDateInput.addEventListener('input', () => {
        let value = expirationDateInput.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        expirationDateInput.value = value;
    });

    expirationDateInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            let value = expirationDateInput.value;
            if (value.endsWith('/')) {
                expirationDateInput.value = value.slice(0, -1); // Remove the '/' if the user presses backspace
            }
        }
    });

    // Enable checkout button when all required fields are filled
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const street = document.getElementById('billing-street').value;
            const city = document.getElementById('billing-city').value;
            const stateAbr = document.getElementById('billing-state').value;
            const zipcode = document.getElementById('billing-zipcode').value;

            const isAddressComplete = street && city && stateAbr && zipcode;

            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value;
            const expirationDate = document.getElementById('expiration-date').value;
            const cvv = document.getElementById('cvv').value;

            const isCardComplete = cardNumber && cardName && expirationDate && cvv;

            const billingDeliverySame = document.getElementById('billing-delivery-same').checked;

            if (billingDeliverySame) {
                document.getElementById('checkout-btn').disabled = !(isAddressComplete && isCardComplete);
            } else {
                const deliveryStreet = document.getElementById('delivery-street').value;
                const deliveryCity = document.getElementById('delivery-city').value;
                const deliveryState = document.getElementById('delivery-state').value;
                const deliveryZipcode = document.getElementById('delivery-zipcode').value;

                const isDeliveryAddressComplete = deliveryStreet && deliveryCity && deliveryState && deliveryZipcode;

                document.getElementById('checkout-btn').disabled = !(isAddressComplete && isCardComplete && isDeliveryAddressComplete);
            }
        });
    });

    // Handle checkout process
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        // Handle checkout process
        alert('Your order has been placed!');
        // Clears the cart in local storage
        localStorage.removeItem('cartItems');
        // Redirects user to the home page
        window.location.href = '/home';
    });

    // Enable/disable delivery address details based on checkbox state
    const billingDeliverySameCheckbox = document.getElementById('billing-delivery-same');
    const deliveryAddressDetails = document.getElementById('delivery-address-details');

    billingDeliverySameCheckbox.addEventListener('change', () => {
        if (billingDeliverySameCheckbox.checked) {
            deliveryAddressDetails.style.display = 'none';
        } else {
            deliveryAddressDetails.style.display = 'block';
        }
    });

    // Initial check to set the correct state on page load
    if (billingDeliverySameCheckbox.checked) {
        deliveryAddressDetails.style.display = 'none';
    } else {
        deliveryAddressDetails.style.display = 'block';
    }

    // Add input validation for letters only (city and name fields)
    const letterOnlyFields = document.querySelectorAll('#billing-city, #card-name, #delivery-city');
    letterOnlyFields.forEach(field => {
        field.addEventListener('input', () => {
            field.value = field.value.replace(/[^a-zA-Z\s]/g, '');
        });
    });

    // Add input validation for numbers only (zipcodes, card number, and cvv fields)
    const numberOnlyFields = document.querySelectorAll('#billing-zipcode, #delivery-zipcode, #card-number, #cvv');
    numberOnlyFields.forEach(field => {
        field.addEventListener('input', () => {
            field.value = field.value.replace(/\D/g, '');
        });
    });

    // Function to fetch user information
    async function fetchUserInfo() {
        try {
            const token = sessionStorage.getItem('token');
            const username = sessionStorage.getItem('username'); // Assume username is also stored

            let url = `/userInfo/receive`;

            // Add username query parameter to the URL
            if (username) {
                url += `?username=${encodeURIComponent(username)}`;
            } else {
                throw new Error('Username not found in session storage');
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error('Response:', response);
                throw new Error('Failed to fetch user information');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Error fetching user information:', error.message);
        }
    }

    // Autofill billing address if user is signed in and has a default address
    (async () => {
        const userData = await fetchUserInfo();
        if (userData && userData.street) {
            document.getElementById('billing-street').value = userData.street;
            document.getElementById('billing-city').value = userData.city;
            document.getElementById('billing-state').value = userData.stateAbr;
            document.getElementById('billing-zipcode').value = userData.zipcode;
        }
    })();
});