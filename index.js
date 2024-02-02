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
        const color = columnColors[index] || 'white';
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

        const maxAmplitude = Math.max(...dataArray);
        const scale = maxAmplitude > 0 ? 1 / maxAmplitude : 0;

        const columnColors = Array.from(dataArray).map(value => {
            const scaledValue = value * scale;
            return scaledValue > 0.1 ? 'red' : 'white';
        });

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
            colorizeGrid(Array(numColumns).fill('white'));
        });
    }
});

createGrid();
