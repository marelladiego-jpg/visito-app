// OGGETTO DI STATO - Memorizza le risposte dell'utente
const userData = {
    destinazione: '',
    trasporto: '',
    compagni: [],
    giorni: '',
    interessi: [],
    esigenze: ''
};

// NAVIGAZIONE TRA LE SLIDE CON BARRA DI AVANZAMENTO
function nextSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));

    const targetSlide = document.getElementById(`slide-${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');
    }

    // Aggiorna la barra di avanzamento in alto
    const totalSlides = 9;
    const progressPercent = typeof slideNumber === 'number' ? (slideNumber / totalSlides) * 100 : 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
}

// CONFEMA DESTINAZIONE (Slide 4)
function confirmDestination() {
    const input = document.getElementById('destinazione');
    const val = input ? input.value.trim() : '';

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
    const giorniInput = document.getElementById('giorni');
    const esigenzeInput = document.getElementById('esigenze');

    userData.giorni = giorniInput ? giorniInput.value : '3';
    userData.esigenze = esigenzeInput ? esigenzeInput.value : '';

    nextSlide('ad');

    setTimeout(() => {
        showFinalItinerary();
    }, 10000);
}

// GENERAZIONE ITINERARIO FINALE (DEMO)
function showFinalItinerary() {
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;
    
    appContainer.innerHTML = `
        <div class="slide active" style="justify-content: flex-start; overflow-y: auto; text-align: left; padding-top: 30px;">
            <div class="content" style="align-items: flex-start; margin: 0;">
                <h2>Il tuo viaggio a <span class="highlight">${userData.destinazione}</span> ✈️</h2>
                <p><strong>Durata:</strong> ${userData.giorni} giorni | <strong>Interessi:</strong> ${userData.interessi.join(', ') || 'Generali'}</p>
                
                <div style="background: rgba(255,255,255,0.15); width: 100%; padding: 15px; border-radius: 16px; margin-top: 10px;">
                    <h3>☀️ Meteo Previsto</h3>
                    <p style="font-size: 0.9rem; margin-top: 5px;">Soleggiato, 22°C - Condizioni ideali per le tue attività!</p>
                </div>

                <div style="background: rgba(255,255,255,0.1); width: 100%; padding: 15px; border-radius: 16px; margin-top: 10px;">
                    <h3>📍 Giorno 1 - Introduzione e Cultura</h3>
                    <p style="font-size: 0.9rem; margin-top: 5px;">Mattina: Centro storico.<br>Pomeriggio: Prodotti locali.<br>Sera: Cena tipica.</p>
                </div>

                <div style="margin-top: 20px; width: 100%;">
                    <h3>💬 Chiedi a Visito AI</h3>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <input type="text" class="custom-input" placeholder="Es. Consigliami un ristorante..." style="font-size: 0.9rem; padding: 12px 16px;">
                        <button class="btn-primary" style="width: auto; padding: 12px 20px; margin: 0;">Invia</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}