// Данные статей (теперь они будут доступны везде)
const articles = [
    {
        id: 1,
        title: "Введение в React",
        description: "Основные концепции React и как начать работать с этой библиотекой.",
        content: "<h2>Что такое React?</h2><p>React — это JavaScript-библиотека для создания пользовательских интерфейсов.</p><p>Она позволяет создавать сложные UI из небольших и изолированных частей кода, называемых «компонентами».</p>",
        source: "habr",
        date: "2023-05-15"
    },
    {
        id: 2,
        title: "Современный CSS",
        description: "Новые возможности CSS, которые вы могли пропустить.",
        content: "<h2>CSS Grid и Flexbox</h2><p>Современные методы вёрстки значительно упрощают создание адаптивных интерфейсов.</p><p>Grid особенно полезен для двумерных раскладок, в то время как Flexbox идеален для одномерных.</p>",
        source: "medium",
        date: "2023-06-02"
    },
    {
        id: 3,
        title: "Оптимизация производительности веб-приложений",
        description: "Практические советы по ускорению загрузки вашего сайта.",
        content: "<h2>Ключевые метрики производительности</h2><p>Largest Contentful Paint (LCP), First Input Delay (FID) и Cumulative Layout Shift (CLS) — три ключевых метрики, на которые стоит обращать внимание.</p>",
        source: "vc",
        date: "2023-04-20"
    }
];

// Сохраняем статьи в localStorage, чтобы они были доступны на других страницах
localStorage.setItem('articles', JSON.stringify(articles));

// Функция для отображения статей
function displayArticles(articlesToDisplay) {
    const articlesList = document.getElementById('articles-list');
    if (!articlesList) return;
    
    articlesList.innerHTML = '';

    if (articlesToDisplay.length === 0) {
        articlesList.innerHTML = '<p class="empty-message">Статьи не найдены.</p>';
        return;
    }

    articlesToDisplay.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'article-card';
        articleElement.innerHTML = `
            <h2>${article.title}</h2>
            <p class="description">${article.description}</p>
            <div class="meta">
                <span>${formatDate(article.date)}</span>
                <span class="source">${article.source}</span>
            </div>
            <a href="article.html?id=${article.id}" class="read-more">Читать далее</a>
        `;
        articlesList.appendChild(articleElement);
    });
}

// Функция для форматирования даты
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Функция для фильтрации статей
function filterArticles() {
    const sourceFilter = document.getElementById('source-filter')?.value;
    const dateSort = document.getElementById('date-sort')?.value;

    // Получаем статьи из localStorage
    const savedArticles = JSON.parse(localStorage.getItem('articles')) || [];
    let filteredArticles = [...savedArticles];

    // Фильтрация по источнику
    if (sourceFilter && sourceFilter !== 'all') {
        filteredArticles = filteredArticles.filter(article => article.source === sourceFilter);
    }

    // Сортировка по дате
    if (dateSort) {
        filteredArticles.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }

    displayArticles(filteredArticles);
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    // Отображаем все статьи при загрузке
    const savedArticles = JSON.parse(localStorage.getItem('articles')) || [];
    displayArticles(savedArticles);

    // Навешиваем обработчики на фильтры (если они есть на странице)
    document.getElementById('source-filter')?.addEventListener('change', filterArticles);
    document.getElementById('date-sort')?.addEventListener('change', filterArticles);
});