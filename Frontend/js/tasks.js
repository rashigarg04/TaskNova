import { NotificationService } from './notifications.js';

const API_BASE = "http://127.0.0.1:8000/api/tasks/";
const tableBody = document.getElementById("taskTableBody");
const titleInput = document.getElementById("taskTitle");
const dateInput = document.getElementById("taskDate");
const priorityInput = document.getElementById("taskPriority");
const addBtn = document.getElementById("addTaskBtn");

let tasks = [];

document.addEventListener("DOMContentLoaded", async () => {
    await NotificationService.requestPermission();
    await NotificationService.initDropdown();
    await loadTasks();

    // Search and Filter Listeners
    document.getElementById("taskSearch").addEventListener("input", renderTasks);
    document.getElementById("filterPriority").addEventListener("change", renderTasks);
    document.getElementById("filterStatus").addEventListener("change", renderTasks);
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
    if (!tableBody) return;
    
    const searchTerm = document.getElementById("taskSearch").value.toLowerCase();
    const priorityFilter = document.getElementById("filterPriority").value.toLowerCase();
    const statusFilter = document.getElementById("filterStatus").value;

    tableBody.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm);
        const matchesPriority = priorityFilter === "all" || task.priority.toLowerCase() === priorityFilter;
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        return matchesSearch && matchesPriority && matchesStatus;
    });

    filteredTasks.forEach((task) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.date}</td>
            <td>
              <span class="badge ${task.status === "Completed" ? "completed" : "pending"}">
                ${task.status}
              </span>
            </td>
            <td>
              <span class="badge ${task.priority.toLowerCase()}">
                ${task.priority}
              </span>
            </td>
            <td>
              <button onclick="aiBreakdown(${task.id}, '${task.title}')" class="action-btn ai-btn" title="AI Breakdown">✨</button>
            </td>
            <td>
              <button onclick="completeTask(${task.id})" class="action-btn">✔</button>
              <button onclick="deleteTask(${task.id})" class="action-btn delete">✖</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

addBtn.addEventListener("click", async function () {
    const title = titleInput.value.trim();
    const date = dateInput.value;
    const priority = priorityInput.value;

    if (title === "" || date === "") {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                date,
                priority,
                status: "Pending"
            })
        });

        if (response.ok) {
            titleInput.value = "";
            dateInput.value = "";
            await loadTasks();
            NotificationService.send("New Task Added", { body: `Don't forget to ${title}!` });
        } else {
            const errorData = await response.json();
            console.error("Server error:", errorData);
            alert("Failed to add task: " + (errorData.detail || "Unknown error"));
        }
    } catch (error) {
        console.error("Failed to add task:", error);
        alert("Failed to add task. Make sure the backend server is running.");
    }
});

window.deleteTask = async function (id) {
    if (!confirm("Are you sure?")) return;
    try {
        await fetch(`${API_BASE}${id}/`, { method: 'DELETE' });
        await loadTasks();
    } catch (error) {
        console.error("Failed to delete task:", error);
    }
};

window.completeTask = async function (id) {
    try {
        const response = await fetch(`${API_BASE}${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "Completed" })
        });

        if (response.ok) {
            await loadTasks();
            NotificationService.send("Task Accomplished!", { body: "Great job on finishing that task!" });
        }
    } catch (error) {
        console.error("Failed to complete task:", error);
    }
};

window.aiBreakdown = async function (id, title) {
    const btn = event.currentTarget;
    btn.innerText = "⏳";
    btn.disabled = true;

    // Simulate AI thinking
    setTimeout(async () => {
        const subtasks = [
            `Subtask 1: Initial research for ${title}`,
            `Subtask 2: Draft plan for ${title}`,
            `Subtask 3: Final execution of ${title}`
        ];

        try {
            for (const st of subtasks) {
                await fetch(API_BASE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: st,
                        date: new Date().toISOString().split('T')[0],
                        priority: "Medium",
                        status: "Pending"
                    })
                });
            }

            btn.innerText = "✨";
            btn.disabled = false;
            await loadTasks();
            NotificationService.send("AI Breakdown Complete", { body: `Generated 3 subtasks for: ${title}` });
        } catch (error) {
            console.error("AI Breakdown failed:", error);
            btn.innerText = "❌";
            btn.disabled = false;
        }
    }, 1500);
};