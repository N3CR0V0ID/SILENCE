// Pre-seeded synth sound data strings to bypass all browser CORS blocks entirely
let soundInventory = [
    { 
        id: "laser", 
        name: "👾 Retro Sci-Fi Laser Sound", 
        url: "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV92T18AZmZmZmVmZWNkY2JhWVlZWllZWXFxeXl5gYFhYWFhYWGBgYGBgYFhYWFhYWGBgYFhYWFhYWGBgYGBgXFxeXl5gYFhYWFhYWGBgWQA", 
        enabled: true 
    },
    { 
        id: "blip", 
        name: "🍄 Retro Arcade Jump Blip", 
        url: "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV92T18Aenp6enp6ampqampqampqampqampqaWlpaWlpaWlpampqampqampqampqaWlpaWlpaWlpaWlpampqampqampqamQA", 
        enabled: true 
    },
    { 
        id: "alert", 
        name: "💻 Windows Error Tone Synth", 
        url: "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV92T18Ad3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3QA", 
        enabled: true 
    }
];

let executionTimer = null;
let isEngineRunning = false;

// UI Component DOM Targets
const intervalInput = document.getElementById('interval-input');
const intervalVal = document.getElementById('interval-val');
const chanceInput = document.getElementById('chance-input');
const chanceVal = document.getElementById('chance-val');
const startBtn = document.getElementById('start-btn');
const soundPoolList = document.getElementById('sound-pool-list');
const statusDisplay = document.getElementById('status-display');
const selectAllBtn = document.getElementById('select-all-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

// Live update configurations labels on slide drag
intervalInput.addEventListener('input', () => intervalVal.textContent = intervalInput.value);
chanceInput.addEventListener('input', () => chanceVal.textContent = chanceInput.value);

// Build checkable inventory roster interface lines
function renderSoundPool() {
    soundPoolList.innerHTML = '';
    
    if (soundInventory.length === 0) {
        soundPoolList.innerHTML = '<p style="color: #777; font-style: italic; text-align: center; margin-top: 20px;">No sounds loaded.</p>';
        return;
    }

    soundInventory.forEach(sound => {
        const row = document.createElement('div');
        row.className = 'sound-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = sound.enabled;
        checkbox.addEventListener('change', () => sound.enabled = checkbox.checked);

        const label = document.createElement('span');
        label.textContent = sound.name;
        
        row.appendChild(checkbox);
        row.appendChild(label);
        soundPoolList.appendChild(row);
    });
}

// Bulk checklist actions
selectAllBtn.addEventListener('click', () => { soundInventory.forEach(s => s.enabled = true); renderSoundPool(); });
clearAllBtn.addEventListener('click', () => { soundInventory.forEach(s => s.enabled = false); renderSoundPool(); });

// Main execution cycle iteration
function runEngineCycle() {
    if (!isEngineRunning) return;

    statusDisplay.textContent = "Engine Status: Emitting pure silence...";
    const activePool = soundInventory.filter(s => s.enabled);
    
    if (activePool.length === 0) {
        statusDisplay.textContent = "Engine Status: Safe mode active (Zero sound targets selected)";
        scheduleNextCycle();
        return;
    }

    const diceRoll = Math.random() * 100;
    const coreChance = parseInt(chanceInput.value);

    if (diceRoll <= coreChance) {
        const randomIndex = Math.floor(Math.random() * activePool.length);
        const selectedSound = activePool[randomIndex];
        
        statusDisplay.textContent = `💥 Interrupted by: ${selectedSound.name}`;
        
        // Native standalone sound audio constructor pipeline
        const audioNode = new Audio(selectedSound.url);
        audioNode.play().catch(err => console.log("Audio play block prevented:", err));
    }

    scheduleNextCycle();
}

function scheduleNextCycle() {
    const cycleTimeMilliseconds = parseInt(intervalInput.value) * 1000;
    executionTimer = setTimeout(runEngineCycle, cycleTimeMilliseconds);
}

// Global master state toggle link click logic
startBtn.addEventListener('click', () => {
    if (isEngineRunning) {
        isEngineRunning = false;
        clearTimeout(executionTimer);
        startBtn.textContent = "Start Silence";
        startBtn.classList.remove('running');
        statusDisplay.textContent = "Engine Status: Halted";
    } else {
        isEngineRunning = true;
        startBtn.textContent = "Stop Silence";
        startBtn.classList.add('running');
        runEngineCycle();
    }
});

// Render the stable local pool targets right away on load execution 
renderSoundPool();
