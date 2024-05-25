const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Function to send order confirmation email
async function sendOrderConfirmationEmail(order) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: order.customerEmail,
        subject: 'Order Confirmation',
        text: `
        Thank you for your order, ${order.customerName}!
        
        Your order details:
        ${order.cart.map(item => `${item.itemName}: $${item.itemPrice}`).join('\n')}
        
        Total: $${order.totalPrice}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully.');
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
}

module.exports = { sendOrderConfirmationEmail };