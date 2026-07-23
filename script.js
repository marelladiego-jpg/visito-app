// Messaggio di benvenuto unico all'avvio
addMessage("Ciao! 🌍 Sono **Visito**, il tuo assistente di viaggio personale. Dimmi, quale città del mondo vorresti scoprire oggi?", 'bot');// Selezioniamo gli elementi dell'interfaccia
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Database di conoscenze locale per Visito
const destinazioni = {
    "parigi": "🗼 **Parigi, Francia!**\nEcco 3 tappe imperdibili:\n1. Tour Eiffel e Giardini del Trocadéro\n2. Museo del Louvre\n3. Passeggiata a Montmartre e Sacré-Cœur.",
    "roma": "🏛️ **Roma, Italia!**\nEcco cosa non puoi perderti:\n1. Colosseo e Fori Imperiali\n2. Pantheon e Fontana di Trevi\n3. Basilica di San Pietro.",
    "londra": "🎡 **Londra, Regno Unito!**\nConsigli rapidi:\n1. Big Ben e London Eye\n2. British Museum (ingresso gratuito!)\n3. Passeggiata a Camden Market.",
    "tokyo": "⛩️ **Tokyo, Giappone!**\nL'unione tra futuro e tradizione:\n1. Quartiere illuminato di Shibuya\n2. Tempio Senso-ji ad Asakusa\n3. Vista panoramica dalla Tokyo Skytree."
};

// Funzione per aggiungere un messaggio alla chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    // Convertiamo i "vado a capo" in tag HTML <br> per formattare bene il testo
    messageDiv.innerHTML = text.replace(/\n/g, '<br>');
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Logica di risposta di Visito
function generaRispostaBot(testoUtente) {
    const testoLower = testoUtente.toLowerCase();
    
    // Cerca se l'utente ha nominato una delle nostre città
    for (let citta in destinazioni) {
        if (testoLower.includes(citta)) {
            return destinazioni[citta];
        }
    }
    
    // Risposta standard se la città non è ancora nel database
    return `🌍 **${testoUtente}** sembra una meta fantastica!\nAl momento sto aggiornando la mia mappa, ma ti consiglio di verificare i voli migliori per questa destinazione! ✈️`;
}

// Funzione principale per gestire l'invio del messaggio
function sendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;

    // 1. Mostra il messaggio dell'utente
    addMessage(text, 'user');
    userInput.value = '';

    // 2. Risposta intelligente del Bot dopo 800ms
    setTimeout(() => {
        const risposta = generaRispostaBot(text);
        addMessage(risposta, 'bot');
    }, 800);
}

// Eventi tastiera e click
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
})