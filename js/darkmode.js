// Dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkMode = document.querySelector('.dark-mode');
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode-variables');
        darkMode.querySelector('span:nth-child(1)').classList.remove('active');
        darkMode.querySelector('span:nth-child(2)').classList.add('active');
    }

    // Toggle dark mode
    darkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode-variables');
        darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
        darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
        
        // Save preference
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode-variables'));
    });
}); 