let isAscending = true;

// Загрузка заметок из localStorage
const loadNotes = () => JSON.parse(localStorage.getItem('notes')) || [];

// Сохранение заметок в localStorage
const saveNotes = (notes) => localStorage.setItem('notes', JSON.stringify(notes));

// Отображение заметок
const displayNotes = (notes) => {
    const container = document.getElementById('notesContainer');
    container.innerHTML = '';
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p class="note-date">${new Date(note.date).toLocaleString()}</p>
            <div class="note-actions">
                <a href="create.html?id=${note.id}" class="button">Редактировать</a>
                <button onclick="deleteNote('${note.id}')" class="button">Удалить</button>
            </div>
        `;
        container.appendChild(noteElement);
    });
}

// Удаление заметки
const deleteNote = (id) => {
    if (confirm('Удалить заметку?')) {
        const notes = loadNotes();
        const filteredNotes = notes.filter(note => note.id !== id);
        saveNotes(filteredNotes);
        displayNotes(filteredNotes);
    }
}

// Поиск заметок
const searchInput = document.getElementById('searchInput');

searchInput?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const notes = loadNotes();
    const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) || 
        note.content.toLowerCase().includes(searchTerm)
    );
    displayNotes(filtered);
});

// Сортировка
const toggleSort = () => {
    isAscending = !isAscending;
    const notes = loadNotes();
    notes.sort((a, b) => isAscending 
        ? new Date(a.date) - new Date(b.date) 
        : new Date(b.date) - new Date(a.date));
    displayNotes(notes);
}

// Для страницы создания/редактирования
if (window.location.pathname.endsWith('create.html')) {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get('id');
    
    if (noteId) {
        const note = loadNotes().find(n => n.id === noteId);
        if (note) {
            document.getElementById('formTitle').textContent = 'Редактировать заметку';
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
        }
    }
    
    window.saveNote = (e) => {
        e.preventDefault();
        
        const notes = loadNotes();
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        
        if (noteId) {
            // Редактирование
            const index = notes.findIndex(n => n.id === noteId);
            notes[index] = { ...notes[index], title, content };
        } else {
            // Новая заметка
            notes.push({
                id: Date.now().toString(),
                title,
                content,
                date: new Date().toISOString()
            });
        }
        
        saveNotes(notes);
        window.location.href = 'index.html';
    }
}

// Инициализация на главной странице
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', () => {
        const notes = loadNotes();
        displayNotes(notes);
    });
}