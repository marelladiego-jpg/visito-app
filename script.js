// 1. Selezioniamo gli elementi dall'HTML
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// 2. Database di risposte locali
const destinazioni = {
    "parigi": "🗼 **Parigi, Francia!**\nEcco 3 tappe imperdibili:\n1. Tour Eiffel e Giardini del Trocadéro\n2. Museo del Louvre\n3. Passeggiata a Montmartre",
    "roma": "🏛️ **Roma, Italia!**\nEcco cosa non puoi perderti:\n1. Colosseo e Fori Imperiali\n2. Fontana di Trevi\n3. Pantheon e Piazza Navona",
    "londra": "🇬🇧 **Londra, Regno Unito!**\nConsigli rapidi:\n1. Big Ben e London Eye\n2. British Museum\n3. Passeggiata ad Hyde Park",
    "tokyo": "⛩️ **Tokyo, Giappone!**\nL'unione tra futuro e tradizione:\n1. Quartiere illuminato di Shibuya\n2. Tempio Senso-ji a Asakusa\n3. Vista panoramica dalla Tokyo Tower"
};

// 3. Funzione per aggiungere messaggi a schermo
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    let formattedText = text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
    messageDiv.innerHTML = formattedText;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. Funzione per gestire la risposta del Bot
function rispondiUtente(testo) {
    const testoPulito = testo.toLowerCase().trim();
    let risposta = "";

    if (destinazioni[testoPulito]) {
        risposta = destinazioni[testoPulito];
    } else {
        risposta = `Che bella destinazione! ✈️ Al momento sto ancora studiando **${testo}**, ma presto saprò darti un itinerario completo! Prova a chiedermi di **Parigi**, **Roma**, **Londra** o **Tokyo**!`;
    }

    addMessage(risposta, 'bot');
}

// 5. Funzione principale di invio del messaggio
function sendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;

    addMessage(text, 'user');
    userInput.value = '';

    setTimeout(() => {
        rispondiUtente(text);
    }, 600);
}

// 6. Eventi per bottone e tasto Invio
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 7. Messaggio di benvenuto all'avvio (in fondo a tutto!)
addMessage("Ciao! 🌍 Sono **Visito**, il tuo assistente di viaggio personale. Dimmi, quale città del mondo vorresti scoprire oggi?", 'bot');