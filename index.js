const gridContainer = document.querySelector('.grid-container');
const audioInput = document.getElementById('audioInput');
const audioPlayer = document.getElementById('audioPlayer');

    for (let i = 0; i < 100; i++) { 
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridContainer.appendChild(gridItem);
    }

    audioInput.addEventListener('change', function() {
        const selectedFile = audioInput.files[0];

        if (selectedFile) {
            const objectURL = URL.createObjectURL(selectedFile);
            audioPlayer.src = objectURL;
        }
    });