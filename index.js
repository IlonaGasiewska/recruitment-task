const gridContainer = document.querySelector('.grid-container');
const audioInput = document.getElementById('audioInput');
const audioPlayer = document.getElementById('audioPlayer');

const numRows = 10;
const numColumns = 10;

const createGrid = () => {
    for (let i = 0; i < numRows * numColumns; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridContainer.appendChild(gridItem);
    }
};

const colorizeGrid = (columnColors) => {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item, index) => {
        const column = Math.floor(index / numRows);
        const color = columnColors[column] || 'white';

        item.style.backgroundColor = color;
    });
};

const setupAudioContext = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualization = () => {
        analyser.getByteFrequencyData(dataArray);

        const columnColors = [];

        for (let i = 0; i < numColumns; i++) {
            const start = Math.floor((i / numColumns) * bufferLength);
            const end = Math.floor(((i + 1) / numColumns) * bufferLength);
            const sum = dataArray.slice(start, end).reduce((acc, val) => acc + val, 0);
            const average = sum / (end - start + 1);

            const normalizedValue = average / 256;
            const color = `rgba(255, 0, 0, ${normalizedValue})`;

            columnColors.push(color);
        }

        colorizeGrid(columnColors.reverse());
        requestAnimationFrame(updateVisualization);
    };

    updateVisualization();
};

audioInput.addEventListener('change', function () {
    const selectedFile = audioInput.files[0];

    if (selectedFile) {
        const objectURL = URL.createObjectURL(selectedFile);
        audioPlayer.src = objectURL;

        audioPlayer.addEventListener('play', function () {
            setupAudioContext();
        });

        audioPlayer.addEventListener('pause', function () {
            colorizeGrid([]);
        });
    }
});

createGrid();
