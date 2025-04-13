document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('ticketsList');
    const loading = document.getElementById('loading');
    const themeToggle = document.querySelector('.theme-toggle');
    const cliFab = document.getElementById('cliFab');

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    try {
        const response = await fetch('tickets.json');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const tickets = await response.json();

        renderTickets(tickets);
        initSearch(tickets);
        initThemeToggle();
        initCLIFab();
    } catch (error) {
        showError(error);
    } finally {
        loading.style.display = 'none';
    }

    function renderTickets(tickets) {
        container.innerHTML = '';
        tickets.forEach(ticket => {
            const card = document.createElement('article');
            card.className = 'ticket-card';
            card.innerHTML = `
                <header>
                    <h3>Билет #${ticket.id}</h3>
                    <p>${ticket.title}</p>
                </header>
                <a href="${ticket.zipUrl}" class="download-btn">
                    <i class="fas fa-download"></i>
                    Скачать архив (${ticket.id})
                </a>
                <div class="cli-instruction" data-cmd="${ticket.zipUrlRaw}">
                    wget ${ticket.zipUrlRaw} -O ${ticket.id != 21 ? 'ticket' : 'teoriya'}${ticket.id != 21 ? '-' : ''}${ticket.id != 21 ? ticket.id : ''}.zip
                </div>
            `;
            card.querySelector('.cli-instruction').addEventListener('click', copyToClipboard);
            container.appendChild(card);
        });
        ScrollReveal().reveal('.ticket-card', {
            interval: 100,
            reset: true,
            viewFactor: 0.1
        });
    }

    function copyToClipboard(e) {
        const text = e.target.getAttribute('data-cmd');
        navigator.clipboard.writeText(text)
            .then(() => showToast('Команда скопирована!'))
            .catch(() => showToast('Ошибка копирования'));
    }

    function initSearch(tickets) {
        const searchInput = document.getElementById('searchInput');
        let timeoutId;
        
        const handleSearch = (term) => {
            const filtered = tickets.filter(t => 
                t.title.toLowerCase().includes(term) ||
                t.id.toString().includes(term)
            );
            renderTickets(filtered);
        };

        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            const term = e.target.value.toLowerCase().trim();
            
            container.innerHTML = Array.from({length: 6}, () => `
                <div class="skeleton-card"></div>
            `).join('');

            timeoutId = setTimeout(() => handleSearch(term), 300);
        });
    }

    function initThemeToggle() {
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    function initCLIFab() {
        cliFab.addEventListener('click', () => {
            document.querySelectorAll('.cli-instruction').forEach(el => {
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            });
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function showError(error) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${error.message}
        `;
        container.parentElement.insertBefore(errorEl, container);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.cli-instruction').forEach(el => {
                el.style.display = 'none';
            });
        }
    });
});