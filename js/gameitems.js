document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-game-item');
    const searchButton = document.getElementById('search-item-btn');
    const gameItemsTable = document.querySelector('.game-items-table tbody');
    const tableRows = gameItemsTable.getElementsByTagName('tr');

    const filterTable = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();

        for (let i = 0; i < tableRows.length; i++) {
            const row = tableRows[i];
            const itemNameCell = row.cells[0]; // 'Item Name' is the first column
            const categoryCell = row.cells[2]; // 'Category' is the third column
            let match = false;

            if (itemNameCell) {
                const itemName = itemNameCell.textContent || itemNameCell.innerText;
                if (itemName.toLowerCase().includes(searchTerm)) {
                    match = true;
                }
            }

            if (!match && categoryCell) {
                const category = categoryCell.textContent || categoryCell.innerText;
                if (category.toLowerCase().includes(searchTerm)) {
                    match = true;
                }
            }

            if (match) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    };

    if (searchInput) {
        searchInput.addEventListener('keyup', filterTable);
    }

    if (searchButton) {
        searchButton.addEventListener('click', filterTable);
    }
}); 