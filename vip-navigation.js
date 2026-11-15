const menuIcon = '<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const closeIcon = '<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const moonIcon = '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.2 15.1A8.6 8.6 0 0 1 8.9 3.8 8.8 8.8 0 1 0 20.2 15.1Z"/></svg>';
const sunIcon = '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>';

document.querySelectorAll("[data-nav-toggle]").forEach((toggle) => {
  const header = toggle.closest("header");
  const navigation = header.querySelector("nav");

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    toggle.innerHTML = open ? closeIcon : menuIcon;
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setOpen(false);
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) setOpen(false);
  });
});

const themeButton = document.getElementById("themeToggle");

function applyTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark-mode", isDark);

  if (themeButton) {
    themeButton.innerHTML = (isDark ? sunIcon : moonIcon) +
      `<span>${isDark ? "Light Mode" : "Dark Mode"}</span>`;
    themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
    themeButton.setAttribute("aria-pressed", String(isDark));
  }
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme") || localStorage.getItem("gg-theme");
} catch (error) {
  console.warn("Could not read the saved theme preference.", error);
}
applyTheme(savedTheme === "dark");

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    applyTheme(isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      localStorage.setItem("gg-theme", isDark ? "dark" : "light");
    } catch (error) {
      console.warn("Could not save the theme preference.", error);
    }
  });
}

window.addEventListener("storage", (event) => {
  if (event.key === "theme" || event.key === "gg-theme") {
    applyTheme(event.newValue === "dark");
  }
});
