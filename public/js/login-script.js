document.addEventListener('DOMContentLoaded', () => {
    // Handle form swap
    document.querySelector('.sign-up').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
    });

    document.querySelector('.login-link').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });

    // Function to validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to validate password format
    function validatePassword(password) {
        // Password must be at least 8 characters, contain at least one lowercase letter,
        // one uppercase letter, and one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    // Handle form submissions
    document.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formId = event.target.id;

        if (formId === 'login-form') {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/authUser/login', {
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

                // Save the token to sessionStorage
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('username', data.username);

                // Redirect to the account page
                window.location.href = '/account';

            } catch (error) {
                console.error('Error:', error);
            }
        } else if (formId === 'signup-form') {
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;
            const firstName = document.getElementById('signup-firstname').value;
            const lastName = document.getElementById('signup-lastname').value;
            const email = document.getElementById('signup-email').value;

            // Validate fields
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            if (!validatePassword(password)) {
                alert('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number.');
                return;
            }

            // Check for special characters in username, password, firstName, and lastName
            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (specialCharRegex.test(username) || specialCharRegex.test(firstName) || specialCharRegex.test(lastName) || specialCharRegex.test(password)) {
                alert('Only email should have a special character (@).');
                return;
            }

            // Check for numbers in firstName and lastName
            const numberRegex = /\d/;
            if (numberRegex.test(firstName) || numberRegex.test(lastName)) {
                alert('First name and last name should not contain numbers.');
                return;
            }

            // Proceed with sign-up if all validations pass
            try {
                // Check if username already exists
                const checkResponse = await fetch(`/authUser/checkUsername?username=${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!checkResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const checkData = await checkResponse.json();

                if (checkData.exists) {
                    alert('Username already exists. Please choose another one.');
                    return;
                }

                // Proceed with sign-up if username does not exist
                const response = await fetch('/authUser/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password, firstName, lastName, email }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Sign-up successful:', data);
                alert('Account has been created.');

                // Refresh the page
                window.location.href = '/login';

            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
});