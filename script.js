// Selezioniamo gli elementi dell'interfaccia
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Funzione per aggiungere un messaggio alla chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    
    // Scorri automaticamente verso il basso per mostrare l'ultimo messaggio
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Funzione principale per gestire l'invio del messaggio
function sendMessage() {
    const text = userInput.value.trim();
    
    // Se la casella è vuota, non fare nulla
    if (text === '') return;

    // 1. Mostra il messaggio dell'utente a schermo
    addMessage(text, 'user');
    userInput.value = '';

    // 2. Risposta automatica temporanea del Bot (simulazione IA)
    setTimeout(() => {
        addMessage(`Hai cercato: "${text}". Sto elaborando le migliori destinazioni per te... ✈️`, 'bot');
    }, 1000);
}

// Evento 1: Clic sul pulsante "Invia"
sendBtn.addEventListener('click', sendMessage);

// Evento 2: Pressione del tasto "Invio" sulla tastiera
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});