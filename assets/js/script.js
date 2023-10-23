// Keyboard event for menu open
document.addEventListener('keydown', function (event) {
    if (event.key === 'p' || event.key === 'P') {
        const menu = document.getElementById('menu');
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
    }
});

// Initialize the toasts
const toastElList = document.querySelectorAll('.toast')
const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, option))