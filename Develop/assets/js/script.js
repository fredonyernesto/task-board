let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

const saveChanges = document.getElementById('save-changes');
const taskTitle = document.getElementById('taskTitle');
const taskDueDate = $("#taskDueDate"); // Datepicker input field
const taskDescription = document.getElementById('taskDescription');

// Initialize Datepicker with a specific format
taskDueDate.datepicker({
    dateFormat: "yy-mm-dd" // Format the date as "YYYY-MM-DD"
});

function generateTaskId() {
    nextId++;
    localStorage.setItem('nextId', JSON.stringify(nextId));
    return nextId;
}

function createTaskCard(task) {
    let taskCard = $('<div>').addClass('task-card mb-3').attr('data-task-id', task.id);
    taskCard.html(`
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Date: ${task.dueDate}</h6>
            <p class="card-text">Description: ${task.description}</p>
            <button class="btn btn-danger btn-sm delete-task">Delete</button>
        </div>
    `);

    if (task.status === "to-do") {
        $('#todo-cards').append(taskCard);
    } else if (task.status === "in-progress") {
        $('#in-progress-cards').append(taskCard);
    } else if (task.status === "done") {
        $('#done-cards').append(taskCard);
    }

    taskCard.draggable({
        zIndex: 100,
    });

    taskCard.find('.delete-task').on('click', function() {
        handleDeleteTask(task.id);
    });
}

function renderTaskList() {
    $('#todo-cards, #in-progress-cards, #done-cards').empty();
    taskList.forEach(createTaskCard);
}

function handleAddTask(event) {
    event.preventDefault();

    // Get the selected date from the Datepicker and format it using Day.js
    const selectedDate = taskDueDate.datepicker('getDate');
    const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '';

    const card = {
        id: generateTaskId(),
        title: taskTitle.value,
        dueDate: formattedDate, 
        description: taskDescription.value, 
        status: "to-do"
    };

    taskList.push(card);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    createTaskCard(card);

    // Clear form fields
    taskTitle.value = '';
    taskDueDate.value = ''; 
    taskDescription.value = '';
}

function handleDeleteTask(taskId) {
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    $(`[data-task-id="${taskId}"]`).remove();
}

function handleDrop(event, ui) {
    const taskId = ui.draggable.data('task-id');
    const newStatus = $(event.target).attr('id');
    
    const taskIndex = taskList.findIndex(task => task.id == taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(taskList));
    }

    renderTaskList();
}

$(document).ready(function () {
    try {
        $('.lane').droppable({
            accept: ".task-card",
            drop: handleDrop
        });
        renderTaskList();
    } catch(error) {
        console.error("Something went wrong:", error);
    }

    saveChanges.addEventListener('click', handleAddTask);
});
