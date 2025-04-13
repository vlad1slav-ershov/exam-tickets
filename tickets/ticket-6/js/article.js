document.addEventListener('DOMContentLoaded', () => {
    // Получаем ID статьи из URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));

    // Получаем статью из localStorage
    const articles = JSON.parse(localStorage.getItem('articles')) || [];
    const article = articles.find(a => a.id === articleId);

    if (!article) {
        document.getElementById('article-content').innerHTML = '<h1>Статья не найдена</h1><p>Запрошенная статья не существует или была удалена.</p>';
        document.getElementById('favorite-btn').style.display = 'none';
        return;
    }

    // Заполняем контент статьи
    const articleContent = document.getElementById('article-content');
    articleContent.innerHTML = `
        <h1>${article.title}</h1>
        <div class="meta">
            <span>${formatDate(article.date)}</span>
            <span class="source">${article.source}</span>
        </div>
        <div class="content">${article.content}</div>
    `;

    // Настраиваем кнопку избранного
    updateFavoriteButton(articleId);
    document.getElementById('favorite-btn').addEventListener('click', () => {
        toggleFavorite(articleId);
        updateFavoriteButton(articleId);
    });
});

// Функции для работы с избранным
function toggleFavorite(articleId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.includes(articleId)) {
        favorites = favorites.filter(id => id !== articleId);
    } else {
        favorites.push(articleId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoriteButton(articleId) {
    const favoriteBtn = document.getElementById('favorite-btn');
    if (!favoriteBtn) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(articleId)) {
        favoriteBtn.textContent = 'Удалить из избранного';
        favoriteBtn.style.backgroundColor = '#e74c3c';
    } else {
        favoriteBtn.textContent = 'Добавить в избранное';
        favoriteBtn.style.backgroundColor = '#3498db';
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}