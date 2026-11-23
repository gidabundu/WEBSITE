(() => {
  const exploreButton = document.querySelector("[data-scroll-to]");
  if (!exploreButton) return;

  exploreButton.addEventListener("click", () => {
    const targetId = exploreButton.getAttribute("data-scroll-to");
    const target = targetId ? document.getElementById(targetId) : null;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    target?.scrollIntoView({ behavior, block: "start" });
  });
})();
