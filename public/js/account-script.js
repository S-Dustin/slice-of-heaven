document.addEventListener('DOMContentLoaded', async function() {
    // Function to fetch user information
    async function fetchUserInfo() {
        try {
            const token = sessionStorage.getItem('token');
            const username = sessionStorage.getItem('username'); // Assume username is also stored

            console.log('Token:', token);
            console.log('Username:', username);

            let url = `http://localhost:8000/user`;

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
        console.log('User information:', user);
        console.log('User email:', user.email);
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
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:8000/user/address', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address })
            });
            if (!response.ok) {
                throw new Error('Failed to update address');
            }
            const userData = await response.json();
            displayUserInfo(userData);
        } catch (error) {
            console.error('Error updating address:', error.message);
        }
    }

    // Function to remove user's address
    async function removeAddress() {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:8000/user/address', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to remove address');
            }
            const userData = await response.json();
            displayUserInfo(userData);
        } catch (error) {
            console.error('Error removing address:', error.message);
        }
    }

    // Function to log out
    function logOut() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('username');
        window.location.href = 'login.html';
        const token = '';
        const username = '';
    }

    // Fetch user information and display it on the page
    const user = await fetchUserInfo();
    if (user) {
        console.log('User information:', user);
        displayUserInfo(user);
    }

    // Event listener for updating address form submission
    const updateAddressForm = document.getElementById('updateAddressForm');
    updateAddressForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newAddress = document.getElementById('newAddress').value;
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