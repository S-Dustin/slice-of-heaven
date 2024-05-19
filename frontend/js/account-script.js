document.addEventListener('DOMContentLoaded', async function() {
    // Function to fetch user information
    async function fetchUserInfo() {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:8000/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
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
            <p>First Name: ${user.firstName}</p>
            <p>Last Name: ${user.lastName}</p>
            <p>Email: ${user.email}</p>
            <p>Address: ${user.address || 'Not available'}</p>
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
        window.location.href = 'login.html';
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