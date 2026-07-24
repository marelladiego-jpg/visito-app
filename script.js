// 1. Recupera la chiave salvata nel browser, oppure la chiede se non è presente
let API_KEY = localStorage.getItem('VISITO_API_KEY');

if (!API_KEY) {
    API_KEY = prompt("Inserisci la tua chiave API di Gemini per attivare Visito:");
    if (API_KEY) {
        localStorage.setItem('VISITO_API_KEY', API_KEY);
    }
}

// 2. Selezioniamo gli elementi dall'HTML
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

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

// 4. Funzione per chiamare l'API di Gemini
async function rispondiUtente(testo) {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot');
    loadingDiv.innerText = "Visito sta pensando...";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    const promptSistema = `Sei Visito, un assistente di viaggio entusiasta, esperto e sintetico.
L'utente ti chiederà informazioni su una destinazione o un itinerario.
Rispondi in modo chiaro, usando elenchi puntati ed emoji, dando i 3-4 consigli/tappe principali per la destinazione richiesta: "${testo}"`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptSistema }]
                }]
            })
        });

        const data = await response.json();
        chatBox.removeChild(loadingDiv);

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const rispostaIA = data.candidates[0].content.parts[0].text;
            addMessage(rispostaIA, 'bot');
        } else {
            addMessage("Ops! C'è stato un problema nel recuperare le informazioni. Riprova tra poco!", 'bot');
        }
    } catch (error) {
        chatBox.removeChild(loadingDiv);
        console.error(error);
        addMessage("Errore di connessione. Verifica la tua chiave API.", 'bot');
    }
}

// 5. Funzione principale di invio del messaggio
function sendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;

    addMessage(text, 'user');
    userInput.value = '';

    rispondiUtente(text);
}

// 6. Eventi per bottone e tasto Invio
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 7. Messaggio di benvenuto all'avvio
addMessage("Ciao! 🌍 Sono **Visito**, il tuo assistente di viaggio personale. Dimmi, quale città del mondo vorresti scoprire oggi?", 'bot');