// Keyboard event for menu open
document.addEventListener('keydown', function (event) {
    if (event.key === 'p' || event.key === 'P') {
        const menu = document.getElementById('menu');
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
    }
});
