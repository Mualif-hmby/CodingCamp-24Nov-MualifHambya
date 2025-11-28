let todos = [];

const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const formError = document.getElementById("form-error");
const listEl = document.getElementById("todo-list");
const emptyEl = document.getElementById("empty-state");
const clearBtn = document.getElementById("clear-btn");
const filterBtn = document.getElementById("filter-btn");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const dateFilter = document.getElementById("date-filter");

const filters = {
  term: "",
  status: "all",
  date: "",
};

const today = new Date();
today.setHours(0, 0, 0, 0);
const todayIso = today.toISOString().split("T")[0];
dateInput.min = todayIso;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  const date = dateInput.value;
  const error = validateInput(text, date);

  if (error) {
    setError(error);
    return;
  }

  setError("");
  todos.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    text,
    date,
    status: "pending",
  });

  form.reset();
  dateInput.min = todayIso;
  render();
});

clearBtn.addEventListener("click", () => {
  if (!todos.length) return;
  todos = [];
  render();
});

filterBtn.addEventListener("click", () => {
  clearFilters();
  render();
});

searchInput.addEventListener("input", (event) => {
  filters.term = event.target.value.toLowerCase();
  render();
});

statusFilter.addEventListener("change", (event) => {
  filters.status = event.target.value;
  render();
});

dateFilter.addEventListener("change", (event) => {
  filters.date = event.target.value;
  render();
});

listEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;

  if (action === "delete") {
    deleteTodo(id);
  } else if (action === "toggle") {
    toggleStatus(id);
  }
});

function validateInput(text, date) {
  if (!text) return "Todo cannot be empty.";
  if (!date) return "Due date is required.";

  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  if (dueDate < today) return "Due date cannot be in the past.";

  return "";
}

function setError(message) {
  formError.textContent = message;
}

function getFilteredTodos() {
  return todos.filter((todo) => {
    const matchesTerm = filters.term
      ? todo.text.toLowerCase().includes(filters.term)
      : true;
    const matchesStatus =
      filters.status === "all" ? true : todo.status === filters.status;
    const matchesDate = filters.date ? todo.date === filters.date : true;
    return matchesTerm && matchesStatus && matchesDate;
  });
}

function toggleStatus(id) {
  todos = todos.map((todo) =>
    todo.id === id
      ? { ...todo, status: todo.status === "done" ? "pending" : "done" }
      : todo
  );
  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  render();
}

function clearFilters() {
  filters.term = "";
  filters.status = "all";
  filters.date = "";
  searchInput.value = "";
  statusFilter.value = "all";
  dateFilter.value = "";
}

function formatDate(dateString) {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formatter.format(date);
}

function render() {
  listEl.innerHTML = "";
  const visibleTodos = getFilteredTodos();

  if (!visibleTodos.length) {
    emptyEl.style.display = "block";
    emptyEl.textContent = todos.length
      ? "No todos match the current filters."
      : "No todos available.";
    return;
  }

  emptyEl.style.display = "none";

  visibleTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = todo.id;

    const main = document.createElement("div");
    main.className = "todo-main";

    const title = document.createElement("p");
    title.className = "todo-title";
    title.textContent = todo.text;

    main.appendChild(title);

    const dateCol = document.createElement("div");
    dateCol.className = "todo-date";
    dateCol.textContent = formatDate(todo.date);

    const statusCol = document.createElement("span");
    statusCol.className = `status-badge ${todo.status}`;
    statusCol.textContent = todo.status === "done" ? "Completed" : "Active";

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "chip";
    toggleBtn.dataset.action = "toggle";
    toggleBtn.dataset.id = todo.id;
    toggleBtn.textContent = todo.status === "done" ? "Mark Active" : "Mark Done";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "chip danger";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = todo.id;
    deleteBtn.textContent = "Delete";

    actions.append(toggleBtn, deleteBtn);
    li.append(main, dateCol, statusCol, actions);
    listEl.appendChild(li);
  });
}

render();
