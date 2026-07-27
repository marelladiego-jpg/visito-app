// api/chat.js (Esegue sul server, NON nel browser)
export default async function handler(req, res) {
  // Prende la chiave dalle variabili d'ambiente del server
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Chiave API non configurata sul server" });
  }

  const { testo } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Sei Visito, un assistente di viaggio esperto." },
          { role: "user", content: testo }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Errore di connessione" });
  }
}