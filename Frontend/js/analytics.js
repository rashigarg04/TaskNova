import { NotificationService } from './notifications.js';
const API_BASE = "http://127.0.0.1:8000/api/tasks/";

document.addEventListener("DOMContentLoaded", async () => {
    await NotificationService.initDropdown();
    const response = await fetch(API_BASE);
    const tasks = await response.json();

    renderStatusChart(tasks);
    renderPriorityChart(tasks);
});

function renderStatusChart(tasks) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.length - completed;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ['#10b981', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: '#94a3b8' } }
            }
        }
    });
}

function renderPriorityChart(tasks) {
    const ctx = document.getElementById('priorityChart').getContext('2d');
    const priorities = { 'High': 0, 'Medium': 0, 'Low': 0 };
    
    tasks.forEach(t => {
        if (priorities[t.priority] !== undefined) priorities[t.priority]++;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(priorities),
            datasets: [{
                label: 'Tasks',
                data: Object.values(priorities),
                backgroundColor: ['#f43f5e', '#f59e0b', '#10b981'],
                borderRadius: 8
            }]
        },
        options: {
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}