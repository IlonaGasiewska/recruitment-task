const gridContainer = document.querySelector('.grid-container');

        for (let i = 0; i < 100; i++) { 
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridContainer.appendChild(gridItem);
        }
