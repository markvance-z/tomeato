document.addEventListener("DOMContentLoaded", function () {
  console.log("Pomodoro script loaded.");
  // Apply saved font
  document.body.style.fontFamily = localStorage.getItem("font");

  // Timer durations (in seconds) for testing
  let pomodoroTime = 25;
  let shortBrTime = 5;
  let longBrTime = 15;
  let totalLoops = 4;

  let loopNum = 0;
  let timeLeft;
  let timer;
  let isRunning = false;
  let currentMode = "Pomodoro";
  let currentTotalTime = pomodoroTime;

  // =========================
  //  SESSION STATS VARIABLES
  // =========================
  let pomodorosCompletedToday = 0;
  let focusTimeToday = 0; // in minutes

  // Update stats UI
  function updateStatsUI() {
    document.getElementById("pomodoros-completed").textContent = pomodorosCompletedToday;
    document.getElementById("focus-time-today").textContent = focusTimeToday;
  }

  // For example, after each Pomodoro completes, increment stats
  function onPomodoroComplete() {
    pomodorosCompletedToday++;
    // 25 minutes is the normal length of a Pomodoro
    // For real usage, you'd track actual durations; this is an example
    focusTimeToday += 25;
    updateStatsUI();
  }

  // Clear stats button
  const clearStatsBtn = document.getElementById("clear-stats-btn");
  clearStatsBtn.addEventListener("click", function() {
    pomodorosCompletedToday = 0;
    focusTimeToday = 0;
    updateStatsUI();
  });

  // Get ring selection dropdown, test button, and volume slider
  const ringSelect = document.getElementById("ring-select");
  const testRingBtn = document.getElementById("test-ring-btn");
  const ringVolumeSlider = document.getElementById("ring-volume");
  let testAudio = null;

  // Setup progress ring
  const progressCircle = document.querySelector(".progress-ring__circle");
  const radius = progressCircle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = circumference;

  // Set Timer function: sets timer duration based on mode
  function setTimer(seconds, mode) {
    clearInterval(timer);
    timeLeft = seconds;
    currentTotalTime = seconds;
    currentMode = mode;
    isRunning = false;
    updateUI();
    updateTheme(mode);
    console.log(`Mode set to: ${mode}`);
  }

  // Start Timer function
  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      timer = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateUI();
        } else {
          playSelectedRing();

          // Timer completed, check currentMode
          if (currentMode === "Pomodoro") {
            // We completed a Pomodoro, increment stats
            onPomodoroComplete();

            loopNum++;
            if (loopNum === totalLoops) {
              loopNum = 0;
              setTimer(longBrTime, "Long Break");
            } else {
              setTimer(shortBrTime, "Short Break");
            }
          } else {
            setTimer(pomodoroTime, "Pomodoro");
          }
          startTimer();
        }
      }, 1000);
    }
  }

  // Pause Timer function
  function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
  }

  // Reset Timer now resets to the starting time for the current mode
  function resetTimer() {
    clearInterval(timer);
    if (currentMode === "Pomodoro") {
      setTimer(pomodoroTime, "Pomodoro");
    } else if (currentMode === "Short Break") {
      setTimer(shortBrTime, "Short Break");
    } else if (currentMode === "Long Break") {
      setTimer(longBrTime, "Long Break");
    }
  }

  // Update Timer UI and progress ring
  function updateUI() {
    document.getElementById("timer").innerText = formatTime(timeLeft);
    document.getElementById("status").innerText =
      currentMode === "Pomodoro" ? "Time to focus!" : "Take a break!";
    const fraction = timeLeft / currentTotalTime;
    const offset = circumference * (1 - fraction);
    progressCircle.style.strokeDashoffset = offset;
  }

  // Format seconds to MM:SS
  function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Update theme based on mode using background classes and update button colors
  function updateTheme(mode) {
    const body = document.body;
    body.classList.remove("bg-pomodoro", "bg-short", "bg-long");
    if (mode === "Pomodoro") {
      body.classList.add("bg-pomodoro");
    } else if (mode === "Short Break") {
      body.classList.add("bg-short");
    } else if (mode === "Long Break") {
      body.classList.add("bg-long");
    }

    const modeButtons = document.querySelectorAll(".modes button");
    const controlButtons = document.querySelectorAll(".controls button");
    let btnColor, btnHoverColor;
    if (mode === "Pomodoro") {
      btnColor = "#D96C5F";
      btnHoverColor = "#C95A4E";
    } else if (mode === "Short Break") {
      btnColor = "#4CAF50";  // Green
      btnHoverColor = "#45A049";
    } else if (mode === "Long Break") {
      btnColor = "#2196F3";  // Blue
      btnHoverColor = "#1976D2";
    }
    modeButtons.forEach((btn) => {
      btn.style.backgroundColor = btnColor;
      btn.onmouseover = () => (btn.style.backgroundColor = btnHoverColor);
      btn.onmouseout = () => (btn.style.backgroundColor = btnColor);
    });
    controlButtons.forEach((btn) => {
      btn.style.backgroundColor = btnColor;
      btn.onmouseover = () => (btn.style.backgroundColor = btnHoverColor);
      btn.onmouseout = () => (btn.style.backgroundColor = btnColor);
    });
  }

  // Play selected ring when timer ends
  function playSelectedRing() {
    const selectedRing = ringSelect.value;
    const audio = new Audio("../" + selectedRing);
    audio.volume = ringVolumeSlider.value;
    audio.play();
  }

  // Attach event listeners to control buttons
  document.getElementById("start-btn").addEventListener("click", startTimer);
  document.getElementById("pause-btn").addEventListener("click", pauseTimer);
  document.getElementById("reset-btn").addEventListener("click", resetTimer);
  document.getElementById("pomodoro-btn").addEventListener("click", () => setTimer(pomodoroTime, "Pomodoro"));
  document.getElementById("short-break-btn").addEventListener("click", () => setTimer(shortBrTime, "Short Break"));
  document.getElementById("long-break-btn").addEventListener("click", () => setTimer(longBrTime, "Long Break"));

  // Initialize timer with Pomodoro mode
  setTimer(pomodoroTime, "Pomodoro");

  // Test Ring functionality
  testRingBtn.addEventListener("click", function () {
    if (testAudio) {
      testAudio.pause();
      testAudio = null;
    }
    testAudio = new Audio("../" + ringSelect.value);

    testAudio.volume = ringVolumeSlider.value;
    testAudio.play();
    testAudio.onended = function () {
      testAudio = null;
    };
  });

  // Volume slider updates test audio volume in real time
  ringVolumeSlider.addEventListener("input", function () {
    if (testAudio) {
      testAudio.volume = ringVolumeSlider.value;
    }
  });

  // Initialize stats UI
  updateStatsUI();
});
