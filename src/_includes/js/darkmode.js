// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem("darkMode");

const darkModeToggle = document.querySelector("#dark-mode-toggle");

const enableDarkMode = () => {
  applyDarkMode();
  localStorage.setItem("darkMode", "enabled");
};

const applyDarkMode = () => {
  document.querySelector("html").classList.add("dark-mode");
};

const disableDarkMode = () => {
  document.querySelector("html").classList.remove("dark-mode");
  localStorage.setItem("darkMode", "disabled");
};

if (darkMode === "enabled") {
  enableDarkMode();
} else if (
  !darkMode &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  applyDarkMode();
}
darkModeToggle.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode");
  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});
