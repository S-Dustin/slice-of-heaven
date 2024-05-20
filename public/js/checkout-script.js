// Retrieve item details from local storage
const items = JSON.parse(localStorage.getItem('cartItems'));

// Display item details on the checkout page
const itemDetailsContainer = document.getElementById('item-details');
itemDetailsContainer.innerHTML = '';

items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.innerHTML = `
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
    `;
    itemDetailsContainer.appendChild(itemElement);
});

// Calculate total amount
let subtotal = 0;
items.forEach(item => {
    subtotal += item.quantity * item.price;
});
const deliveryFees = 0.06 * subtotal;
const tax = 0.12 * subtotal;
const total = subtotal + deliveryFees + tax;

// Display order summary
const orderSummaryContainer = document.getElementById('order-summary');
orderSummaryContainer.innerHTML = `
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Delivery Fees: $${deliveryFees.toFixed(2)}</p>
    <p>Tax: $${tax.toFixed(2)}</p>
    <p>Total: $${total.toFixed(2)}</p>
`;

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
});