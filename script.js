// 1. Elementi HTML
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// 2. Mostra messaggi in chat
function addMessage(text, sender) {
    if (!chatBox) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    let formattedText = text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
    messageDiv.innerHTML = formattedText;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 3. Chiamata alla nostra Serverless Function (/api/chat)
async function rispondiUtente(testo) {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot');
    loadingDiv.innerText = "Visito sta consultando le mappe di tutto il mondo...";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Chiamata al micro-server sicuro
        const response = await fetch("/api/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ testo: testo })
        });

        const data = await response.json();
        if (loadingDiv.parentNode) chatBox.removeChild(loadingDiv);

        if (data.choices && data.choices[0] && data.choices[0].message) {
            addMessage(data.choices[0].message.content, 'bot');
        } else if (data.error) {
            console.error("Errore Server:", data.error);
            addMessage(`Errore: ${data.error}`, 'bot');
        }
    } catch (err) {
        if (loadingDiv.parentNode) chatBox.removeChild(loadingDiv);
        console.error("Errore rete:", err);
        addMessage("Errore di connessione con il server.", 'bot');
    }
}

// 4. Funzione Invio
function inviaMessaggio() {
    if (!userInput) return;
    const testo = userInput.value.trim();
    if (testo === '') return;

    addMessage(testo, 'user');
    userInput.value = '';

    rispondiUtente(testo);
}

// 5. Listener Eventi
if (sendBtn) sendBtn.onclick = inviaMessaggio;
if (userInput) {
    userInput.onkeyup = function(e) {
        if (e.key === 'Enter') inviaMessaggio();
    };
}

// Messaggio di Benvenuto
addMessage("Ciao! 🌍 Sono **Visito**, il tuo assistente di viaggio. Dimmi qualsiasi città del mondo!", 'bot');