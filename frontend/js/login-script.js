// Get a reference to the login form using its ID
const loginForm = document.getElementById('login-form');

// Add an event listener for the form submission
loginForm.addEventListener('submit', async function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the username and password from the form inputs
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the server to authenticate the user
        const response = await fetch('http://localhost:8000/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Check if the response is successful (status code 200)
        if (response.ok) {
            // If successful, extract the token from the response
            const { token } = await response.json();

            // Save the token to sessionStorage for future use
            sessionStorage.setItem('token', token);

            // Optionally, redirect the user to another page
            window.location.href = 'account.html';
        } else {
            // If the response is not successful, display an error message
            console.error('Login failed');
        }
    } catch (error) {
        // Handle any errors that occur during the login process
        console.error('Error during login:', error);
    }
});