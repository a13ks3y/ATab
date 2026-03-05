
import { getSettings } from './settings.js';
import { logPomodoroSession } from './analytics.js';

let timerInterval = null;
let remainingTime = 25 * 60; // Initial default
let currentMode = 'work'; // 'work', 'shortBreak', 'longBreak'
let isRunning = false;

const modes = {
    work: 'Work',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
};

const defaultIntervals = {
    work: 25,
    shortBreak: 5,
    longBreak: 15
};

function getInterval(mode) {
    const settings = getSettings();
    if (mode === 'work') return settings.pomodoroWork || defaultIntervals.work;
    if (mode === 'shortBreak') return settings.pomodoroShort || defaultIntervals.shortBreak;
    if (mode === 'longBreak') return settings.pomodoroLong || defaultIntervals.longBreak;
    return 25;
}

export function initPomodoro() {
    const toggleBtn = document.getElementById('pomodoro-toggle');
    const widget = document.getElementById('pomodoro-widget');
    const closeBtn = document.getElementById('close-pomodoro');
    const startBtn = document.getElementById('pomodoro-start');
    const resetBtn = document.getElementById('pomodoro-reset');
    const modeBtns = document.querySelectorAll('.pomodoro-modes button');

    // Initialize timer based on settings
    resetTimer(false); 

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = widget.classList.toggle('hidden');
            toggleBtn.setAttribute('aria-expanded', !isHidden);
            
            if (!isHidden) {
                // Focus the start button or close button
                startBtn.focus();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            widget.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        });
    }

    // Close on Escape
    widget.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            widget.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        }
    });

    if (startBtn) {
        startBtn.addEventListener('click', toggleTimer);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => resetTimer(true));
    }

    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            switchMode(mode);
        });
    });

    // Request notification permission if not granted
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function switchMode(mode) {
    if (currentMode === mode) return;
    
    currentMode = mode;
    
    // Update active button state
    document.querySelectorAll('.pomodoro-modes button').forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    resetTimer(true);
}

function toggleTimer() {
    const startBtn = document.getElementById('pomodoro-start');
    if (isRunning) {
        pauseTimer();
        startBtn.textContent = 'Start';
    } else {
        startTimer();
        startBtn.textContent = 'Pause';
    }
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    
    timerInterval = setInterval(() => {
        remainingTime--;
        updateDisplay();
        
        if (remainingTime <= 0) {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
}

function resetTimer(updateUI = true) {
    pauseTimer();
    const startBtn = document.getElementById('pomodoro-start');
    if (startBtn) startBtn.textContent = 'Start';
    
    remainingTime = getInterval(currentMode) * 60;
    
    if (updateUI) {
        updateDisplay();
    }
}

function completeTimer() {
    pauseTimer();
    const startBtn = document.getElementById('pomodoro-start');
    if (startBtn) startBtn.textContent = 'Start';

    // Log the completed session
    const duration = getInterval(currentMode); // in minutes
    if (currentMode === 'work') {
        logPomodoroSession('work', duration);
    } else {
        logPomodoroSession(currentMode, duration);
    }

    // Play sound or notify
    sendNotification();
    
    // Auto-reset or switch mode logic could go here
}

function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const displayTime = `${pad(minutes)}:${pad(seconds)}`;
    
    const timerEl = document.querySelector('.pomodoro-timer');
    if (timerEl) {
        timerEl.textContent = displayTime;
    }
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function sendNotification() {
    if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
            body: `${modes[currentMode]} session completed!`,
            icon: 'icons/ATab-128x128.png'
        });
    } else {
        alert(`${modes[currentMode]} session completed!`);
    }
}
