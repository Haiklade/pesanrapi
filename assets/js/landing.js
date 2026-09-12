/* PesanRapi — Landing page: scroll-reveal halus + tab fitur interaktif */

function initScrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (items.length === 0) return;

  const revealAll = () => items.forEach((el) => el.classList.add("reveal-visible"));

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));

  // Safety net: some capture/export tools (and edge cases where the
  // observer never fires for off-screen elements) shouldn't leave
  // content permanently invisible — force-reveal everything shortly after load.
  window.addEventListener("load", () => setTimeout(revealAll, 1800));
}

function initFeatureTabs() {
  const tabs = document.querySelectorAll(".feature-tab");
  const panels = document.querySelectorAll(".feature-tab-visual");
  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === target);
      });
    });
  });
}

initScrollReveal();
initFeatureTabs();
