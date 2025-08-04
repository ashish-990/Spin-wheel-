// Telegram support with prefilled text
function openTelegramWithText(){
  const issue = encodeURIComponent(document.getElementById("supportInput")?.value || "Mujhe help chahiye");
  window.location.href = `https://t.me/Freefiremxdealer?text=${issue}`;
}
document.getElementById("goSupport")?.addEventListener("click", e => {
  e.preventDefault();
  openTelegramWithText();
});
document.getElementById("supportInput")?.addEventListener("keypress", e => {
  if (e.key === "Enter") openTelegramWithText();
});
document.getElementById("supportBtn")?.addEventListener("click", () => {
  openTelegramWithText();
});
