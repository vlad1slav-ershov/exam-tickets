document.addEventListener("DOMContentLoaded", () => {
    navigate("home");
});

function navigate(page) {
    const templates = {
        home: document.getElementById("home-template"),
        workout: document.getElementById("workout-template"),
        stats: document.getElementById("stats-template")
    };

    const main = document.getElementById("main-content");
    main.innerHTML = "";

    const clone = templates[page].content.cloneNode(true);
    main.appendChild(clone);

    if (page === "stats") {
        renderChart();
        fillStatsTable();
    }

    if (page === "workout") {
        renderWorkout();
    }

    if (page === "home") {
        renderCalendar();
    }
}

function saveWorkoutProgress(entry) {
    const key = "fitness_progress";
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.push(entry);
    localStorage.setItem(key, JSON.stringify(existing));
}

function getWorkoutProgress() {
    const key = "fitness_progress";
    return JSON.parse(localStorage.getItem(key)) || [];
}

function renderChart() {
    const ctx = document.getElementById("progressChart").getContext("2d");
    const data = getWorkoutProgress();

    const labels = data.map(e => e.date);
    const weights = data.map(e => e.weight);
    const strengths = data.map(e => e.strength);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Вес (кг)",
                    data: weights,
                    borderColor: "#1f3a93",
                    fill: false
                },
                {
                    label: "Сила (ед.)",
                    data: strengths,
                    borderColor: "#4caf50",
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "Прогресс пользователя"
                }
            }
        }
    });
}

function fillStatsTable() {
    const table = document.getElementById("stats-table");
    const data = getWorkoutProgress();
    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.date}</td><td>${row.weight}</td><td>${row.strength}</td>`;
        table.appendChild(tr);
    });
}

function renderWorkout() {
    const exerciseList = document.getElementById("exercise-list");
    const exercises = [
        { name: "Приседания", sets: 3, reps: 15 },
        { name: "Отжимания", sets: 3, reps: 10 },
        { name: "Планка", sets: 3, reps: 60 } // секунды
    ];

    let current = 0;

    function renderCurrentExercise() {
        exerciseList.innerHTML = "";
        if (current < exercises.length) {
            const ex = exercises[current];
            const li = document.createElement("li");
            li.textContent = `${ex.name}: ${ex.sets} подходов по ${ex.reps} повторений`;
            exerciseList.appendChild(li);
        } else {
            exerciseList.innerHTML = "<li>Тренировка завершена!</li>";
        }
    }

    renderCurrentExercise();

    document.querySelector(".start").addEventListener("click", () => {
        alert("Начинаем тренировку!");
        current = 0;
        renderCurrentExercise();
    });

    document.querySelector(".complete").addEventListener("click", () => {
        if (current < exercises.length - 1) {
            current++;
            renderCurrentExercise();
        } else {
            current++;
            renderCurrentExercise();
            const date = new Date().toLocaleDateString("ru-RU");
            const weight = prompt("Введите текущий вес:");
            const strength = prompt("Оцените силу от 0 до 150:");
            if (weight && strength) {
                saveWorkoutProgress({ date, weight: parseFloat(weight), strength: parseInt(strength) });
                alert("Прогресс сохранён!");
            }
        }
    });
}

function renderCalendar() {
    const calendar = document.getElementById("calendar");
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const data = getWorkoutProgress();
    const markedDates = new Set(data.map(e => e.date));

    calendar.innerHTML = ""; // очищаем календарь перед рендером

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        const date = new Date(year, month, day);
        const dateStr = date.toLocaleDateString("ru-RU");

        cell.textContent = day;
        cell.style.padding = "10px";
        cell.style.border = "1px solid #ccc";
        cell.style.textAlign = "center";
        cell.style.width = "40px";
        cell.style.display = "inline-block";
        cell.style.cursor = "pointer";

        if (markedDates.has(dateStr)) {
            cell.style.backgroundColor = "#4caf50";
            cell.style.color = "white";
            cell.title = "Есть тренировка";
        }

        // Добавим обработчик клика для каждого дня
        cell.addEventListener("click", () => {
            // Функция для отображения статистики этого дня
            showStatisticsForDate(dateStr);
        });

        calendar.appendChild(cell);
    }
}

function showStatisticsForDate(dateStr) {
    // Получаем все записи для этого дня
    const data = getWorkoutProgress();
    const dailyData = data.filter(entry => entry.date === dateStr);

    // Отображаем статистику в таблице
    const table = document.getElementById("stats-table");
    table.innerHTML = ""; // очищаем таблицу

    dailyData.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.date}</td><td>${row.weight}</td><td>${row.strength}</td>`;
        table.appendChild(tr);
    });

    // Обновляем график для этого дня
    renderChartForDate(dailyData);
}

function renderChartForDate(data) {
    const ctx = document.getElementById("progressChart").getContext("2d");

    const labels = data.map(e => e.date);
    const weights = data.map(e => e.weight);
    const strengths = data.map(e => e.strength);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Вес (кг)",
                    data: weights,
                    borderColor: "#1f3a93",
                    fill: false
                },
                {
                    label: "Сила (ед.)",
                    data: strengths,
                    borderColor: "#4caf50",
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: `Прогресс за ${data[0]?.date || 'выбранный день'}`
                }
            }
        }
    });


}
