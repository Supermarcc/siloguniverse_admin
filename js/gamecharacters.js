document.addEventListener('DOMContentLoaded', function() {
    // Add animation to character cards when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Initialize all character cards with animation properties
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Add click event to character cards for more details
    characterCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

    // Modal elements
    const modal = document.getElementById('character-modal');
    const addBtn = document.getElementById('add-character-btn');
    const closeBtn = document.querySelector('.close-modal');
    const characterForm = document.getElementById('character-form');

    // Search functionality
    const searchInput = document.getElementById('search-character');
    const tableBody = document.querySelector('tbody');

    // Show modal
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    characterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        const formData = new FormData(characterForm);
        const characterData = Object.fromEntries(formData.entries());
        
        // For now, we'll just log the data
        console.log('New character data:', characterData);
        
        // Close the modal
        modal.style.display = 'none';
        characterForm.reset();
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Edit functionality
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.cells;
            
            // Populate form with existing data
            document.getElementById('character-icon').value = cells[1].textContent;
            document.getElementById('character-name').value = cells[2].textContent;
            document.getElementById('character-type').value = cells[3].textContent;
            document.getElementById('character-age').value = cells[4].textContent;
            document.getElementById('character-background').value = cells[5].textContent;
            document.getElementById('character-personality').value = cells[6].textContent;
            document.getElementById('character-order').value = cells[7].textContent;
            document.getElementById('character-quirk').value = cells[8].textContent;

            // Show modal
            modal.style.display = 'block';
        });
    });

    // Delete functionality
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this character?')) {
                const row = this.closest('tr');
                // Here you would typically send a delete request to your backend
                row.remove();
            }
        });
    });
}); 