let todos = [];

const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const listEl = document.getElementById("todo-list");
const emptyEl = document.getElementById("empty-state");
const clearBtn = document.getElementById("clear-btn");
const filterBtn = document.getElementById("filter-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  const date = dateInput.value;
  if (!text) return;
  todos.push({ text, date });
  todoInput.value = "";
  dateInput.value = "";
  render();
});

clearBtn.addEventListener("click", () => {
  todos = [];
  render();
});

filterBtn.addEventListener("click", () => {
  if (!todos.length) return;
  const keyword = prompt(
    "Filter todo berisi kata apa? (kosongkan untuk batal)"
  );
  if (keyword === null) return; // batal
  const term = keyword.trim().toLowerCase();
  render(term);
});

function render(filterTerm = "") {
  listEl.innerHTML = "";
  const filtered = filterTerm
    ? todos.filter((t) => t.text.toLowerCase().includes(filterTerm))
    : todos;

  if (!filtered.length) {
    emptyEl.style.display = "block";
    return;
  }

  emptyEl.style.display = "none";
  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const left = document.createElement("div");
    left.textContent = todo.text;

    const right = document.createElement("div");
    right.className = "todo-meta";
    right.textContent = todo.date ? todo.date : "No date";

    li.appendChild(left);
    li.appendChild(right);
    listEl.appendChild(li);
  });
}

render();
