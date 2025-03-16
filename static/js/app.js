// Класс для управления задачами
class TaskManager {
    constructor() {
        this.activeTask = null;
        this.startTime = null;
        this.timerInterval = null;
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        // Привязка элементов DOM
        this.taskForm = document.getElementById('taskForm');
        this.taskNameInput = document.getElementById('taskName');
        this.taskDescriptionInput = document.getElementById('taskDescription');
        this.activeTaskDiv = document.getElementById('activeTask');
        this.currentTaskNameSpan = document.getElementById('currentTaskName');
        this.timerSpan = document.getElementById('timer');
        this.completeTaskBtn = document.getElementById('completeTask');
        
        // Привязка обработчиков событий
        this.taskForm.addEventListener('submit', this.startTask.bind(this));
        this.completeTaskBtn.addEventListener('click', this.completeTask.bind(this));
    }

    // Запуск новой задачи
    startTask(event) {
        event.preventDefault();
        
        if (this.activeTask) {
            alert('У вас уже есть активная задача!');
            return;
        }

        this.activeTask = {
            name: this.taskNameInput.value,
            description: this.taskDescriptionInput.value,
            startTime: new Date().toISOString(),
            duration: 0
        };

        this.startTime = new Date();
        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);

        this.currentTaskNameSpan.textContent = this.activeTask.name;
        this.activeTaskDiv.classList.remove('d-none');
        this.taskForm.reset();
    }

    // Обновление таймера
    updateTimer() {
        const now = new Date();
        const diff = now - this.startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        this.timerSpan.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Завершение задачи
    completeTask() {
        if (!this.activeTask) return;

        clearInterval(this.timerInterval);
        
        this.activeTask.endTime = new Date().toISOString();
        this.activeTask.duration = new Date() - this.startTime;
        
        this.tasks.push(this.activeTask);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));

        this.activeTask = null;
        this.startTime = null;
        this.activeTaskDiv.classList.add('d-none');
        this.timerSpan.textContent = '00:00:00';
    }
}

// Инициализация менеджера задач при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});
