// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Password Toggle Functionality
    const toggleBtns = document.querySelectorAll('.toggle-pwd');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = btn.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                btn.textContent = 'Hide';
            } else {
                input.type = 'password';
                btn.textContent = 'Show';
            }
        });
    });
});