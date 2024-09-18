// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Retrieve element IDs from the DOM
let taskTitle = document.getElementById('taskTitle');
let taskDueDate = document.getElementById('taskDueDate');
let taskDescription = document.getElementById('taskDescription');
let saveChanges = document.getElementById('save-changes');

// Generate a unique task ID
function generateTaskId() {
    nextId += 1; // Increment ID
    localStorage.setItem('nextId', nextId); // Save to localStorage
    return nextId;
}

// Create a task card
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'taskCard';
    card.draggable = true;

    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Date: ${task.dueDate}</h6>
            <p class="card-text">Description: ${task.description}</p>
            <button class="delete-button">Delete</button>
        </div>
    `;

    const deleteButton = card.querySelector('.delete-button');
    deleteButton.addEventListener('click', handleDeleteTask);

    document.getElementById('todo-cards').appendChild(card);
}

// Render task list and make cards draggable
function renderTaskList() {
    taskList.forEach(createTaskCard);

    // Initialize draggable and sortable behavior
    $('.taskCard').draggable({
        connectToSortable: ".lane",
        zIndex: 100,
        revert: "invalid"
    });

    $('.lane').sortable({
        
    });
}

// Handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const task = {
        id: generateTaskId(),
        title: taskTitle.value,
        dueDate: taskDueDate.value,
        description: taskDescription.value
    };

    if (!task.title || !task.dueDate || !task.description) {
        console.log("Please fill in all fields.");
        return;
    }

    taskList.push(task);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    createTaskCard(task);
    console.log("Task added successfully!");
}

// Handle deleting a task
function handleDeleteTask(event) {
    const deleteButton = event.target;
    const taskCard = deleteButton.closest('.taskCard');
    const taskTitle = taskCard.querySelector('.card-title').textContent;

    const taskIndex = taskList.findIndex(task => task.title === taskTitle);

    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        taskCard.remove();
        console.log("Task deleted successfully!");
    } else {
        console.log("Error! Could not delete task.");
    }
}

// Handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // Logic to update task status based on the new lane
}

// On page load, render tasks, add event listeners, and initialize date picker
$(document).ready(function () {
    try {
        renderTaskList();
        $('.lane').sortable({
            connectWith: '.lane',
        })
        // make lanes droppable for the cards
        $('.lane').droppable({
            accept: '.taskCard',
            drop: handleDrop,
        });
        saveChanges.addEventListener('click', handleAddTask);
        $('#taskDueDate').datepicker(); // Initialize date picker
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
});


// if you're wondering what this is, it's a failed attempt at creating the project. Please disregard this.