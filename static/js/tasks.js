// Task management and timing functionality
let startTime = null;
let timerInterval = null;
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateHistory();
    updateAnalysis();

    // Task form submission
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', startNewTask);
    }

    // Complete task button
    const completeTaskBtn = document.getElementById('completeTask');
    if (completeTaskBtn) {
        completeTaskBtn.addEventListener('click', completeTask);
    }
});

function startNewTask(e) {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    
    document.getElementById('currentTaskName').textContent = taskName;
    document.getElementById('activeTask').classList.remove('d-none');
    document.getElementById('taskForm').classList.add('d-none');
    
    startTime = new Date();
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = now - startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        document.getElementById('timer').textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function completeTask() {
    clearInterval(timerInterval);
    const endTime = new Date();
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const duration = endTime - startTime;

    const task = {
        name: taskName,
        description: taskDescription,
        date: endTime.toISOString(),
        duration: duration,
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Reset the form
    document.getElementById('taskForm').reset();
    document.getElementById('activeTask').classList.add('d-none');
    document.getElementById('taskForm').classList.remove('d-none');
    
    updateHistory();
    updateAnalysis();
}

function updateHistory() {
    const historyTableBody = document.getElementById('historyTableBody');
    if (!historyTableBody) return;

    historyTableBody.innerHTML = '';
    tasks.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>${new Date(task.date).toLocaleDateString('ru-RU')}</td>
            <td>${formatDuration(task.duration)}</td>
        `;
        historyTableBody.appendChild(row);
    });
}

function updateAnalysis() {
    const analysisTableBody = document.getElementById('analysisTableBody');
    if (!analysisTableBody) return;

    const taskAnalysis = {};
    tasks.forEach(task => {
        if (!taskAnalysis[task.name]) {
            taskAnalysis[task.name] = {
                durations: [],
                dates: []
            };
        }
        taskAnalysis[task.name].durations.push(task.duration);
        taskAnalysis[task.name].dates.push(new Date(task.date));
    });

    analysisTableBody.innerHTML = '';
    Object.entries(taskAnalysis).forEach(([name, data]) => {
        const avgTime = data.durations.reduce((a, b) => a + b, 0) / data.durations.length;
        const improvement = calculateImprovement(data.durations, data.dates);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${formatDuration(avgTime)}</td>
            <td>${improvement}</td>
        `;
        analysisTableBody.appendChild(row);
    });
}

function formatDuration(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function calculateImprovement(durations, dates) {
    if (durations.length < 2) return "Недостаточно данных";
    
    const first = durations[0];
    const last = durations[durations.length - 1];
    const improvement = ((first - last) / first * 100).toFixed(1);
    
    return improvement > 0 ? 
        `Улучшение на ${improvement}%` : 
        `Замедление на ${Math.abs(improvement)}%`;
}
