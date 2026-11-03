// Hardcoded stock array linking to public audio asset repositories
let soundInventory = [
    { id: "pipe", name: "💥 Bass Boosted Metal Pipe Falling", url: "https://google.com", enabled: true },
    { id: "vine", name: "🗿 Vine Boom Impact", url: "https://soundjay.com", enabled: true }, 
    { id: "mario", name: "🍄 Retro Mario Jump Sound", url: "https://soundjay.com", enabled: true },
    { id: "yoda", name: "👽 Classic Lego Yoda Death Scream", url: "https://google.com", enabled: true },
    { id: "villager", name: "🌾 Minecraft Villager Huh?", url: "https://google.com", enabled: true },
    { id: "fart", name: "💨 Reverb Fart Sound Effect", url: "https://google.com", enabled: true },
    { id: "error", name: "💻 Windows XP Critical Error Dialog", url: "https://soundjay.com", enabled: true }
];

let executionTimer = null;
let isEngineRunning = false;

const intervalInput = document.getElementById('interval-input');
const intervalVal = document.getElementById('interval-val');
const chanceInput = document.getElementById('chance-input');
const chanceVal = document.getElementById('chance-val');
const startBtn = document.getElementById('start-btn');
const soundPoolList = document.getElementById('sound-pool-list');
const statusDisplay = document.getElementById('status-display');
const selectAllBtn = document.getElementById('select-all-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

intervalInput.addEventListener('input', () => intervalVal.textContent = intervalInput.value);
chanceInput.addEventListener('input', () => chanceVal.textContent = chanceInput.value);

// Build UI checkboxes out of the hardcoded memory array
function renderSoundPool() {
    soundPoolList.innerHTML = '';
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

// Bulk toggle selectors
selectAllBtn.addEventListener('click', () => { soundInventory.forEach(s => s.enabled = true); renderSoundPool(); });
clearAllBtn.addEventListener('click', () => { soundInventory.forEach(s => s.enabled = false); renderSoundPool(); });

// Engine runtime cycle loop
function runEngineCycle() {
    if (!isEngineRunning) return;

    statusDisplay.textContent = "Engine Status: Infinite silence stretching out...";
    const activePool = soundInventory.filter(s => s.enabled);
    
    if (activePool.length === 0) {
        statusDisplay.textContent = "Warning: Safe mode active (Zero triggers enabled)";
        scheduleNextCycle();
        return;
    }

    const diceRoll = Math.random() * 100;
    const coreChance = parseInt(chanceInput.value);

    if (diceRoll <= coreChance) {
        const randomIndex = Math.floor(Math.random() * activePool.length);
        const selectedSound = activePool[randomIndex];
        
        statusDisplay.textContent = `🚨 INTERRUPTED BY: ${selectedSound.name}`;
        
        // Spawn audio layer node
        const audioNode = new Audio(selectedSound.url);
        audioNode.play().catch(err => console.log("Audio lock:", err));
    }

    scheduleNextCycle();
}

function scheduleNextCycle() {
    const cycleTimeMilliseconds = parseInt(intervalInput.value) * 1000;
    executionTimer = setTimeout(runEngineCycle, cycleTimeMilliseconds);
}

// Master killswitch toggling
startBtn.addEventListener('click', () => {
    if (isEngineRunning) {
        isEngineRunning = false;
        clearTimeout(executionTimer);
        startBtn.textContent = "⚡ Start the Silence";
        startBtn.style.background = "#00ff66";
        statusDisplay.textContent = "Engine Status: Halted";
    } else {
        isEngineRunning = true;
        startBtn.textContent = "🛑 Stop Engine";
        startBtn.style.background = "#ff0055";
        runEngineCycle();
    }
});

renderSoundPool();
