// Объект для хранения расходов
const expenses = [];

// Функция для добавления расхода
function addExpense(amount, category, comment) {
    const expense = {
        amount,
        category,
        comment,
        date: new Date()
    };
    expenses.push(expense);
    renderExpenses();
}

// Функция для рендеринга расходов
function renderExpenses(filteredExpenses = expenses) {
    const expensesList = document.getElementById('expenses-list');
    expensesList.innerHTML = '';
    filteredExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${expense.amount} ${expense.category}</span>
            <span>${expense.comment}</span>
            <span>${expense.date.toLocaleDateString()}</span>
        `;
        li.classList.add(expense.category);
        expensesList.appendChild(li);
    });
}

// Функция для фильтрации расходов
function filterExpenses(filterType, filterValue) {
    let filteredExpenses = expenses;
    if (filterType === 'category') {
        filteredExpenses = expenses.filter((expense) => expense.category === filterValue);
    } else if (filterType === 'date') {
        const date = new Date();
        date.setDate(date.getDate() - filterValue);
        filteredExpenses = expenses.filter((expense) => expense.date >= date);
    }
    renderExpenses(filteredExpenses);
}

// Событие для добавления расхода
document.getElementById('add-expense-btn').addEventListener('click', () => {
    const addExpenseFormContainer = document.getElementById('add-expense-form-container');
    addExpenseFormContainer.style.display = 'block';
});

// Событие для отправки формы добавления расхода
document.getElementById('add-expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const comment = document.getElementById('comment').value;
    addExpense(amount, category, comment);
    const addExpenseFormContainer = document.getElementById('add-expense-form-container');
    addExpenseFormContainer.style.display = 'none';
});

// Событие для фильтрации расходов по категории
document.getElementById('category-filter').addEventListener('change', (e) => {
    const filterValue = e.target.value;
    filterExpenses('category', filterValue);
});

// Событие для фильтрации расходов по дате
document.getElementById('date-filter').addEventListener('change', (e) => {
    const filterValue = parseInt(e.target.value);
    filterExpenses('date', filterValue);
});