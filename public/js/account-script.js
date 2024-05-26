document.addEventListener('DOMContentLoaded', async function() {
    // Function to verify the token
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
            return data;
        } catch (error) {
            console.error('Error verifying token:', error.message);
            throw error;
        }
    }

    // Function to fetch user information
    async function fetchUserInfo() {
        try {
            const token = sessionStorage.getItem('token');
            const username = sessionStorage.getItem('username'); // Assume username is also stored

            let url = `/userInfo`;

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

    // Function to display user information
    function displayUserInfo(user) {

        const userFirstNameElement = document.getElementById('userFirstName');
        const userInfoElement = document.getElementById('userInfo');
        userFirstNameElement.textContent = user.firstName;

        const userInfoHTML = `
            <p>Email: ${user.email}</p>
            <p>Address: ${user.street || 'Not available'}, ${user.city || ''}, ${user.stateAbr || ''} ${user.zipcode || ''}</p>
        `;
        userInfoElement.innerHTML = userInfoHTML;
    }

    // Function to update user's address
    async function updateAddress(address) {
        try {
            // Fetch information from form
            const street = document.getElementById('street').value;
            const city = document.getElementById('city').value;
            const stateAbr = document.getElementById('state').value;
            const zipcode = document.getElementById('zipcode').value;
            // Retrieve authentication token from sessionStorage
            const token = sessionStorage.getItem('token');
            const username = sessionStorage.getItem('username');
            // Check if authentication token is available
            if (!token) {
                throw new Error('Authentication token not found');
            }

            // Send PUT request to update user's address
            const response = await fetch('/userInfo/address', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' // Set content type to JSON
                },
                body: JSON.stringify({ username, street, city, stateAbr, zipcode }) // Include address data in the request body
            });

            // Check if response is successful
            if (!response.ok) {
                throw new Error('Failed to update address');
            }

            // Parse response data as JSON
            const userData = await response.json();
            // Update user interface with updated user data
            displayUserInfo(userData);

            // Clear address fields
            document.getElementById('street').value = '';
            document.getElementById('city').value = '';
            document.getElementById('state').value = '';
            document.getElementById('zipcode').value = '';

        } catch (error) {
            console.error('Error updating address:', error.message);
        }
    }

    // Function to remove user's address
    async function removeAddress() {
        try {
            // Retrieve authentication token from sessionStorage
            const token = sessionStorage.getItem('token');
            const username = sessionStorage.getItem('username');
            // Check if authentication token is available
            if (!token) {
                throw new Error('Authentication token not found');
            }

            // Send DELETE request to remove user's address
            const response = await fetch('/userInfo/address', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json' // Set content type to JSON
                },
                body: JSON.stringify({ username }) // Include address data in the request body
            });

            // Check if response is successful
            if (!response.ok) {
                throw new Error('Failed to remove address');
            }

            // Parse response data as JSON
            const userData = await response.json();
            // Update user interface with updated user data
            displayUserInfo(userData);
        } catch (error) {
            console.error('Error removing address:', error.message);
        }
    }

    // Function to log out
    function logOut() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username'); // Clear the username as well
        window.location.href = '/login';
    }

    // Verify token before proceeding
    try {
        await verifyToken();
    } catch (error) {
        alert('Error verifying. Please log in again to access this page.');
        // Redirect to login page if token is invalid
        window.location.href = '/login';
        return;
    }

    // Fetch user information and display it on the page
    const user = await fetchUserInfo();
    if (user) {
        displayUserInfo(user);
    }

    // Event listener for updating address form submission
    const updateAddressForm = document.getElementById('updateAddressForm');
    updateAddressForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newAddress = document.getElementById('updateAddressForm').value;
        updateAddress(newAddress);
    });

    // Event listener for remove address button
    const removeAddressButton = document.getElementById('removeAddressButton');
    removeAddressButton.addEventListener('click', function() {
        removeAddress();
    });

    // Event listener for log out button
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function() {
        logOut();
    });
});