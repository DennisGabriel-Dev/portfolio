const STORAGE_KEY = "lang";

function setLang(lang) {
  const htmlLang = lang === "pt" ? "pt-BR" : "en";
  document.documentElement.lang = htmlLang;

  document.querySelectorAll("[data-lang-btn]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.langBtn === lang));
  });

  localStorage.setItem(STORAGE_KEY, lang);
}

document.querySelectorAll("[data-lang-btn]").forEach((button) => {
  button.addEventListener("click", () => setLang(button.dataset.langBtn));
});

const query = new URLSearchParams(location.search).get("lang");
const saved = localStorage.getItem(STORAGE_KEY);
const initial = query === "pt" || query === "en" ? query : saved;
if (initial === "pt" || initial === "en") {
  setLang(initial);
}
