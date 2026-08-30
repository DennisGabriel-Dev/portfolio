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

const cursor = document.querySelector(".cursor");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (cursor && canHover && !reduceMotion) {
  let mouseX = 0;
  let mouseY = 0;
  let x = 0;
  let y = 0;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.classList.add("is-on");
  });

  document.addEventListener("mouseover", (event) => {
    const overLink = event.target.closest("a, button");
    cursor.classList.toggle("is-hover", Boolean(overLink));
  });

  function follow() {
    x += (mouseX - x) * 0.2;
    y += (mouseY - y) * 0.2;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  }

  follow();
}

const query = new URLSearchParams(location.search).get("lang");
const saved = localStorage.getItem(STORAGE_KEY);
const initial = query === "pt" || query === "en" ? query : saved;
if (initial === "pt" || initial === "en") {
  setLang(initial);
}
