// FAQ PAGE JS (migrated from faqs.html)
// Modal Elements
const addFaqModal = document.getElementById('add-faq-modal');
const editFaqModal = document.getElementById('edit-faq-modal');
const viewFaqModal = document.getElementById('view-faq-modal');
const addFaqBtn = document.getElementById('add-faq-btn');
const searchInput = document.getElementById('search-faq');
const categoryFilter = document.getElementById('category-filter');

// Modal Functions
function openModal(modal) {
    modal.style.display = "block";
}

function closeModal(modal) {
    modal.style.display = "none";
}

function closeFaqModal() {
    closeModal(addFaqModal);
}

function closeEditFaqModal() {
    closeModal(editFaqModal);
}

function closeViewFaqModal() {
    closeModal(viewFaqModal);
}

// Event Listeners
if (addFaqBtn) {
    addFaqBtn.onclick = () => openModal(addFaqModal);
}

// Close modal if clicked outside
window.onclick = function(event) {
    if (event.target == addFaqModal) closeFaqModal();
    if (event.target == editFaqModal) closeEditFaqModal();
    if (event.target == viewFaqModal) closeViewFaqModal();
}

// Search and Filter Functionality
function filterFAQs() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const question = row.cells[2].textContent.toLowerCase();
        const answer = row.cells[3].textContent.toLowerCase();
        const rowCategory = row.dataset.category;
        
        const matchesSearch = question.includes(searchTerm) || answer.includes(searchTerm);
        const matchesCategory = category === 'all' || rowCategory === category;

        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

searchInput.addEventListener('input', filterFAQs);
categoryFilter.addEventListener('change', filterFAQs);

// View FAQ Details
document.querySelectorAll('.action-btn.view').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        document.getElementById('view-faq-category').textContent = row.cells[1].textContent;
        document.getElementById('view-faq-question').textContent = row.cells[2].textContent;
        document.getElementById('view-faq-answer').textContent = row.cells[3].textContent;
        document.getElementById('view-faq-date').textContent = row.cells[4].textContent;
        openModal(viewFaqModal);
    });
});

// Edit FAQ
document.querySelectorAll('.action-btn.edit').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        document.getElementById('edit-faq-id').value = row.cells[0].textContent;
        document.getElementById('edit-faq-category').value = row.dataset.category;
        document.getElementById('edit-faq-question').value = row.cells[2].textContent;
        document.getElementById('edit-faq-answer').value = row.cells[3].textContent;
        openModal(editFaqModal);
    });
});

// Delete FAQ
document.querySelectorAll('.action-btn.delete').forEach(button => {
    button.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this FAQ?')) {
            this.closest('tr').remove();
        }
    });
});

// Form Submissions
const addFaqForm = document.getElementById('add-faq-form');
if (addFaqForm) {
    addFaqForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Add your form submission logic here
        closeFaqModal();
        this.reset();
    });
}

const editFaqForm = document.getElementById('edit-faq-form');
if (editFaqForm) {
    editFaqForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Add your form submission logic here
        closeEditFaqModal();
    });
} 