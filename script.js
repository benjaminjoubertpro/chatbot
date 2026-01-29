const form = document.querySelector("#form");
const firstName = document.querySelector("#firstName");
const age = document.querySelector("#age");
const output = document.querySelector("#output");
const allusers = document.querySelector("#allusers");

const users = [
  { firstName: "Jean", age: 54, statut: "Majeur" },
  { firstName: "Daniel", age: 35, statut: "Majeur" }
];

function cleanFirstName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^./, letter => letter.toUpperCase());
}

function renderUsers() {
  allusers.innerHTML = users
    .map(u => `<li>${u.firstName} — ${u.age} ans (${u.statut})</li>`)
    .join("");
}

renderUsers();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const prenom = cleanFirstName(firstName.value);
  const ageRaw = age.value.trim();
  const ageNumber = Number(ageRaw);

  if (prenom === "") {
    output.textContent = "Tu dois rentrer un nom";
    return;
  }

  if (ageRaw === "") {
    output.textContent = "Tu dois rentrer un âge";
    return;
  }

  if (!Number.isInteger(ageNumber)) {
    output.textContent = "Âge invalide";
    return;
  }

  const statut = ageNumber < 18 ? "Mineur" : "Majeur";

  users.push({ firstName: prenom, age: ageNumber, statut });
  renderUsers();

  output.textContent = `Tu es ${prenom} et tu as ${ageNumber} ans`;
  form.reset();
});

const chatbot = document.querySelector(".chatbot");
const chat = document.querySelector("#chat");
const closeChat = document.querySelector("#close-chat");

chatbot.addEventListener("click", () => {
  chat.classList.add("open");
});

closeChat.addEventListener("click", () => {
  chat.classList.remove("open");
});


const messageZone = document.querySelector(".message-zone");
const textarea = document.querySelector("#chat-zone");
const sendBtn = document.querySelector("#submit-chat");

function addMessage(text, type) {
  const message = document.createElement("div");
  message.classList.add(type === "user" ? "message-user" : "message-bot");

  const p = document.createElement("p");
  p.textContent = text;

  message.appendChild(p);
  messageZone.appendChild(message);

  messageZone.scrollTop = messageZone.scrollHeight;
}


sendBtn.addEventListener("click", async () => {
  const text = textarea.value.trim();
  if (!text) return;

  addMessage(text, "user");
  textarea.value = "";

  // appel IA
  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  addMessage(data.reply, "bot");
});



textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

// Gestion déroulement du textarea

const MAX_LINES = 8;
const LINE_HEIGHT = 22; // à ajuster selon ton CSS

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

