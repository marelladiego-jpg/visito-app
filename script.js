// Variabile per tracciare la slide attuale
let currentSlide = 1;

// Oggetto dove salviamo tutte le risposte dell'utente
let userData = {
  destinazione: "",
  mezzo: "",
  alloggio: "",
  date: { inizio: "", fine: "" },
  budget: "",
  ritmo: "",
  interessi: [],
  obiettivi: "",
  esigenze: ""
};

// Funzione per mostrare la slide corretta
function showSlide(index) {
  document.querySelectorAll('.slide').forEach(slide => {
    slide.classList.remove('active');
  });

  let targetSlide = document.getElementById(`slide-${index}`);
  if (targetSlide) {
    targetSlide.classList.add('active');
    currentSlide = index;
  }
}

// Funzione per andare alla slide successiva
function nextSlide() {
  // Raccogliamo i dati dai campi di testo prima di passare avanti
  saveCurrentInputData();
  
  currentSlide++;
  
  // Se arriviamo alla slide 14, generiamo il riepilogo
  if (currentSlide === 14) {
    generateItinerarySummary();
  }
  
  showSlide(currentSlide);
}

// Salva i dati inseriti nei form di testo
function saveCurrentInputData() {
  let dest = document.getElementById('destinazione-input');
  if (dest && dest.value) userData.destinazione = dest.value;

  let dStart = document.getElementById('date-start');
  let dEnd = document.getElementById('date-end');
  if (dStart && dEnd) {
    userData.date.inizio = dStart.value;
    userData.date.fine = dEnd.value;
  }

  let budget = document.getElementById('budget-input');
  if (budget && budget.value) userData.budget = budget.value;

  let obj = document.getElementById('obiettivi-input');
  if (obj && obj.value) userData.obiettivi = obj.value;

  let esig = document.getElementById('esigenze-input');
  if (esig && esig.value) userData.esigenze = esig.value;
}

// Gestione del CLICK e DOPPIO CLICK sulle schede con immagini
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.card-option').forEach(button => {
    
    // Al click singolo: evidenzia la scelta
    button.addEventListener('click', function() {
      let parent = this.closest('.options-grid');
      
      // Se non è una slide a selezione multipla (es. interessi)
      if (currentSlide !== 11) {
        parent.querySelectorAll('.card-option').forEach(btn => btn.style.borderColor = 'transparent');
      }
      
      this.style.borderColor = '#007bff';
    });

    // Al DOPPIO CLICK: salva la scelta e passa alla slide successiva!
    button.addEventListener('dblclick', function() {
      let val = this.getAttribute('data-value');
      console.log("Scelta salvata:", val);
      nextSlide();
    });

  });

  // Gestione invio messaggi nella chat della Slide 14
  let sendBtn = document.getElementById('send-chat-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendChatMessage);
  }
});

// Mostra il riepilogo nell'ultima slide
function generateItinerarySummary() {
  let box = document.getElementById('itinerary-result');
  if (box) {
    box.innerHTML = `
      <h3>🚀 Il tuo viaggio per ${userData.destinazione || 'la tua destinazione'}</h3>
      <p><strong>Budget:</strong> ${userData.budget ? userData.budget + '€' : 'Non specificato'}</p>
      <p><strong>Date:</strong> dal ${userData.date.inizio || '-'} al ${userData.date.fine || '-'}</p>
      <p><em>Visito sta elaborando le migliori tappe e opzioni per te...</em></p>
    `;
  }
}

// Simulatore di Chat interattiva con Visito
function sendChatMessage() {
  let input = document.getElementById('chat-input');
  let chatBox = document.getElementById('chat-messages');

  if (input && input.value.trim() !== "") {
    let userMsg = document.createElement('p');
    userMsg.innerHTML = `<strong>Tu:</strong> ${input.value}`;
    chatBox.appendChild(userMsg);

    let visitoMsg = document.createElement('p');
    visitoMsg.style.color = '#007bff';
    visitoMsg.innerHTML = `<strong>Visito:</strong> Ricevuto! Sto modificando l'itinerario in base alla tua richiesta: "${input.value}"`;
    
    setTimeout(() => {
      chatBox.appendChild(visitoMsg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);

    input.value = "";
  }
}