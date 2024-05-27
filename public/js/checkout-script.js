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
        const street = document.getElementById('street').value;
        const city = document.getElementById('city').value;
        const stateAbr = document.getElementById('stateAbr').value;
        const zipcode = document.getElementById('zipcode').value;

        const isAddressComplete = street && city && stateAbr && zipcode;

        const cardNumber = document.getElementById('card-number').value;
        const cardName = document.getElementById('card-name').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const cvv = document.getElementById('cvv').value;

        const isCardComplete = cardNumber && cardName && expirationDate && cvv;

        document.getElementById('checkout-btn').disabled = !(isAddressComplete && isCardComplete);
    });
});

// Handle checkout process
const checkoutBtn = document.getElementById('checkout-btn');
checkoutBtn.addEventListener('click', () => {
    // Handle checkout process
    alert('Checkout process initiated');
});