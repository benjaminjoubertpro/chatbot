/* =========================
   OUVERTURE / FERMETURE CHAT
========================= */

const chatbot = document.querySelector(".chatbot");
const chat = document.querySelector("#chat");
const closeChat = document.querySelector("#close-chat");

chatbot.addEventListener("click", () => {
  chat.classList.add("open");
});

closeChat.addEventListener("click", () => {
  chat.classList.remove("open");
});


/* =========================
   ZONE DE MESSAGES
========================= */

const messageZone = document.querySelector(".message-zone");
const textarea = document.querySelector("#chat-zone");
const sendBtn = document.querySelector("#submit-chat");


/* =========================
   AJOUT MESSAGE USER
========================= */

function addUserMessage(text) {
  const message = document.createElement("div");
  message.classList.add("message-user");

  const p = document.createElement("p");
  p.textContent = text;

  message.appendChild(p);
  messageZone.appendChild(message);
  messageZone.scrollTop = messageZone.scrollHeight;
}


/* =========================
   AJOUT MESSAGE BOT (VIDE)
========================= */

function createBotMessage() {
  const message = document.createElement("div");
  message.classList.add("message-bot");

  const p = document.createElement("p");
  message.appendChild(p);

  messageZone.appendChild(message);
  messageZone.scrollTop = messageZone.scrollHeight;

  return p;
}


/* =========================
   ECRITURE PROGRESSIVE DU BOT
========================= */

function typeMessage(text, element, speed = 20) {
  let index = 0;

  const interval = setInterval(() => {
    element.textContent += text[index];
    index++;

    if (index >= text.length) {
      clearInterval(interval);
    }
  }, speed);
}


/* =========================
   ENVOI MESSAGE
========================= */

sendBtn.addEventListener("click", async () => {
  const text = textarea.value.trim();
  if (!text) return;

  // message utilisateur
  addUserMessage(text);

  // reset textarea
  textarea.value = "";
  textarea.style.height = "auto";
  textarea.style.overflowY = "hidden";

  // message bot "en attente"
  const botParagraph = createBotMessage();
  botParagraph.textContent = "Le bot écrit…";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    // on efface le texte "Le bot écrit…"
    botParagraph.textContent = "";

    // écriture progressive
    typeMessage(data.reply, botParagraph);

  } catch (error) {
    botParagraph.textContent = "Erreur du serveur.";
  }
});


/* =========================
   ENVOI AVEC ENTREE
========================= */

textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});


/* =========================
   AUTO-RESIZE TEXTAREA
========================= */

const MAX_LINES = 8;
const LINE_HEIGHT = 22;

textarea.addEventListener("input", () => {
  textarea.style.height = "auto";

  const maxHeight = LINE_HEIGHT * MAX_LINES;

  if (textarea.scrollHeight <= maxHeight) {
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.style.overflowY = "hidden";
  } else {
    textarea.style.height = maxHeight + "px";
    textarea.style.overflowY = "auto";
  }
});
