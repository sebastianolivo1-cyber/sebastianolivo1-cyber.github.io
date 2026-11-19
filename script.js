const themePreferenceKey = "sebastian-olivo-theme";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function readThemePreference() {
  try {
    const preference = window.localStorage.getItem(themePreferenceKey);
    return preference === "light" || preference === "dark" ? preference : null;
  } catch (error) {
    console.warn("Unable to read the saved theme preference.", error);
    return null;
  }
}

function saveThemePreference(theme) {
  try {
    window.localStorage.setItem(themePreferenceKey, theme);
  } catch (error) {
    console.warn("Unable to save the theme preference.", error);
  }
}

let savedTheme = readThemePreference();

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.content = theme === "dark" ? "#242321" : "#f5f3ee";
  }

  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

applyTheme(savedTheme || (systemTheme.matches ? "dark" : "light"));

systemTheme.addEventListener("change", (event) => {
  if (!savedTheme) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const copyrightYear = document.querySelector("#copyright-year");
  const themeToggle = document.querySelector(".theme-toggle");

  applyTheme(document.documentElement.dataset.theme);

  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      savedTheme = nextTheme;
      applyTheme(nextTheme);
      saveThemePreference(nextTheme);
    });
  }

  if (navToggle && navLinks) {
    const closeMenu = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("is-open", !isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }
});
