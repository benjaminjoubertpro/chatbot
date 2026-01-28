const express = require("express");
const path = require("path");

const app = express();

/* Middleware */
app.use(express.json());
app.use(express.static(__dirname));

/* Route chat → IA */
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Message vide." });
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3",
        prompt: userMessage,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ reply: data.response });

  } catch (error) {
    console.error(error);
    res.json({ reply: "Erreur côté serveur." });
  }
});

/* Lancement serveur */
app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
