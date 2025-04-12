// Хранилище поездок
let trips = JSON.parse(localStorage.getItem('trips')) || [];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    
    if (path === 'index.html' || path === '') {
        initHomePage();
    } else if (path === 'add-trip.html') {
        initAddTripPage();
    } else if (path === 'trip-details.html') {
        initTripDetailsPage();
    }
});

// Главная страница
function initHomePage() {
    renderTrips();
    
    // Переход на страницу добавления
    document.getElementById('addTripBtn').addEventListener('click', function() {
        window.location.href = 'add-trip.html';
    });
}

// Страница добавления поездки
function initAddTripPage() {
    document.getElementById('addTripForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newTrip = {
            id: Date.now().toString(),
            name: document.getElementById('tripName').value.trim(),
            destination: document.getElementById('destination').value.trim(),
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value || null,
            notes: document.getElementById('notes').value.trim(),
            todos: [],
            route: []
        };
        
        trips.push(newTrip);
        saveTrips();
        window.location.href = 'index.html';
    });
}

// Страница деталей поездки
function initTripDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('id');
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) {
        window.location.href = 'index.html';
        return;
    }
    
    // Заполняем информацию о поездке
    document.getElementById('tripTitle').textContent = trip.name;
    document.getElementById('tripDestination').textContent = trip.destination;
    
    const datesText = trip.endDate 
        ? `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`
        : formatDate(trip.startDate);
    document.getElementById('tripDates').textContent = datesText;
    
    document.getElementById('tripNotes').textContent = trip.notes || 'Нет заметок';
    
    // Кнопка редактирования
    document.getElementById('editTripBtn').addEventListener('click', function() {
        window.location.href = `add-trip.html?edit=${trip.id}`;
    });
    
    // Работа со списком задач
    renderTodos(trip);
    document.getElementById('addTodoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const todoText = document.getElementById('newTodo').value.trim();
        if (todoText) {
            trip.todos.push({
                id: Date.now().toString(),
                text: todoText,
                completed: false
            });
            saveTrips();
            renderTodos(trip);
            document.getElementById('newTodo').value = '';
        }
    });
    
    // Работа с маршрутом
    renderRoute(trip);
    document.getElementById('addRouteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const routePoint = document.getElementById('newRoutePoint').value.trim();
        if (routePoint) {
            trip.route.push({
                id: Date.now().toString(),
                point: routePoint
            });
            saveTrips();
            renderRoute(trip);
            document.getElementById('newRoutePoint').value = '';
        }
    });
}

// Вспомогательные функции
function renderTrips() {
    const tripsList = document.getElementById('tripsList');
    tripsList.innerHTML = '';
    
    if (trips.length === 0) {
        tripsList.innerHTML = '<p class="no-trips">У вас пока нет запланированных поездок</p>';
        return;
    }
    
    trips.forEach(trip => {
        const tripCard = document.createElement('div');
        tripCard.className = 'trip-card';
        tripCard.innerHTML = `
            <div class="actions">
                <button class="btn-danger delete-btn" data-id="${trip.id}">Удалить</button>
            </div>
            <h3>${trip.name}</h3>
            <div class="destination">${trip.destination}</div>
            <div class="dates">${formatDateForCard(trip.startDate, trip.endDate)}</div>
        `;
        
        tripCard.addEventListener('click', function(e) {
            // Игнорируем клики по кнопкам внутри карточки
            if (!e.target.classList.contains('delete-btn')) {
                window.location.href = `trip-details.html?id=${trip.id}`;
            }
        });
        
        tripsList.appendChild(tripCard);
    });
    
    // Обработчики для кнопок удаления
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const tripId = this.getAttribute('data-id');
            if (confirm('Вы уверены, что хотите удалить эту поездку?')) {
                trips = trips.filter(t => t.id !== tripId);
                saveTrips();
                renderTrips();
            }
        });
    });
}

function renderTodos(trip) {
    const todosList = document.getElementById('todosList');
    todosList.innerHTML = '';
    
    if (trip.todos.length === 0) {
        todosList.innerHTML = '<li>Нет задач</li>';
        return;
    }
    
    trip.todos.forEach(todo => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');
        
        li.innerHTML = `
            <span>${todo.text}</span>
            <div class="todo-actions">
                <button class="complete-btn" data-id="${todo.id}">✓</button>
                <button class="btn-danger delete-todo-btn" data-id="${todo.id}">×</button>
            </div>
        `;
        
        todosList.appendChild(li);
    });
    
    // Обработчики для кнопок задач
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const todoId = this.getAttribute('data-id');
            const todo = trip.todos.find(t => t.id === todoId);
            todo.completed = !todo.completed;
            saveTrips();
            renderTodos(trip);
        });
    });
    
    document.querySelectorAll('.delete-todo-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const todoId = this.getAttribute('data-id');
            trip.todos = trip.todos.filter(t => t.id !== todoId);
            saveTrips();
            renderTodos(trip);
        });
    });
}

function renderRoute(trip) {
    const routeList = document.getElementById('routeList');
    routeList.innerHTML = '';
    
    if (trip.route.length === 0) {
        routeList.innerHTML = '<li>Маршрут не задан</li>';
        return;
    }
    
    trip.route.forEach((point, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${index + 1}. ${point.point}</span>
            <div class="route-actions">
                <button class="btn-danger delete-route-btn" data-id="${point.id}">×</button>
            </div>
        `;
        routeList.appendChild(li);
    });
    
    // Обработчики для кнопок маршрута
    document.querySelectorAll('.delete-route-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pointId = this.getAttribute('data-id');
            trip.route = trip.route.filter(p => p.id !== pointId);
            saveTrips();
            renderRoute(trip);
        });
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function formatDateForCard(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const startStr = start.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
    
    if (!end || start.getTime() === end.getTime()) {
        return startStr;
    }
    
    const endStr = end.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
}

function saveTrips() {
    localStorage.setItem('trips', JSON.stringify(trips));
}