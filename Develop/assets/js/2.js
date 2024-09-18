// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || [];

//Global Variables
let valueDate = document.getElementById('inputTaskDueDate');
let valueTask = document.getElementById('inputTaskTitle');
let valueDescription = document.getElementById('inputTaskDescription');
const saveChanges = document.getElementById('save-changes');


//Rework this to instead feature a visual rep to show if either past due or otherwise...
// Todo: create a function to generate a unique task id
function generateTaskId(index) {
    const timestamp = dayjs().millisecond();
    
    const randomNum = Math.floor(Math.random()*1000);

    const taskId = `${timestamp}-${randomNum}`

    return taskId;
}

// Todo: create a function to create a task existingCard
function createTaskCard(task) {

const taskCard = document.createElement('div');
    taskCard.className = 'card';
    $(".card").draggable();
    taskCard.innerHTML = `
    <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Date: ${task.date}</h6>
            <p class="card-text">Description: ${task.description}</p>
            <button class="deleteBttn">Delete</button>
        </div>
    `;
    const deleteButton = taskCard.querySelector('.deleteBttn');
    deleteButton.addEventListener('click', function(event) {
        try {
            handleDeleteTask(event);
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    });

    // console.log(`${task.title}, ${task.date}, ${task.description}`)
    document.getElementById('todo-cards').appendChild(taskCard);
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    taskList.forEach(createTaskCard);
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    
    const objectCard = {
        date: valueDate.value,
        title: valueTask.value,
        description: valueDescription.value
    };

    if(valueDate.value === ''){
        console.log("Please fill in the date.")
    } else if(valueTask.value === ''){
        console.log("Please fill in the title.")
    } else if(valueDescription.value === ''){
        console.log("Please fill in the description.")
    } else {
        taskList.push(objectCard);

        localStorage.setItem('tasks', JSON.stringify(taskList));

        console.log("Succesfully added to localStorage!")

        if(taskList.push(objectCard)){
            const newTaskIndex = taskList.length;
            generateTaskId(newTaskIndex);
            nextId.push(newTaskIndex);
            localStorage.setItem('nextId', JSON.stringify(nextId));
            console.log('Generated task Id succesfully.')
        } else{
            console.log("Error! Cannot not gerateTaskId!")
        }
    };
}

    

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();

    const deleteButton = event.target;
    const taskCard = deleteButton.closest('.card');
    const taskTitle = taskCard.querySelector('.card-title').textContent; 

    const taskIndex = taskList.findIndex(task => task.title === taskTitle);

    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        console.log("Task deleted!");
        return location.reload();
    } else {
        console.log("Error! Could not delete task.");
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
try{
    renderTaskList();
    handleDrop();
} catch(error){
    console.error('An error occured:', error.message);
}
});

saveChanges.addEventListener('click', function(event){
    try{
        handleAddTask(event);
        return location.reload();
    } catch(error){
        console.error('An error occured:', error.message);
    }
});   


// if you're wondering what this is, it's a failed attempt at creating the project. Please disregard this.
