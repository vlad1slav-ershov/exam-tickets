document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('tickets.json');
    const tickets = await response.json();
    
    const container = document.getElementById('ticketsList');
    
    tickets.forEach(ticket => {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        card.innerHTML = `
            <h3>${ticket.id}. ${ticket.title}</h3>
            <a href="${ticket.zipUrl}" class="download-btn">
                кнопка для скачивания билета ${ticket.id}
            </a>
            <div class="cli-instruction">
                wget ${ticket.zipUrlRaw} -O ticket-${ticket.id}.zip
            </div>
        `;
        container.appendChild(card);
    });
});