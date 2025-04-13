// Массив с примерами данных о событиях
const events = [
    {
        id: 1,
        name: "Концерт группы 'Imagine Dragons'",
        genre: "music",
        date: "2025-05-15",
        place: "Москва",
        details: "Энергичный концерт с лучшими хитами группы.",
        availableTickets: 100,
    },
    {
        id: 2,
        name: "Театр 'Щелкунчик'",
        genre: "theater",
        date: "2025-05-20",
        place: "Санкт-Петербург",
        details: "Классическая постановка на сцене главного театра города.",
        availableTickets: 50,
    },
    {
        id: 3,
        name: "Комедийное шоу 'Смех без границ'",
        genre: "comedy",
        date: "2025-05-25",
        place: "Екатеринбург",
        details: "Лучшие комики страны соберутся на одной сцене.",
        availableTickets: 200,
    },
];

// Рендерим календарь с событиями
function renderCalendar() {
    const calendar = document.getElementById("calendar");
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const filteredEvents = filterEvents();

    const eventsByDate = {};
    filteredEvents.forEach(event => {
        const eventDate = event.date;
        if (!eventsByDate[eventDate]) eventsByDate[eventDate] = [];
        eventsByDate[eventDate].push(event);
    });

    calendar.innerHTML = "";

    // Рендерим все дни месяца
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

        if (eventsByDate[dateStr]) {
            cell.style.backgroundColor = "#4caf50";
            cell.style.color = "white";
            cell.title = "Есть события";
        }

        // Обработчик клика по дню
        cell.addEventListener("click", () => {
            showEventsForDate(eventsByDate[dateStr] || []);
        });

        calendar.appendChild(cell);
    }
}

// Фильтрация событий по выбранным параметрам
function filterEvents() {
    const dateFilter = document.getElementById("date-filter") ? document.getElementById("date-filter").value : "";
    const genreFilter = document.getElementById("genre-filter") ? document.getElementById("genre-filter").value : "all";
    const placeFilter = document.getElementById("place-filter") ? document.getElementById("place-filter").value.toLowerCase() : "";

    return events.filter(event => {
        const matchesDate = dateFilter ? event.date === dateFilter : true;
        const matchesGenre = genreFilter !== "all" ? event.genre === genreFilter : true;
        const matchesPlace = placeFilter ? event.place.toLowerCase().includes(placeFilter) : true;

        return matchesDate && matchesGenre && matchesPlace;
    });
}

// Показ всех событий на главной странице
function showEventsForDate(events) {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = "";

    if (events.length === 0) {
        mainContent.innerHTML = "<p>Нет событий для этой даты.</p>";
        return;
    }

    events.forEach(event => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
            <h3>${event.name}</h3>
            <p>${event.details}</p>
            <button class="select-ticket" onclick="navigateToEvent(${event.id})">Подробнее</button>
        `;
        mainContent.appendChild(eventCard);
    });
}

// Переход на страницу события
function navigateToEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) {
        alert("Событие не найдено!");
        return;
    }

    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
        <h2>${event.name}</h2>
        <p>${event.details}</p>
        <p><strong>Место проведения:</strong> ${event.place}</p>
        <p><strong>Дата:</strong> ${event.date}</p>
        <button class="select-ticket" onclick="navigateToOrder(${event.id})">Оформить заказ</button>
    `;
}

// Переход на страницу оформления заказа
function navigateToOrder(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) {
        alert("Событие не найдено!");
        return;
    }

    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
        <h2>Оформление заказа для ${event.name}</h2>
        <div id="order-form">
            <label for="ticket-quantity">Количество билетов:</label>
            <input type="number" id="ticket-quantity" min="1" max="${event.availableTickets}" value="1" />
            <label for="customer-name">Ваше имя:</label>
            <input type="text" id="customer-name" />
            <label for="customer-email">Электронная почта:</label>
            <input type="email" id="customer-email" />
            <button class="proceed-to-payment" onclick="processOrder(${event.id})">Перейти к оплате</button>
        </div>
    `;
}

// Обработка оформления заказа
function processOrder(eventId) {
    const event = events.find(e => e.id === eventId);
    const quantity = document.getElementById("ticket-quantity").value;
    const customerName = document.getElementById("customer-name").value;
    const customerEmail = document.getElementById("customer-email").value;

    if (quantity <= 0 || quantity > event.availableTickets || !customerName || !customerEmail) {
        alert("Пожалуйста, заполните все поля корректно.");
        return;
    }

    alert(`Ваш заказ на ${quantity} билет(ов) на событие "${event.name}" оформлен. Мы свяжемся с вами по почте: ${customerEmail}.`);
}

// Функция рендеринга главной страницы
function renderHome() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = "<h1>Добро пожаловать в систему заказов!</h1>";

    // Инициализация фильтров
    const template = document.getElementById("home-template").content.cloneNode(true);
    mainContent.appendChild(template);

    renderCalendar(); // Отображение календаря с событиями
    document.getElementById("date-filter").addEventListener("input", renderCalendar);
    document.getElementById("genre-filter").addEventListener("change", renderCalendar);
    document.getElementById("place-filter").addEventListener("input", renderCalendar);

    // Добавление обработчика для кнопки "Найти событие"
    document.getElementById("find-event-button").addEventListener("click", () => {
        const dateFilter = document.getElementById("date-filter").value;
        const filteredEvents = events.filter(event => event.date === dateFilter);
        showEventsForDate(filteredEvents);
    });
}

// Инициализация главной страницы (вызываем renderHome при загрузке)
document.addEventListener("DOMContentLoaded", renderHome);
