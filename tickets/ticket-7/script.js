// Хранилище контактов (в реальном приложении можно использовать localStorage или API)
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    
    if (path === 'index.html' || path === '') {
        initHomePage();
    } else if (path === 'add-contact.html') {
        initAddContactPage();
    } else if (path === 'edit-contact.html') {
        initEditContactPage();
    }
});

// Главная страница
function initHomePage() {
    renderContacts();
    
    // Поиск контактов
    document.getElementById('searchBtn').addEventListener('click', searchContacts);
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchContacts();
    });
    
    // Переход на страницу добавления
    document.getElementById('addContactBtn').addEventListener('click', function() {
        window.location.href = 'add-contact.html';
    });
}

// Страница добавления контакта
function initAddContactPage() {
    document.getElementById('addContactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newContact = {
            id: Date.now().toString(),
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            notes: document.getElementById('notes').value.trim()
        };
        
        contacts.push(newContact);
        saveContacts();
        window.location.href = 'index.html';
    });
}

// Страница редактирования контакта
function initEditContactPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const contactId = urlParams.get('id');
    const contact = contacts.find(c => c.id === contactId);
    
    if (!contact) {
        window.location.href = 'index.html';
        return;
    }
    
    // Заполняем форму данными контакта
    document.getElementById('contactId').value = contact.id;
    document.getElementById('editName').value = contact.name;
    document.getElementById('editPhone').value = contact.phone;
    document.getElementById('editEmail').value = contact.email || '';
    document.getElementById('editAddress').value = contact.address || '';
    document.getElementById('editNotes').value = contact.notes || '';
    
    // Сохранение изменений
    document.getElementById('editContactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        contact.name = document.getElementById('editName').value.trim();
        contact.phone = document.getElementById('editPhone').value.trim();
        contact.email = document.getElementById('editEmail').value.trim();
        contact.address = document.getElementById('editAddress').value.trim();
        contact.notes = document.getElementById('editNotes').value.trim();
        
        saveContacts();
        window.location.href = 'index.html';
    });
    
    // Удаление контакта
    document.getElementById('deleteContactBtn').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите удалить этот контакт?')) {
            contacts = contacts.filter(c => c.id !== contactId);
            saveContacts();
            window.location.href = 'index.html';
        }
    });
}

// Вспомогательные функции
function renderContacts(contactsToRender = contacts) {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';
    
    if (contactsToRender.length === 0) {
        contactsList.innerHTML = '<tr><td colspan="4" style="text-align: center;">Нет контактов</td></tr>';
        return;
    }
    
    contactsToRender.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.phone}</td>
            <td>${contact.email || '-'}</td>
            <td class="actions">
                <a href="edit-contact.html?id=${contact.id}" class="btn-secondary">Редактировать</a>
                <button class="btn-danger delete-btn" data-id="${contact.id}">Удалить</button>
            </td>
        `;
        contactsList.appendChild(row);
    });
    
    // Обработчики для кнопок удаления
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = this.getAttribute('data-id');
            if (confirm('Вы уверены, что хотите удалить этот контакт?')) {
                contacts = contacts.filter(c => c.id !== contactId);
                saveContacts();
                renderContacts();
            }
        });
    });
}

function searchContacts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) {
        renderContacts();
        return;
    }
    
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm) || 
        contact.phone.toLowerCase().includes(searchTerm)
    );
    
    renderContacts(filteredContacts);
}

function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}