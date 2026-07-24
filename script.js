// Incolla qui tra le virgolette la stringa codificata che hai copiato da base64encode.org
const CHIAVE_CODIFICATA = QVEuQWI4Uk42S0NjRDVPazdSeGhjNHZyWi1sLTFkOExRSjZrY25LclpBMnJxdHZ1SGY1a0E=;

// Decodifica automatica della chiave
const API_KEY = atob(CHIAVE_CODIFICATA);

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptSistema }] }]
            })
        });

        const data = await response.json();
        chatBox.removeChild(loadingDiv);

        if (data.candidates && data.candidates[0] && data.candidates[0].content.parts[0].text) {
            const rispostaIA = data.candidates[0].content.parts[0].text;
            addMessage(rispostaIA, 'bot');
        } else {
            addMessage("Ops! C'è stato un errore di risposta dall'IA. Riprova tra poco!", 'bot');
        }
    } catch (error) {
        chatBox.removeChild(loadingDiv);
        addMessage("Errore di connessione con l'assistente IA.", 'bot');
    }
}

function sendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;

    addMessage(text, 'user');
    userInput.value = '';
    rispondiUtente(text);
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') sendMessage();
});

addMessage("Ciao! 🌍 Sono **Visito**, il tuo assistente di viaggio personale. Dimmi, quale città del mondo vorresti scoprire oggi?", 'bot');