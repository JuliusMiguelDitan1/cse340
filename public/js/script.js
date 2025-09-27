// public/js/script.js
document.addEventListener("DOMContentLoaded", () => {
  // === Password Toggle ===
  const toggleBtn = document.getElementById("togglePassword");
  if (toggleBtn) {
    const wrapper = toggleBtn.closest(".password-wrapper") || document;
    const passwordInput = wrapper.querySelector("input");

    if (passwordInput) {
      toggleBtn.type = "button";
      if (!toggleBtn.textContent.trim()) toggleBtn.textContent = "Show";

      toggleBtn.addEventListener("click", function () {
        const showing = passwordInput.type === "text";
        passwordInput.type = showing ? "password" : "text";
        this.textContent = showing ? "👁" : "🙈";
        this.setAttribute("aria-pressed", showing ? "false" : "true");
        this.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      });
    } else {
      console.warn("password input not found inside .password-wrapper");
    }
  } else {
    console.warn("togglePassword button not found");
  }

  // === Classification Form Validation ===
  const addClassificationForm = document.getElementById("addClassificationForm");
  if (addClassificationForm) {
    addClassificationForm.addEventListener("submit", (e) => {
      const input = document.getElementById("classification_name");
      const regex = /^[A-Za-z0-9]+$/;
      if (!regex.test(input.value)) {
        e.preventDefault();
        alert("Classification name must not contain spaces or special characters.");
        input.focus();
      }
    });
  } else {
    console.warn("addClassificationForm not found");
  }

  // === Inventory Form Validation ===
  const addInventoryForm = document.getElementById("addInventoryForm");
  if (addInventoryForm) {
    addInventoryForm.addEventListener("submit", (e) => {
      const requiredFields = ["inv_make", "inv_model", "inv_year", "inv_price", "inv_miles", "inv_color"];
      for (const field of requiredFields) {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
          e.preventDefault();
          alert(`${field} is required`);
          input.focus();
          return false;
        }
      }
    });
  } else {
    console.warn("addInventoryForm not found");
  }
});
