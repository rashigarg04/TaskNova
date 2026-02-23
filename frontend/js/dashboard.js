const addTaskBtn = document.getElementById("addTaskBtn");
const taskTableBody = document.getElementById("taskTableBody");

let tasks = [];

addTaskBtn.addEventListener("click", () => {
    const title = document.getElementById("taskTitle").value;
    const date = document.getElementById("taskDate").value;
    const priority = document.getElementById("taskPriority").value;

    if (!title || !date) return alert("Please fill all fields");

    const task = { title, date, priority, completed: false };
    tasks.push(task);
    renderTasks();
});

function renderTasks() {
    taskTableBody.innerHTML = "";

    tasks.forEach((task, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="checkbox" onchange="toggleTask(${index})"> ${task.title}</td>
            <td>${task.date}</td>
            <td><span class="badge ${task.priority.toLowerCase()}">${task.priority}</span></td>
            <td>${task.completed ? "✔ Completed" : "Pending"}</td>
        `;

        taskTableBody.appendChild(row);
    });

    updateStats();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const productivity = total ? Math.round((completed/total)*100) : 0;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed + " ✔";
    document.getElementById("pendingTasks").innerText = pending + " 🕒";
    document.getElementById("productivity").innerText = productivity + "%";
}