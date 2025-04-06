document.addEventListener("DOMContentLoaded", function () {
    const themeSelect = document.getElementById("theme-select");
    const body = document.body;

    // Load saved theme or default to root
    let savedTheme = localStorage.getItem("selectedTheme") || "root";

    // If "jing-theme" was saved, convert it to "lilac-theme"
    if (savedTheme === "jing-theme") {
        savedTheme = "lilac-theme";
        localStorage.setItem("selectedTheme", "lilac-theme");
    }

    // ✅ Apply theme immediately when the page loads
    body.className = "";
    body.classList.add(savedTheme);
    themeSelect.value = savedTheme;

    // ✅ Apply theme switching functionality
    themeSelect.addEventListener("change", function () {
        body.classList.remove("green-theme", "purple-theme", "lilac-theme", "light-theme", "root");
        const newTheme = this.value;
        body.classList.add(newTheme);
        localStorage.setItem("selectedTheme", newTheme);
    });

    // ✅ Fix: Ensure the theme applies properly even if the button is not clicked
    setTimeout(() => {
        body.classList.add(savedTheme);
    }, 100);

    // ✅ Modal Functionality
    const signupModal = document.getElementById("signup-modal");
    const openModalButton = document.getElementById("openSignupModal");
    const closeModalButton = signupModal ? signupModal.querySelector(".close") : null;

    function openSignupModal() {
        if (signupModal) signupModal.style.display = "flex";
    }

    function closeSignupModal() {
        if (signupModal) signupModal.style.display = "none";
    }

    if (openModalButton) openModalButton.addEventListener("click", openSignupModal);
    if (closeModalButton) closeModalButton.addEventListener("click", closeSignupModal);
    window.addEventListener("click", function (event) {
        if (signupModal && event.target === signupModal) closeSignupModal();
    });
});
