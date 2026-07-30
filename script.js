// OGGETTO DI STATO - Memorizza le risposte dell'utente
const userData = {
    destinazione: '',
    trasporto: '',
    compagni: [],
    giorni: '',
    interessi: [],
    esigenze: ''
};

// NAVIGAZIONE TRA LE SLIDE
function nextSlide(slideNumber) {
    // Nascondi tutte le slide
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));

    // Mostra la slide richiesta
    const targetSlide = document.getElementById(`slide-${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');
    }
}

// CONFEMA DESTINAZIONE (Slide 4)
function confirmDestination() {
    const input = document.getElementById('destinazione');
    const val = input.value.trim();

    if (!val) {
        alert('Per favore, inserisci una destinazione prima di proseguire!');
        return;
    }

    userData.destinazione = val;
    nextSlide(5);
}

// SELEZIONE SINGOLA (es. Trasporto)
function selectSingle(element, category) {
    const parentGrid = element.parentElement;
    const cards = parentGrid.querySelectorAll('.option-card');
    
    cards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    userData[category] = element.textContent.trim();
}

// SELEZIONE MULTIPLA ILLIMITATA (es. Con chi andrai)
function toggleMulti(element) {
    element.classList.toggle('selected');
    
    const text = element.textContent.trim();
    const index = userData.compagni.indexOf(text);

    if (index > -1) {
        userData.compagni.splice(index, 1);
    } else {
        userData.compagni.push(text);
    }
}

// SELEZIONE MULTIPLA CON LIMITE MASSIMO 4 (Slide 8 - Interessi)
function toggleMaxFour(element) {
    const text = element.textContent.trim();
    const isSelected = element.classList.contains('selected');

    if (!isSelected) {
        // Verifica quanti interessi sono già stati selezionati
        if (userData.interessi.length >= 4) {
            alert('Puoi selezionare al massimo 4 interessi!');
            return;
        }
        element.classList.add('selected');
        userData.interessi.push(text);
    } else {
        element.classList.remove('selected');
        const index = userData.interessi.indexOf(text);
        if (index > -1) {
            userData.interessi.splice(index, 1);
        }
    }
}

// AD BREAK & SCENARIO FINALE
function startAdBreak() {
    // Salva i giorni e le esigenze
    const giorniInput = document.getElementById('giorni').value;
    const esigenzeInput = document.getElementById('esigenze').value;

    userData.giorni = giorniInput || '3';
    userData.esigenze = esigenzeInput;

    // Passa alla slide Ad Break (Pubblicità)
    nextSlide('ad');

    // Timer di 10 secondi per il prototipo (può essere impostato a 20-30s in produzione)
    setTimeout(() => {
        showFinalItinerary();
    }, 10000);
}

// GENERAZIONE ITINERARIO FINALE (DEMO)
function showFinalItinerary() {
    const appContainer = document.querySelector('.app-container');
    
    // HTML per la schermata finale con itinerario e widget chat
    appContainer.innerHTML = `
        <div class="slide active" style="justify-content: flex-start; overflow-y: auto; text-align: left;">
            <div class="content" style="align-items: flex-start;">
                <h2>Il tuo viaggio a <span class="highlight">${userData.destinazione}</span> ✈️</h2>
                <p><strong>Durata:</strong> ${userData.giorni} giorni | <strong>Interessi:</strong> ${userData.interessi.join(', ') || 'Generali'}</p>
                
                <div style="background: rgba(255,255,255,0.15); width: 100%; padding: 15px; border-radius: 16px; margin-top: 10px;">
                    <h3>☀️ Meteo Previsto</h3>
                    <p style="font-size: 0.9rem; margin-top: 5px;">Soleggiato, 22°C - Condizioni ideali per le tue attività all'aperto!</p>
                </div>

                <div style="background: rgba(255,255,255,0.1); width: 100%; padding: 15px; border-radius: 16px; margin-top: 10px;">
                    <h3>📍 Giorno 1 - Introduzione e Cultura</h3>
                    <p style="font-size: 0.9rem; margin-top: 5px;">Mattina: Esplorazione del centro storico e visita ai punti principali.<br>Pomeriggio: Relax e degustazione prodotti locali.<br>Sera: Cena in ristorante tipico.</p>
                </div>

                <!-- WIDGET CHAT AI INTEGRATO -->
                <div style="margin-top: 20px; width: 100%;">
                    <h3>💬 Chiedi a Visito AI</h3>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <input type="text" class="custom-input" placeholder="Es. Consigliami un ristorante senza glutine..." style="font-size: 0.9rem; padding: 12px 16px;">
                        <button class="btn-primary" style="width: auto; padding: 12px 20px; margin: 0;">Invia</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}