const API_URL = "https://todo2-hred.onrender.com/api/tasks";

async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

async function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  if (!title) return alert("Title is required");

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  });

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  fetchTasks();
}

async function toggleTask(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed })
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

async function editTask(id, oldTitle, oldDescription) {
  const newTitle = prompt("Edit Title:", oldTitle);
  const newDesc = prompt("Edit Description:", oldDescription);
  if (!newTitle) return;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle, description: newDesc })
  });
  fetchTasks();
}

function renderTasks(tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span>${task.title} - ${task.description || ""}</span>
      <div class="actions">
        <button class="toggle" onclick="toggleTask('${task._id}', ${task.completed})">
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button class="edit" onclick="editTask('${task._id}', '${task.title}', '${task.description || ""}')">Edit</button>
        <button class="delete" onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

fetchTasks();
