// State tracking matrix
let soundInventory = [];
let executionTimer = null;
let isEngineRunning = false;

// UI Element selectors
const intervalInput = document.getElementById('interval-input');
const intervalVal = document.getElementById('interval-val');
const chanceInput = document.getElementById('chance-input');
const chanceVal = document.getElementById('chance-val');
const startBtn = document.getElementById('start-btn');
const fileUploader = document.getElementById('file-uploader');
const soundPoolList = document.getElementById('sound-pool-list');
const statusDisplay = document.getElementById('status-display');

// Synchronize range sliders with text values dynamically
intervalInput.addEventListener('input', () => intervalVal.textContent = intervalInput.value);
chanceInput.addEventListener('input', () => chanceVal.textContent = chanceInput.value);

// Track custom file uploads and create localized runtime links
fileUploader.addEventListener('change', (event) => {
    const files = event.target.files;
    for (let file of files) {
        const audioUrl = URL.createObjectURL(file);
        
        const soundObject = {
            id: 'sound_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            url: audioUrl,
            enabled: true
        };
        
        soundInventory.push(soundObject);
    }
    renderSoundPool();
});

// Build the dynamic checkbox inventory interface
function renderSoundPool() {
    soundPoolList.innerHTML = '';
    
    if (soundInventory.length === 0) {
        soundPoolList.innerHTML = '<p style="color: #666; font-style: italic;">No sounds loaded. Upload files above.</p>';
        return;
    }

    soundInventory.forEach(sound => {
        const row = document.createElement('div');
        row.className = 'sound-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = sound.enabled;
        checkbox.addEventListener('change', () => {
            sound.enabled = checkbox.checked;
        });

        const label = document.createElement('span');
        label.textContent = sound.name;
        
        row.appendChild(checkbox);
        row.appendChild(label);
        soundPoolList.appendChild(row);
    });
}

// The loop cycle evaluation logic
function runEngineCycle() {
    if (!isEngineRunning) return;

    statusDisplay.textContent = "Engine Status: Listening to silence...";

    // 1. Filter inventory pool down to enabled choices
    const activePool = soundInventory.filter(s => s.enabled);
    
    if (activePool.length === 0) {
        statusDisplay.textContent = "Engine Warning: No sounds enabled!";
        scheduleNextCycle();
        return;
    }

    // 2. Perform probability threshold checking
    const diceRoll = Math.random() * 100;
    const coreChance = parseInt(chanceInput.value);

    if (diceRoll <= coreChance) {
        const randomIndex = Math.floor(Math.random() * activePool.length);
        const selectedSound = activePool[randomIndex];
        
        statusDisplay.textContent = `💥 JUMPSCARE FIRED: ${selectedSound.name}`;
        
        // Build an isolated, overlapping audio node instance to skip channel locks
        const audioNode = new Audio(selectedSound.url);
        audioNode.play().catch(err => console.log("Audio bypass error:", err));
    }

    // 3. Queue the next step loop
    scheduleNextCycle();
}

function scheduleNextCycle() {
    const cycleTimeMilliseconds = parseInt(intervalInput.value) * 1000;
    executionTimer = setTimeout(runEngineCycle, cycleTimeMilliseconds);
}

// Manage master execution switch states
startBtn.addEventListener('click', () => {
    if (isEngineRunning) {
        isEngineRunning = false;
        clearTimeout(executionTimer);
        startBtn.textContent = "⚡ Initialize Silence";
        startBtn.style.background = "#00ff00";
        statusDisplay.textContent = "Engine Status: Halted";
    } else {
        isEngineRunning = true;
        startBtn.textContent = "🛑 Terminate Engine";
        startBtn.style.background = "#ff0000";
        runEngineCycle();
    }
});
