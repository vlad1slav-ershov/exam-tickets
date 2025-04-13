document.addEventListener('DOMContentLoaded', () => {
    displayFavoriteArticles();
});

function displayFavoriteArticles() {
    const favoritesList = document.getElementById('favorites-list');
    if (!favoritesList) return;
    
    const favoriteArticles = getFavoriteArticles();
    const emptyMessage = document.getElementById('empty-message');

    if (favoriteArticles.length === 0) {
        emptyMessage.style.display = 'block';
        favoritesList.innerHTML = '';
        favoritesList.appendChild(emptyMessage);
        return;
    }

    emptyMessage.style.display = 'none';
    favoritesList.innerHTML = '';

    favoriteArticles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'favorite-card';
        articleElement.innerHTML = `
            <button class="remove-btn" data-id="${article.id}">×</button>
            <h2>${article.title}</h2>
            <p class="description">${article.description}</p>
            <div class="meta">
                <span>${formatDate(article.date)}</span>
                <span class="source">${article.source}</span>
            </div>
            <a href="article.html?id=${article.id}" class="read-more">Читать далее</a>
        `;
        favoritesList.appendChild(articleElement);
    });

    // Навешиваем обработчики на кнопки удаления
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            removeFromFavorites(parseInt(btn.dataset.id));
            displayFavoriteArticles(); // Обновляем список после удаления
        });
    });
}

function getFavoriteArticles() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const articles = JSON.parse(localStorage.getItem('articles')) || [];
    return articles.filter(article => favorites.includes(article.id));
}

function removeFromFavorites(articleId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== articleId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}