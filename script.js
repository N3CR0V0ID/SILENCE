// Pre-seeded meme bank array using safe public file links
let soundInventory = [
    { id: "pipe", name: "💥 Bass Boosted Metal Pipe Falling", url: "https://google.com", enabled: true },
    { id: "vine", name: "🗿 Vine Boom Impact", url: "https://soundjay.com", enabled: true }, 
    { id: "mario", name: "🍄 Retro Mario Jump Sound", url: "https://soundjay.com", enabled: true },
    { id: "error", name: "💻 Windows XP Critical Error Dialog", url: "https://soundjay.com", enabled: true }
];

let executionTimer = null;
let isEngineRunning = false;

// DOM Object caching hooks
const intervalInput = document.getElementById('interval-input');
const intervalVal = document.getElementById('interval-val');
const chanceInput = document.getElementById('chance-input');
const chanceVal = document.getElementById('chance-val');
const startBtn = document.getElementById('start-btn');
const soundPoolList = document.getElementById('sound-pool-list');
const statusDisplay = document.getElementById('status-display');
const selectAllBtn = document.getElementById('select-all-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

// Live update labels when sliding configurations
intervalInput.addEventListener('input', () => intervalVal.textContent = intervalInput.value);
chanceInput.addEventListener('input', () => chanceVal.textContent = chanceInput.value);

// Re-compile layout checklist UI elements 
function renderSoundPool() {
    soundPoolList.innerHTML = '';
    
    if (soundInventory.length === 0) {
        soundPoolList.innerHTML = '<p style="color: #666; font-style: italic;">No sounds loaded into engine database.</p>';
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

// Group toggle event listeners
selectAllBtn.addEventListener('click', () => { soundInventory.forEach(s => s.enabled = true); renderSoundPool(); });
clearAllBtn.addEventListener('click', () => { soundInventory.forEach(s => s.enabled = false); renderSoundPool(); });

// Clock tracking tick mechanism
function runEngineCycle() {
    if (!isEngineRunning) return;

    statusDisplay.textContent = "Engine Status: Listening to silence...";
    const activePool = soundInventory.filter(s => s.enabled);
    
    if (activePool.length === 0) {
        statusDisplay.textContent = "Engine Warning: Silence uncompromised (No sounds enabled!)";
        scheduleNextCycle();
        return;
    }

    const diceRoll = Math.random() * 100;
    const coreChance = parseInt(chanceInput.value);

    if (diceRoll <= coreChance) {
        const randomIndex = Math.floor(Math.random() * activePool.length);
        const selectedSound = activePool[randomIndex];
        
        statusDisplay.textContent = `🚨 INTERRUPTED BY: ${selectedSound.name}`;
        
        // Instant audio node constructor to handle rapid overlaps
        const audioNode = new Audio(selectedSound.url);
        audioNode.play().catch(err => console.log("Browser block error context:", err));
    }

    scheduleNextCycle();
}

function scheduleNextCycle() {
    const cycleTimeMilliseconds = parseInt(intervalInput.value) * 1000;
    executionTimer = setTimeout(runEngineCycle, cycleTimeMilliseconds);
}

// Master execution toggle gate
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

// Build standard roster list on application boot
renderSoundPool();
