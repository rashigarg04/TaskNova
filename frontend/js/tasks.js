document.addEventListener("DOMContentLoaded", function () {

  const titleInput = document.getElementById("taskTitle");
  const dateInput = document.getElementById("taskDate");
  const priorityInput = document.getElementById("taskPriority");
  const addBtn = document.getElementById("addTaskBtn");
  const tableBody = document.getElementById("taskTableBody");

  let tasks = JSON.parse(localStorage.getItem("tasknovaTasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasknovaTasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    tableBody.innerHTML = "";

    tasks.forEach((task, index) => {

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
          <button onclick="completeTask(${index})" class="action-btn">✔</button>
          <button onclick="deleteTask(${index})" class="action-btn delete">✖</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    saveTasks();
  }

  addBtn.addEventListener("click", function () {

    const title = titleInput.value.trim();
    const date = dateInput.value;
    const priority = priorityInput.value;

    if (title === "" || date === "") {
      alert("Please fill all fields");
      return;
    }

    tasks.push({
      title,
      date,
      priority,
      status: "Pending"
    });

    titleInput.value = "";
    dateInput.value = "";

    renderTasks();
  });

  window.deleteTask = function (index) {
    tasks.splice(index, 1);
    renderTasks();
  };

  window.completeTask = function (index) {
    tasks[index].status = "Completed";
    renderTasks();
  };

  renderTasks();

});