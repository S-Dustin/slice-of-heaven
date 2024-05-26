document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/authUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Save the token to sessionStorage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('username', data.username);

        // Redirect to the account page
        window.location.href = '/account';

    } catch (error) {
        console.error('Error:', error);
    }
});