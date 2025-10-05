// Admin Panel JavaScript
let currentMessages = [];
let currentMessageId = null;

// Load messages from localStorage
const loadMessages = () => {
    currentMessages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
    displayMessages();
    updateStats();
};

// Display messages
const displayMessages = (filter = 'all') => {
    const container = document.getElementById('messages-container');
    const noMessages = document.getElementById('no-messages');
    
    let filteredMessages = currentMessages;
    
    // Apply filter
    switch(filter) {
        case 'unread':
            filteredMessages = currentMessages.filter(msg => !msg.read);
            break;
        case 'read':
            filteredMessages = currentMessages.filter(msg => msg.read);
            break;
        case 'today':
            const today = new Date().toDateString();
            filteredMessages = currentMessages.filter(msg => 
                new Date(msg.date).toDateString() === today
            );
            break;
    }
    
    if (filteredMessages.length === 0) {
        container.innerHTML = '';
        noMessages.style.display = 'block';
        return;
    }
    
    noMessages.style.display = 'none';
    
    // Sort by date (newest first)
    filteredMessages.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = filteredMessages.map(message => `
        <div class="message-card ${!message.read ? 'unread' : ''}" onclick="openMessage(${message.id})">
            <div class="message-header">
                <div class="message-name">${message.name}</div>
                <div class="message-date">${message.date}</div>
            </div>
            <div class="message-email">${message.email}</div>
            <div class="message-preview">${message.message}</div>
            <div class="message-actions">
                <button class="action-btn ${message.read ? 'read' : ''}" onclick="event.stopPropagation(); toggleRead(${message.id})">
                    <i class="fas fa-${message.read ? 'envelope-open' : 'envelope'}"></i>
                    ${message.read ? 'Marcar como no leído' : 'Marcar como leído'}
                </button>
                <button class="action-btn delete" onclick="event.stopPropagation(); deleteMessage(${message.id})">
                    <i class="fas fa-trash"></i>
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
};

// Update statistics
const updateStats = () => {
    const totalMessages = currentMessages.length;
    const unreadMessages = currentMessages.filter(msg => !msg.read).length;
    const todayMessages = currentMessages.filter(msg => 
        new Date(msg.date).toDateString() === new Date().toDateString()
    ).length;
    
    document.getElementById('total-messages').textContent = totalMessages;
    document.getElementById('unread-messages').textContent = unreadMessages;
    document.getElementById('today-messages').textContent = todayMessages;
};

// Open message modal
const openMessage = (messageId) => {
    const message = currentMessages.find(msg => msg.id === messageId);
    if (!message) return;
    
    currentMessageId = messageId;
    
    document.getElementById('modal-name').textContent = message.name;
    document.getElementById('modal-email').textContent = message.email;
    document.getElementById('modal-date').textContent = message.date;
    document.getElementById('modal-message').textContent = message.message;
    
    document.getElementById('message-modal').style.display = 'block';
    
    // Mark as read
    if (!message.read) {
        toggleRead(messageId);
    }
};

// Close modal
const closeModal = () => {
    document.getElementById('message-modal').style.display = 'none';
    currentMessageId = null;
};

// Toggle read status
const toggleRead = (messageId) => {
    const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
        currentMessages[messageIndex].read = !currentMessages[messageIndex].read;
        localStorage.setItem('portfolioMessages', JSON.stringify(currentMessages));
        displayMessages(document.getElementById('filter-select').value);
        updateStats();
    }
};

// Delete message
const deleteMessage = (messageId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
        currentMessages = currentMessages.filter(msg => msg.id !== messageId);
        localStorage.setItem('portfolioMessages', JSON.stringify(currentMessages));
        displayMessages(document.getElementById('filter-select').value);
        updateStats();
        
        // Close modal if it's open
        if (currentMessageId === messageId) {
            closeModal();
        }
    }
};

// Reply to message
const replyToMessage = () => {
    if (!currentMessageId) return;
    
    const message = currentMessages.find(msg => msg.id === currentMessageId);
    if (!message) return;
    
    // Create mailto link
    const subject = encodeURIComponent(`Re: Mensaje desde tu portafolio`);
    const body = encodeURIComponent(`Hola ${message.name},\n\nGracias por contactarme a través de mi portafolio.\n\n`);
    const mailtoLink = `mailto:${message.email}?subject=${subject}&body=${body}`;
    
    window.open(mailtoLink);
};

// Filter messages
const filterMessages = () => {
    const filter = document.getElementById('filter-select').value;
    displayMessages(filter);
};

// Refresh messages
const refreshMessages = () => {
    loadMessages();
    // Add visual feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-sync fa-spin"></i> Actualizando...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1000);
};

// Clear all messages
const clearAllMessages = () => {
    if (confirm('¿Estás seguro de que quieres eliminar TODOS los mensajes? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('portfolioMessages');
        currentMessages = [];
        displayMessages();
        updateStats();
        alert('Todos los mensajes han sido eliminados.');
    }
};

// Close modal when clicking outside
window.onclick = (event) => {
    const modal = document.getElementById('message-modal');
    if (event.target === modal) {
        closeModal();
    }
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    
    // Add some sample messages for demonstration (remove this in production)
    if (currentMessages.length === 0) {
        const sampleMessages = [
            {
                id: Date.now(),
                name: 'Juan Pérez',
                email: 'juan@ejemplo.com',
                message: 'Hola Daniel, me encanta tu portafolio. ¿Podrías ayudarme con un proyecto de React?',
                date: new Date().toLocaleString('es-ES'),
                read: false
            },
            {
                id: Date.now() + 1,
                name: 'María García',
                email: 'maria@empresa.com',
                message: 'Excelente trabajo con el diseño. ¿Estás disponible para trabajar en un proyecto freelance?',
                date: new Date(Date.now() - 86400000).toLocaleString('es-ES'),
                read: true
            }
        ];
        
        localStorage.setItem('portfolioMessages', JSON.stringify(sampleMessages));
        loadMessages();
    }
});
