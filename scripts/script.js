const STORAGE_KEY = "lang";
const THEME_KEY = "theme";

function isDarkTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function syncThemeButton() {
  const button = document.querySelector("[data-theme-btn]");
  if (!button) return;

  const dark = isDarkTheme();
  const pt = document.documentElement.lang === "pt-BR";
  button.setAttribute("aria-pressed", String(dark));
  button.setAttribute(
    "aria-label",
    dark
      ? pt ? "Ativar tema claro" : "Switch to light theme"
      : pt ? "Ativar tema escuro" : "Switch to dark theme"
  );
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem(THEME_KEY, theme);
  syncThemeButton();
}

function toggleTheme(event) {
  const next = isDarkTheme() ? "light" : "dark";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !document.startViewTransition) {
    applyTheme(next);
    return;
  }

  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  document.documentElement.classList.add("is-theme-vt");
  const transition = document.startViewTransition(() => applyTheme(next));

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 560,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }).catch(() => {});

  transition.finished.finally(() => {
    document.documentElement.classList.remove("is-theme-vt");
  });
}

function setLang(lang) {
  const htmlLang = lang === "pt" ? "pt-BR" : "en";
  document.documentElement.lang = htmlLang;

  document.querySelectorAll("[data-lang-btn]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.langBtn === lang));
  });

  localStorage.setItem(STORAGE_KEY, lang);
  syncThemeButton();
}

document.querySelectorAll("[data-lang-btn]").forEach((button) => {
  button.addEventListener("click", () => setLang(button.dataset.langBtn));
});

document.querySelector("[data-theme-btn]")?.addEventListener("click", toggleTheme);

function showJob(id) {
  document.querySelectorAll("[data-job-tab]").forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.dataset.jobTab === id));
  });

  document.querySelectorAll("[data-job-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.jobPanel !== id;
  });
}

document.querySelectorAll("[data-job-tab]").forEach((button) => {
  button.addEventListener("click", () => showJob(button.dataset.jobTab));
});

const jobQuery = new URLSearchParams(location.search).get("job");
if (jobQuery === "novosaque" || jobQuery === "classepay") {
  showJob(jobQuery);
}

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

syncThemeButton();
