let headerLoaded = false;

function loadHeader() {
    if (!headerLoaded) {
        fetch('header.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('header-container').innerHTML = html;
                loadHeaderScripts();
                headerLoaded = true;
            })
            .catch(error => console.error('Error loading header:', error));
    }
}

function loadHeaderScripts() {
    const script = document.createElement('script');
    script.src = '../js/header-script.js';
    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', loadHeader);