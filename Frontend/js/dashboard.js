import { NotificationService } from './notifications.js';

const API_BASE = "http://127.0.0.1:8000/api/tasks/";
const taskTableBody = document.getElementById("taskTableBody");

let tasks = [];

document.addEventListener("DOMContentLoaded", async () => {
    // Request notification permission
    await NotificationService.requestPermission();
    await NotificationService.initDropdown();
    
    // Load tasks from Django backend
    await loadTasks();
    
    // Load notification count
    updateNotificationCount();

    // Listeners
    document.getElementById("taskSearch").addEventListener("input", renderTasks);
    document.getElementById("filterPriority").addEventListener("change", renderTasks);
});

async function loadTasks() {
    try {
        const response = await fetch(API_BASE);
        tasks = await response.json();
        renderTasks();
        NotificationService.checkDeadlines(tasks);
    } catch (error) {
        console.error("Failed to load tasks:", error);
    }
}

function renderTasks() {
    if (!taskTableBody) return;

    const searchTerm = document.getElementById("taskSearch").value.toLowerCase();
    const priorityFilter = document.getElementById("filterPriority").value.toLowerCase();

    taskTableBody.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm);
        const matchesPriority = priorityFilter === "all" || task.priority.toLowerCase() === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    filteredTasks.forEach((task) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="checkbox" ${task.status === 'Completed' ? 'checked' : ''} onchange="toggleTask(${task.id})"> ${task.title}</td>
            <td>${task.date}</td>
            <td><span class="badge ${task.priority.toLowerCase()}">${task.priority}</span></td>
            <td>${task.status}</td>
        `;

        taskTableBody.appendChild(row);
    });

    updateStats();
}

// Exposed to window for inline onchange
window.toggleTask = async function(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    
    try {
        const response = await fetch(`${API_BASE}${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            task.status = newStatus;
            if (newStatus === 'Completed') {
                NotificationService.send("Task Completed!", { body: `You finished: ${task.title}` });
            }
            renderTasks();
        }
    } catch (error) {
        console.error("Failed to update task:", error);
    }
};

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const productivity = total ? Math.round((completed/total)*100) : 0;

    const totalEl = document.getElementById("totalTasks");
    const completedEl = document.getElementById("completedTasks");
    const pendingEl = document.getElementById("pendingTasks");
    const productivityEl = document.getElementById("productivity");

    if (totalEl) totalEl.innerText = total;
    if (completedEl) completedEl.innerText = completed;
    if (pendingEl) pendingEl.innerText = pending;
    if (productivityEl) productivityEl.innerText = productivity + "%";
}

async function updateNotificationCount() {
    const notifications = await NotificationService.getNotifications();
    const countEl = document.getElementById("notificationCount");
    if (countEl) {
        const unread = notifications.filter(n => !n.is_read).length;
        countEl.innerText = unread;
        countEl.style.display = unread > 0 ? 'inline-block' : 'none';
    }
}