window.onload = function () {
  console.log("Window loaded, running Journal.js...");

  /* ---------------------------
     1. TOGGLE BUTTONS: Journal vs. Notes
  ---------------------------- */
  const journalBtn = document.getElementById("journal-btn");
  const notesBtn = document.getElementById("notes-btn");
  const journalSection = document.getElementById("journal-section");
  const notesSection = document.getElementById("notes-section");

  journalBtn.addEventListener("click", function () {
    journalSection.style.display = "block";
    notesSection.style.display = "none";
    journalBtn.classList.add("active");
    notesBtn.classList.remove("active");
  });

  notesBtn.addEventListener("click", function () {
    journalSection.style.display = "none";
    notesSection.style.display = "block";
    notesBtn.classList.add("active");
    journalBtn.classList.remove("active");
    loadNotes();
  });

  /* ---------------------------
     2. JOURNAL SECTION
  ---------------------------- */
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  let currentImageData = "";

  function formatDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatDateDisplay(dateObj) {
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  }

  function loadEntryForDate(dateObj) {
    const key = formatDateKey(dateObj);
    document.getElementById("journal-title").value =
      localStorage.getItem("journalTitle_" + key) || "";
    document.getElementById("journal-text").value =
      localStorage.getItem("journalEntry_" + key) || "";

    currentImageData = localStorage.getItem("journalImage_" + key) || "";
    const imagePreview = document.getElementById("image-preview");
    imagePreview.innerHTML = currentImageData
      ? `<img src="${currentImageData}" alt="Journal Image">`
      : "";
  }

  function saveEntryForDate(dateObj) {
    const key = formatDateKey(dateObj);
    localStorage.setItem(
      "journalTitle_" + key,
      document.getElementById("journal-title").value
    );
    localStorage.setItem(
      "journalEntry_" + key,
      document.getElementById("journal-text").value
    );
    localStorage.setItem("journalImage_" + key, currentImageData);
  }

  function updateJournalUI() {
    document.getElementById("journal-date").textContent = formatDateDisplay(currentDate);
    loadEntryForDate(currentDate);
  }

  updateJournalUI();

  document.getElementById("save-journal").addEventListener("click", function () {
    saveEntryForDate(currentDate);
    playPencilAnimation();
  });

  // File input for the journal image
  const imageInput = document.getElementById("journal-image-input");
  if (imageInput) {
    imageInput.addEventListener("change", function () {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          currentImageData = e.target.result;
          document.getElementById("image-preview").innerHTML = `<img src="${currentImageData}" alt="Journal Image">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // -----------------------------
  // NEW CODE: REMOVE IMAGE BUTTON
  // -----------------------------
  // This section defines the behavior for when the user clicks the "Remove Image" button.
  // It clears the file input, resets the in-memory image data, clears the preview, and updates localStorage.
  const removeImageBtn = document.getElementById("remove-image-btn");
  if (removeImageBtn) {
    removeImageBtn.addEventListener("click", function () {
      // Clear the file input value
      if (imageInput) {
        imageInput.value = "";
      }
      // Clear the in-memory image data variable
      currentImageData = "";
      // Clear the image preview area (so no image is displayed)
      document.getElementById("image-preview").innerHTML = "";
      // Save the updated entry to localStorage (reflecting that no image is present)
      saveEntryForDate(currentDate);
    });
  }

  /* ---------------------------
     3. MINI-CALENDAR FUNCTIONALITY
  ---------------------------- */
  const dateNav = document.querySelector(".date-nav");
  dateNav.addEventListener("click", function () {
    const miniCalendar = document.getElementById("mini-calendar");
    if (!miniCalendar) return;
    if (miniCalendar.style.display === "none" || miniCalendar.style.display === "") {
      miniCalendar.style.display = "block";
      populateMiniCalendar();
    } else {
      miniCalendar.style.display = "none";
    }
  });

  function populateMiniCalendar() {
    const miniCalGrid = document.getElementById("mini-calendar-grid");
    if (!miniCalGrid) return;
    miniCalGrid.innerHTML = "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = firstDayOfMonth.getDay();

    // Fill empty cells before the 1st
    for (let i = 0; i < startDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("mini-calendar-day", "empty");
      miniCalGrid.appendChild(emptyCell);
    }
    // Create day cells
    for (let day = 1; day <= lastDay; day++) {
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayCell = document.createElement("div");
      dayCell.textContent = day;
      dayCell.classList.add("mini-calendar-day");
      // Highlight if this is the currently selected date
      if (cellDate.getTime() === currentDate.getTime()) {
        dayCell.classList.add("selected");
      }
      // Grey out future dates (relative to today's date)
      if (cellDate > today) {
        dayCell.classList.add("disabled");
      } else {
        dayCell.addEventListener("click", function () {
          currentDate = new Date(cellDate);
          updateJournalUI();
          document.getElementById("mini-calendar").style.display = "none";
        });
      }
      miniCalGrid.appendChild(dayCell);
    }
    document.getElementById("mini-calendar-title").textContent =
      new Date(currentDate.getFullYear(), currentDate.getMonth()).toLocaleString(
        "default",
        { month: "long", year: "numeric" }
      );
  }

  /* ---------------------------
     4. NOTES SECTION (Text Only)
  ---------------------------- */
  function loadNotes() {
    document.getElementById("notes-title").value =
      localStorage.getItem("notesTitle") || "";
    document.getElementById("notes-textarea").value =
      localStorage.getItem("notesContent") || "";
  }

  function saveNotes() {
    localStorage.setItem("notesTitle", document.getElementById("notes-title").value);
    localStorage.setItem("notesContent", document.getElementById("notes-textarea").value);
  }

  document.getElementById("save-notes").addEventListener("click", function () {
    saveNotes();
    playPencilAnimation();
  });

  /* ---------------------------
     5. PENCIL ANIMATION FUNCTION
  ---------------------------- */
  function playPencilAnimation() {
    const pencilVideo = document.getElementById("pencil-animation");
    if (pencilVideo) {
      pencilVideo.style.display = "block";
      pencilVideo.currentTime = 0;
      pencilVideo.play();
      pencilVideo.onended = function () {
        pencilVideo.style.display = "none";
      };
    }
  }

  // Default view: Show Journal; hide Notes
  journalSection.style.display = "block";
  notesSection.style.display = "none";
  if (
    document.getElementById("journalNotesSwitch") &&
    document.getElementById("journalNotesSwitch").checked
  ) {
    journalSection.style.display = "none";
    notesSection.style.display = "block";
    loadNotes();
  }
};