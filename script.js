// Download Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle download buttons
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('primary') || this.textContent.trim() === 'Download') {
                e.preventDefault();
                
                // Simulate download progress
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
                this.disabled = true;
                
                // Simulate download time (3 seconds)
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 2000);
                }, 3000);
            }
        });
    });

    // Handle release notes buttons
    const releaseNotesButtons = document.querySelectorAll('.download-btn.secondary');
    
    releaseNotesButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Create modal for release notes
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Release Notes</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <h3>Version 2.5.1</h3>
                        <ul>
                            <li>Added new game features</li>
                            <li>Fixed critical bugs</li>
                            <li>Improved performance</li>
                            <li>Updated graphics</li>
                            <li>Added new levels</li>
                        </ul>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });
});

// Add modal styles
const style = document.createElement('style');
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: var(--color-white);
        padding: 2rem;
        border-radius: var(--card-border-radius);
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--color-dark-variant);
    }
    
    .modal-body h3 {
        margin-bottom: 1rem;
        color: var(--color-primary);
    }
    
    .modal-body ul {
        list-style: none;
        padding: 0;
    }
    
    .modal-body li {
        margin-bottom: 0.5rem;
        padding-left: 1.5rem;
        position: relative;
    }
    
    .modal-body li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--color-primary);
    }
`;
document.head.appendChild(style);

// Utility to handle modals and forms for all sections
function setupSection({
    tableId, modalId, formId, addBtnId, searchId, columns, getRowData, setFormData, getFormData, renderRow, getSearchText
}) {
    const table = document.getElementById(tableId);
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    const addBtn = document.getElementById(addBtnId);
    const searchInput = document.getElementById(searchId);
    const closeBtn = modal.querySelector('.close-modal');
    let editingRow = null;

    // Open modal for add
    addBtn.addEventListener('click', () => {
        editingRow = null;
        form.reset();
        modal.querySelector('h2').textContent = addBtn.textContent.replace('Add', 'Add');
        modal.style.display = 'block';
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Edit button
    table.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            editingRow = e.target.closest('tr');
            setFormData(form, getRowData(editingRow));
            modal.querySelector('h2').textContent = addBtn.textContent.replace('Add', 'Edit');
            modal.style.display = 'block';
        }
    });

    // Delete button
    table.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this entry?')) {
                e.target.closest('tr').remove();
            }
        }
    });

    // Form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = getFormData(form);
        if (editingRow) {
            // Edit
            renderRow(editingRow, data);
        } else {
            // Add
            const newRow = document.createElement('tr');
            renderRow(newRow, data);
            table.querySelector('tbody').appendChild(newRow);
        }
        modal.style.display = 'none';
        form.reset();
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        const search = getSearchText(e.target.value);
        Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(search) ? '' : 'none';
        });
    });
}

// Core Gameplay Mechanics
setupSection({
    tableId: 'core-gameplay-table',
    modalId: 'core-gameplay-modal',
    formId: 'core-gameplay-form',
    addBtnId: 'add-core-gameplay-btn',
    searchId: 'search-core-gameplay',
    columns: ['icon', 'title', 'details'],
    getRowData: row => ({
        icon: row.children[0].querySelector('span').textContent,
        title: row.children[1].textContent,
        details: row.children[2].textContent
    }),
    setFormData: (form, data) => {
        form.icon.value = data.icon;
        form.title.value = data.title;
        form.details.value = data.details;
    },
    getFormData: form => ({
        icon: form.icon.value,
        title: form.title.value,
        details: form.details.value
    }),
    renderRow: (row, data) => {
        row.innerHTML = `
            <td><span class="material-icons-sharp">${data.icon}</span></td>
            <td>${data.title}</td>
            <td>${data.details}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
    },
    getSearchText: v => v.toLowerCase()
});

// Silog Meals
setupSection({
    tableId: 'silog-meal-table',
    modalId: 'silog-meal-modal',
    formId: 'silog-meal-form',
    addBtnId: 'add-silog-meal-btn',
    searchId: 'search-silog-meal',
    columns: ['image', 'name', 'description'],
    getRowData: row => ({
        image: row.children[0].querySelector('img').getAttribute('src'),
        name: row.children[1].textContent,
        description: row.children[2].textContent
    }),
    setFormData: (form, data) => {
        form.image.value = data.image;
        form.name.value = data.name;
        form.description.value = data.description;
    },
    getFormData: form => ({
        image: form.image.value,
        name: form.name.value,
        description: form.description.value
    }),
    renderRow: (row, data) => {
        row.innerHTML = `
            <td><img src="${data.image}" alt="${data.name}" style="width:50px;"></td>
            <td>${data.name}</td>
            <td>${data.description}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
    },
    getSearchText: v => v.toLowerCase()
});

// Cooking Process
setupSection({
    tableId: 'cooking-process-table',
    modalId: 'cooking-process-modal',
    formId: 'cooking-process-form',
    addBtnId: 'add-cooking-process-btn',
    searchId: 'search-cooking-process',
    columns: ['step', 'title', 'description'],
    getRowData: row => ({
        step: row.children[0].textContent,
        title: row.children[1].textContent,
        description: row.children[2].textContent
    }),
    setFormData: (form, data) => {
        form.step.value = data.step;
        form.title.value = data.title;
        form.description.value = data.description;
    },
    getFormData: form => ({
        step: form.step.value,
        title: form.title.value,
        description: form.description.value
    }),
    renderRow: (row, data) => {
        row.innerHTML = `
            <td>${data.step}</td>
            <td>${data.title}</td>
            <td>${data.description}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
    },
    getSearchText: v => v.toLowerCase()
});

// Game Modes
setupSection({
    tableId: 'game-mode-table',
    modalId: 'game-mode-modal',
    formId: 'game-mode-form',
    addBtnId: 'add-game-mode-btn',
    searchId: 'search-game-mode',
    columns: ['icon', 'title', 'description'],
    getRowData: row => ({
        icon: row.children[0].querySelector('span').textContent,
        title: row.children[1].textContent,
        description: row.children[2].textContent
    }),
    setFormData: (form, data) => {
        form.icon.value = data.icon;
        form.title.value = data.title;
        form.description.value = data.description;
    },
    getFormData: form => ({
        icon: form.icon.value,
        title: form.title.value,
        description: form.description.value
    }),
    renderRow: (row, data) => {
        row.innerHTML = `
            <td><span class="material-icons-sharp">${data.icon}</span></td>
            <td>${data.title}</td>
            <td>${data.description}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
    },
    getSearchText: v => v.toLowerCase()
});

// Unlockables
setupSection({
    tableId: 'unlockable-table',
    modalId: 'unlockable-modal',
    formId: 'unlockable-form',
    addBtnId: 'add-unlockable-btn',
    searchId: 'search-unlockable',
    columns: ['icon', 'title', 'description'],
    getRowData: row => ({
        icon: row.children[0].querySelector('span').textContent,
        title: row.children[1].textContent,
        description: row.children[2].textContent
    }),
    setFormData: (form, data) => {
        form.icon.value = data.icon;
        form.title.value = data.title;
        form.description.value = data.description;
    },
    getFormData: form => ({
        icon: form.icon.value,
        title: form.title.value,
        description: form.description.value
    }),
    renderRow: (row, data) => {
        row.innerHTML = `
            <td><span class="material-icons-sharp">${data.icon}</span></td>
            <td>${data.title}</td>
            <td>${data.description}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
    },
    getSearchText: v => v.toLowerCase()
}); 