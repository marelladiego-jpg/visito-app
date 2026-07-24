// 1. Elementi HTML
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const apiBtn = document.getElementById('api-btn');

// 2. Gestione Chiave API
let API_KEY = localStorage.getItem('VISITO_API_KEY') || "";

function impostaChiaveAPI() {
    const nuovaChiave = prompt("Incolla qui la tua chiave API di Google Gemini:", API_KEY);
    if (nuovaChiave !== null) {
        API_KEY = nuovaChiave.trim();
        localStorage.setItem('VISITO_API_KEY', API_KEY);
        alert("Chiave API salvata con successo!");
    }
}

apiBtn.addEventListener('click', impostaChiaveAPI);

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

// 4. Chiamata all'API di Gemini
async function rispondiUtente(testo) {
    if (!API_KEY) {
        addMessage("⚠️ Per favore clicca sul pulsante **🔑 Configura Chiave API** in alto per inserire la tua chiave prima di continuare!", 'bot');
        impostaChiaveAPI();
        return;
    }

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

        if (data.candidates && data.candidates[0] && data.candidates[0].content.parts[0].text) {
            const rispostaIA = data.candidates[0].content.parts[0].text;
            addMessage(rispostaIA, 'bot');
        } else {
            addMessage("Ops! La chiave API potrebbe non essere corretta o valida. Clicca sul pulsante **🔑 Configura Chiave API** in alto per reinserirla.", 'bot');
        }
    } catch (error) {
        chatBox.removeChild(loadingDiv);
        console.error(error);
        addMessage("Errore di connessione con la chiave inserita. Clicca in alto su **🔑 Configura Chiave API** per rinnovarla.", 'bot');
    }
}

// 5. Invio messaggio
function sendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;

    addMessage(text, 'user');
    userInput.value = '';

    rispondiUtente(text);
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 6. Messaggio di benvenuto
addMessage("Ciao! 🌍 Sono **Visito**, il tuo assistente di viaggio personale. Dimmi, quale città del mondo vorresti scoprire oggi?", 'bot');