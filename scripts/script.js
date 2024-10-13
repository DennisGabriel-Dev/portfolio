const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.isIntersecting ? entry.target.classList.add("show") : entry.target.classList.remove("show")
  })
})

const elements = document.querySelectorAll('.hidden')

elements.forEach( element => observer.observe(element))
options = {
  "cursorOuter": "circle-basic",
  "hoverEffect": "pointer-blur",
  "hoverItemMove": false,
  "defaultCursor": true,
  "outerWidth": 30,
  "outerHeight": 30
};
