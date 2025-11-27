/// Temprorary storage for todo items
let todos = [];

function validateForm() {
  /// Get input values
  const todo = document.getElementById("todo-input").value;
  const date = document.getElementById("todo-date").value;

  // Validate input todo and date
  if (todo === "" || date === "") {
    alert("Please fill in both the todo item and the due date.");
  } else {
    addTodo(todo, date);

    // Clear input fields after adding todo
    document.getElementById("todo-input").value = "";
    document.getElementById("todo-date").value = "";
  }
}

/// Function to add a new todo item
function addTodo(todo, date) {
  /// Create a new todo item object
  const todoItem = {
    task: todo,
    date: date,
  };

  /// Add the new todo item to the todos array
  todos.push(todoItem);
  renderTodos();
}

/// Function to render todo items to the DOM
function renderTodos() {
  const todoList = document.getElementById("todo-list");

  // Clear existing list
  todoList.innerHTML = "";

  // Render each todo item
  todos.forEach((todo, _) => {
    todoList.innerHTML += `
        <li>
            <p class="text-2xl">${todo.task} <span class="text-sm text-gray-500">(${todo.date})</span></p>
            <hr />
        </li>`;
  });
}

/// Function to clear all todo items
function clearTodos() {
  todos = [];
  renderTodos();
}

/// Function to filter todo items by date
function filter() {}
