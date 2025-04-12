// Хранилище рецептов
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    
    if (path === 'index.html' || path === '') {
        initHomePage();
    } else if (path === 'recipe.html') {
        initRecipePage();
    } else if (path === 'shopping-list.html') {
        initShoppingListPage();
    }
});

// Главная страница
function initHomePage() {
    renderRecipes();
    
    // Переход на страницу добавления
    document.getElementById('addRecipeBtn').addEventListener('click', function() {
        window.location.href = 'recipe.html?new=true';
    });
    
    // Применение фильтров
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

// Страница рецепта
function initRecipePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const isNew = urlParams.get('new') === 'true';
    
    if (isNew) {
        setupNewRecipe();
    } else if (recipeId) {
        loadRecipe(recipeId);
    } else {
        window.location.href = 'index.html';
    }
}

// Страница списка покупок
function initShoppingListPage() {
    renderShoppingList();
    
    // Очистка списка
    document.getElementById('clearListBtn').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить список покупок?')) {
            shoppingList = [];
            saveShoppingList();
            renderShoppingList();
        }
    });
    
    // Печать списка
    document.getElementById('printListBtn').addEventListener('click', function() {
        window.print();
    });
}

// Вспомогательные функции
function renderRecipes(recipesToRender = recipes) {
    const recipesList = document.getElementById('recipesList');
    recipesList.innerHTML = '';
    
    if (recipesToRender.length === 0) {
        recipesList.innerHTML = '<p class="no-recipes">Рецепты не найдены</p>';
        return;
    }
    
    recipesToRender.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <div class="recipe-image">
                ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.name}">` : '<div class="no-image">Нет изображения</div>'}
            </div>
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <div class="recipe-meta">
                    <span>${getMealTypeName(recipe.mealType)}</span>
                    <span>⏱ ${recipe.cookingTime} мин</span>
                    <span>🍽 ${recipe.servings} порц.</span>
                </div>
            </div>
        `;
        
        recipeCard.addEventListener('click', function() {
            window.location.href = `recipe.html?id=${recipe.id}`;
        });
        
        recipesList.appendChild(recipeCard);
    });
}

function loadRecipe(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) {
        window.location.href = 'index.html';
        return;
    }
    
    // Заполняем информацию о рецепте
    document.getElementById('recipeTitle').textContent = recipe.name;
    
    if (recipe.imageUrl) {
        document.getElementById('recipeImage').innerHTML = `<img src="${recipe.imageUrl}" alt="${recipe.name}">`;
    }
    
    document.getElementById('recipeType').textContent = getMealTypeName(recipe.mealType);
    document.getElementById('cookingTime').textContent = `${recipe.cookingTime} минут`;
    document.getElementById('servings').textContent = recipe.servings;
    document.getElementById('difficulty').textContent = recipe.difficulty || 'Не указана';
    
    // Ингредиенты
    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${ingredient.name}</span>
            <span>${ingredient.amount} ${ingredient.unit || ''}</span>
        `;
        ingredientsList.appendChild(li);
    });
    
    // Инструкции
    document.getElementById('instructions').textContent = recipe.instructions;
    
    // Кнопка избранного
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (recipe.favorite) {
        favoriteBtn.classList.add('active');
    }
    
    favoriteBtn.addEventListener('click', function() {
        recipe.favorite = !recipe.favorite;
        saveRecipes();
        favoriteBtn.classList.toggle('active');
    });
    
    // Кнопка редактирования
    document.getElementById('editRecipeBtn').addEventListener('click', function() {
        window.location.href = `recipe.html?edit=${recipe.id}`;
    });
    
    // Добавление в список покупок
    document.getElementById('addToShoppingList').addEventListener('click', function() {
        addRecipeToShoppingList(recipe);
        alert('Ингредиенты добавлены в список покупок!');
    });
}

function setupNewRecipe() {
    // Здесь можно добавить логику для создания нового рецепта
    // Пока просто оставляем страницу пустой для просмотра
    document.getElementById('editRecipeBtn').textContent = 'Создать рецепт';
    document.getElementById('addToShoppingList').style.display = 'none';
    document.getElementById('favoriteBtn').style.display = 'none';
}

function renderShoppingList() {
    const selectedRecipesList = document.getElementById('selectedRecipesList');
    const shoppingListElement = document.getElementById('shoppingList');
    
    selectedRecipesList.innerHTML = '';
    shoppingListElement.innerHTML = '';
    
    if (shoppingList.length === 0) {
        shoppingListElement.innerHTML = '<li>Список покупок пуст</li>';
        return;
    }
    
    // Получаем уникальные рецепты в списке покупок
    const uniqueRecipeIds = [...new Set(shoppingList.map(item => item.recipeId))];
    
    uniqueRecipeIds.forEach(recipeId => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
            const li = document.createElement('li');
            li.textContent = recipe.name;
            selectedRecipesList.appendChild(li);
        }
    });
    
    // Группируем ингредиенты по названию
    const groupedIngredients = {};
    
    shoppingList.forEach(item => {
        if (!groupedIngredients[item.name]) {
            groupedIngredients[item.name] = {
                amount: 0,
                unit: item.unit
            };
        }
        groupedIngredients[item.name].amount += item.amount;
    });
    
    // Отображаем сгруппированные ингредиенты
    for (const [name, data] of Object.entries(groupedIngredients)) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${name}</span>
            <span>${data.amount} ${data.unit || ''}</span>
        `;
        shoppingListElement.appendChild(li);
    }
}

function addRecipeToShoppingList(recipe) {
    recipe.ingredients.forEach(ingredient => {
        shoppingList.push({
            recipeId: recipe.id,
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit
        });
    });
    
    saveShoppingList();
}

function applyFilters() {
    const mealType = document.getElementById('mealType').value;
    const ingredientFilter = document.getElementById('ingredientFilter').value.toLowerCase();
    const timeFilter = parseInt(document.getElementById('timeFilter').value) || 0;
    
    let filteredRecipes = recipes;
    
    if (mealType) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.mealType === mealType);
    }
    
    if (ingredientFilter) {
        filteredRecipes = filteredRecipes.filter(recipe => 
            recipe.ingredients.some(ing => 
                ing.name.toLowerCase().includes(ingredientFilter)
            )
        );
    }
    
    if (timeFilter > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.cookingTime <= timeFilter);
    }
    
    renderRecipes(filteredRecipes);
}

function resetFilters() {
    document.getElementById('mealType').value = '';
    document.getElementById('ingredientFilter').value = '';
    document.getElementById('timeFilter').value = '';
    renderRecipes();
}

function getMealTypeName(mealType) {
    const types = {
        'breakfast': 'Завтрак',
        'lunch': 'Обед',
        'dinner': 'Ужин',
        'dessert': 'Десерт',
        'snack': 'Закуска'
    };
    return types[mealType] || mealType;
}

function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

function saveShoppingList() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Пример начальных данных
if (recipes.length === 0) {
    recipes = [
        {
            id: '1',
            name: 'Омлет с овощами',
            mealType: 'breakfast',
            cookingTime: 15,
            servings: 2,
            difficulty: 'Легко',
            ingredients: [
                { name: 'Яйца', amount: 4, unit: 'шт' },
                { name: 'Помидоры', amount: 1, unit: 'шт' },
                { name: 'Перец болгарский', amount: 0.5, unit: 'шт' },
                { name: 'Молоко', amount: 50, unit: 'мл' },
                { name: 'Соль', amount: 1, unit: 'щепотка' }
            ],
            instructions: '1. Взбейте яйца с молоком и солью.\n2. Нарежьте овощи небольшими кубиками.\n3. Обжарьте овощи на сковороде 2-3 минуты.\n4. Залейте яичной смесью и жарьте на среднем огне до готовности.',
            favorite: true
        },
        {
            id: '2',
            name: 'Паста Карбонара',
            mealType: 'dinner',
            cookingTime: 25,
            servings: 2,
            difficulty: 'Средне',
            ingredients: [
                { name: 'Спагетти', amount: 200, unit: 'г' },
                { name: 'Бекон', amount: 150, unit: 'г' },
                { name: 'Яйца', amount: 2, unit: 'шт' },
                { name: 'Сыр Пармезан', amount: 50, unit: 'г' },
                { name: 'Чеснок', amount: 2, unit: 'зубчика' },
                { name: 'Соль', amount: 1, unit: 'щепотка' },
                { name: 'Перец черный', amount: 1, unit: 'щепотка' }
            ],
            instructions: '1. Отварите пасту согласно инструкции на упаковке.\n2. Обжарьте бекон с чесноком до хрустящей корочки.\n3. Взбейте яйца с тертым пармезаном.\n4. Смешайте горячую пасту с беконом, затем быстро добавьте яичную смесь, постоянно помешивая.\n5. Подавайте сразу же, посыпав дополнительным пармезаном и перцем.',
            favorite: false
        }
    ];
    saveRecipes();
}