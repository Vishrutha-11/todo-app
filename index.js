const addBtn = document.getElementById("add-btn-id")
const todoInput = document.getElementById("todo-input")
const todoList = document.getElementById("todo-list")
const markAllCompletedBtn = document.getElementById("mark-all-completed-btn")
const clearCompletedBtn = document.getElementById("clear-completed-btn")
const remainingCountSpan = document.getElementById("remaining-count")

// State variables
let currentFilter = "all"
let selectedColors = [] // Added to track selected color filters

console.log("addBtn =====> ", addBtn);
console.log("todoInput ====> ", todoInput);
console.log("todoList ====> ", todoList);

// Common function to handle adding a todo item
function handleAddTodo() {
    const todoInputText = todoInput.value.trim();
    if (todoInputText !== "") {
        console.log("Adding todo: ", todoInputText);
        addTodoItem(todoInputText);
        todoInput.value = "";
    }
}

// Add button click event
addBtn.addEventListener("click", () => {
    console.log("Add button clicked");
    handleAddTodo();
})

// Enter key press event
todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        console.log("Enter key pressed");
        handleAddTodo();
    }
})

function addTodoItem(todoText) {
    const todoItemLi = document.createElement('li');

    const todoItemDiv = document.createElement('div');
    todoItemDiv.className = 'todo-item';

    const todoItemLeftDiv = document.createElement('div');
    todoItemLeftDiv.className = 'todo-item-left';

    const todoCheckbox = document.createElement('input')
    todoCheckbox.className = "todo-checkbox"
    todoCheckbox.type = "checkbox"

    const taskTitleSpan = document.createElement('span');
    taskTitleSpan.className = "task-title"
    taskTitleSpan.textContent = todoText;

    todoCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            taskTitleSpan.style.textDecoration = "line-through"
        } else {
            taskTitleSpan.style.removeProperty("text-decoration")
        }
        updateRemainingCount()
        applyFilters()
    })

    // Create color dropdown
    const colorSelect = document.createElement('select');
    colorSelect.className = 'color-select';

    // Add default "No Color" option
    const defaultOption = document.createElement('option');
    defaultOption.value = 'none';
    defaultOption.textContent = 'No Color';
    colorSelect.appendChild(defaultOption);

    // Add color options
    const colors = [
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue' },
        { value: 'orange', label: 'Orange' },
        { value: 'purple', label: 'Purple' },
        { value: 'red', label: 'Red' }
    ];
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.value;
        option.textContent = color.label;
        colorSelect.appendChild(option);
    });

    // Store selected color on the todo item
    // Note: This logic adds a class to the 'li' (e.g., 'color-green')
    colorSelect.addEventListener('change', (e) => {
        const selectedColor = e.target.value;
        // Remove any existing color class
        todoItemLi.classList.remove('color-green', 'color-blue', 'color-orange', 'color-purple', 'color-red');
        // Add new color class if a color is selected
        if (selectedColor !== 'none') {
            todoItemLi.classList.add(`color-${selectedColor}`);
        }
        applyFilters() // Re-apply filters when color changes
    });

    const todoDeleteBtn = document.createElement('button');
    todoDeleteBtn.className = 'delete-btn';
    todoDeleteBtn.textContent = 'Delete';
    
    todoDeleteBtn.addEventListener("click", () => {
        todoItemLi.remove()
        updateRemainingCount()
        applyFilters() // Updated function call
    })

    todoItemDiv.appendChild(todoItemLeftDiv);

    todoItemLeftDiv.append(todoCheckbox);
    todoItemLeftDiv.append(taskTitleSpan);

    todoItemDiv.appendChild(colorSelect);
    todoItemDiv.appendChild(todoDeleteBtn);
    todoItemLi.appendChild(todoItemDiv)


    todoList.appendChild(todoItemLi);
    updateRemainingCount()
    applyFilters() // Updated function call
}

// Function to update remaining todos count
function updateRemainingCount() {
    const allCheckboxes = document.querySelectorAll('.todo-checkbox')
    let remainingCount = 0

    allCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            remainingCount++
        }
    })

    remainingCountSpan.textContent = remainingCount
}

// Mark all todos as completed
markAllCompletedBtn.addEventListener('click', () => {
    const allCheckboxes = document.querySelectorAll('.todo-checkbox')
    const allTaskTitles = document.querySelectorAll('.task-title')

    allCheckboxes.forEach(checkbox => {
        checkbox.checked = true
    })

    allTaskTitles.forEach(title => {
        title.style.textDecoration = "line-through"
    })

    updateRemainingCount()
    applyFilters() // Updated function call
})

// Clear completed todos
clearCompletedBtn.addEventListener('click', () => {
    const allCheckboxes = document.querySelectorAll('.todo-checkbox')

    allCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const todoItemLi = checkbox.closest('li')
            if (todoItemLi) {
                todoItemLi.remove()
            }
        }
    })

    updateRemainingCount()
    applyFilters() // Updated function call
})

// Combined Filter Function (Handles both Status and Color)
function applyFilters() {
    const allTodos = document.querySelectorAll('#todo-list li')

    allTodos.forEach(todoLi => {
        const checkbox = todoLi.querySelector('.todo-checkbox')
        const isCompleted = checkbox ? checkbox.checked : false

        // 1. Check Status Logic
        let statusMatches = false;
        if (currentFilter === "all") {
            statusMatches = true;
        } else if (currentFilter === "active") {
            statusMatches = !isCompleted;
        } else if (currentFilter === "completed") {
            statusMatches = isCompleted;
        }

        // 2. Check Color Logic
        let colorMatches = false;
        
        // If no colors are selected in the filter, we show everything (match = true)
        if (selectedColors.length === 0) {
            colorMatches = true;
        } else {
            // Check if the current list item has a class that matches ANY of the selected colors
            // Example: if selectedColors=['green', 'red'], we check if li has class 'color-green' OR 'color-red'
            colorMatches = selectedColors.some(color => todoLi.classList.contains(`color-${color}`));
        }

        // 3. Final Display Logic (Must match BOTH status and color)
        if (statusMatches && colorMatches) {
            todoLi.style.display = "block"
        } else {
            todoLi.style.display = "none"
        }
    })
}

// Status filter event listeners
const statusOptions = document.querySelectorAll('.status-option')
statusOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        statusOptions.forEach(opt => opt.classList.remove('selected'))

        // Add selected class to clicked option
        option.classList.add('selected')

        // Update current filter
        currentFilter = option.getAttribute('data-status')

        // Apply the filter
        applyFilters()
    })
})

// Color Filter Event Listeners
const colorFilterCheckboxes = document.querySelectorAll('.filter-color-column input[type="checkbox"]');

colorFilterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        const color = e.target.id.replace('color-', ''); // Converts 'color-green' to 'green'
        
        if (e.target.checked) {
            // Add color to the array if checked
            selectedColors.push(color);
        } else {
            // Remove color from the array if unchecked
            selectedColors = selectedColors.filter(c => c !== color);
        }

        applyFilters();
    });
});

// Initialize remaining count on page load
updateRemainingCount()