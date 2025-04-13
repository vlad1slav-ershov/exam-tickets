// Массив с примерными данными о привычках
const habits = [
    {
        id: 1,
        name: "Утренние пробежки",
        description: "Каждое утро бегаем 30 минут.",
        history: [],
        status: "not started", // Статус: не начата
        progress: 0, // Прогресс от 0 до 100
    },
    {
        id: 2,
        name: "Здоровое питание",
        description: "Соблюдаем режим питания и правильно питаемся.",
        history: [],
        status: "not started",
        progress: 0,
    }
];

// Рендерим главную страницу со списком привычек
function renderHome() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = "<h2>Ваши привычки</h2>";

    const habitListContainer = document.createElement("div");
    habitListContainer.classList.add("habit-list");

    if (habits.length === 0) {
        mainContent.innerHTML += "<p>У вас нет привычек. Добавьте новую привычку!</p>";
    }

    habits.forEach(habit => {
        const habitItem = document.createElement("div");
        habitItem.classList.add("habit-item");

        const habitStatus = getCompletionStatus(habit);
        const habitClass = habitStatus === "Выполнено" ? "completed" : "incomplete";

        habitItem.innerHTML = `
            <div>
                <h3>${habit.name}</h3>
                <p>${habit.description}</p>
                <div class="progress-bar">
                    <span style="width: ${habit.progress}%; background-color: ${habit.progress === 100 ? '#28a745' : '#ccc'}">
                        ${habit.progress}%
                    </span>
                </div>
            </div>
            <div class="${habitClass}">
                <p>${habitStatus}</p>
                <button onclick="navigateToHabit(${habit.id})">Подробнее</button>
            </div>
        `;

        habitListContainer.appendChild(habitItem);
    });

    mainContent.appendChild(habitListContainer);
}

// Получение статуса выполнения привычки
function getCompletionStatus(habit) {
    if (habit.progress === 100) {
        return "Выполнено";
    } else if (habit.status === "not started") {
        return "Не начато";
    }
    return "В процессе";
}

// Переход на страницу подробностей привычки
function navigateToHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
        alert("Привычка не найдена!");
        return;
    }

    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
        <h2>${habit.name}</h2>
        <div class="details">
            <p><strong>Описание:</strong> ${habit.description}</p>
            <h3>История выполнения:</h3>
            <ul>
                ${habit.history.map(entry => `
                    <li>${entry.date}: ${entry.completed ? "Выполнено" : "Не выполнено"}</li>
                `).join('')}
            </ul>
        </div>
        <button onclick="startHabit(${habit.id})">Запустить привычку</button>
        <button onclick="completeHabit(${habit.id})">Выполнить</button>
        <button onclick="cancelHabit(${habit.id})">Отменить выполнение</button>
    `;
}

// Логика для начала привычки
function startHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (habit.status === "not started") {
        habit.status = "in progress";
        alert(`Привычка "${habit.name}" началась!`);
        renderHome();
    }
}

// Логика для выполнения привычки
function completeHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (habit.status === "in progress") {
        habit.status = "completed";
        habit.progress = 100;
        habit.history.push({ date: new Date().toLocaleDateString(), completed: true });
        alert(`Поздравляем с выполнением привычки "${habit.name}"!`);
        renderHome();
    }
}

// Логика для отмены привычки
function cancelHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (habit.status !== "not started") {
        habit.status = "not started";
        habit.progress = 0;
        habit.history.push({ date: new Date().toLocaleDateString(), completed: false });
        alert(`Привычка "${habit.name}" отменена.`);
        renderHome();
    }
}

// Инициализация главной страницы
document.addEventListener("DOMContentLoaded", renderHome);
