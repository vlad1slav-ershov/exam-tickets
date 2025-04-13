const tasks = [];

function displayTasks() {
    const tasksList = document.getElementById('tasks');
    tasksList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskHTML = `
         <li class="task">
    <span class="task-name">${task.name}</span>
    <span class="task-category ${task.category}">${task.category}</span>
    <span class="task-deadline">${task.deadline}</span>
    <button class="edit-task-btn" data-index="${index}">Редактировать</button>
    <button class="delete-task-btn" data-index="${index}">Удалить</button>
</li>
        `;
        tasksList.insertAdjacentHTML('beforeend', taskHTML);
    });
}

function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskCategory = document.getElementById('task-category').value;
    const taskDeadline = document.getElementById('task-deadline').value;
    const newTask = {
        name: taskName,
        category: taskCategory,
        deadline: taskDeadline,
        completed: false
    };
    tasks.push(newTask);
    displayTasks();
    document.getElementById('create-task-form').reset();
}

function editTask(index) {
    const task = tasks[index];
    document.getElementById('task-name-edit').value = task.name;
    document.getElementById('task-category-edit').value = task.category;
    document.getElementById('task-deadline-edit').value = task.deadline;
    document.getElementById('edit-task-form').dataset.index = index;
}

function completeTask(index) {
    const task = tasks[index];
    task.completed = true;
    displayTasks();
}

function saveTaskChanges() {
    const index = document.getElementById('edit-task-form').dataset.index;
    const task = tasks[index];
    task.name = document.getElementById('task-name-edit').value;
    task.category = document.getElementById('task-category-edit').value;
    task.deadline = document.getElementById('task-deadline-edit').value;
    displayTasks();
    document.getElementById('edit-task-form').reset();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();
}

document.getElementById('add-task-btn').addEventListener('click', () => {
    document.getElementById('create-task-form').style.display = 'block';
});

document.getElementById('create-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
});

document.getElementById('tasks').addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-task-btn')) {
        const index = e.target.dataset.index;
        editTask(index);
        document.getElementById('edit-task-form').style.display = 'block';
    } else if (e.target.classList.contains('delete-task-btn')) {
        const index = e.target.dataset.index;
        deleteTask(index);
    } else if (e.target.classList.contains('complete-task-btn')) {
        const index = e.target.dataset.index;
        completeTask(index);
    }
});

document.getElementById('edit-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveTaskChanges();
});

document.getElementById('filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('all-tasks-btn')) {
        displayTasks();
    } else if (e.target.classList.contains('completed-tasks-btn')) {
        const completedTasks = tasks.filter((task) => task.completed);
        displayTasks(completedTasks);
    } else if (e.target.classList.contains('uncompleted-tasks-btn')) {
        const uncompletedTasks = tasks.filter((task) => !task.completed);
        displayTasks(uncompletedTasks);
    }
});

displayTasks();