const themes = window.THEMES;
const layouts = window.LAYOUTS;
const fonts = window.FONTS;
let quotes = [];
let checkedQuotes = [];

preload();

window.addEventListener("load", () => {
    quotesLoad();
    updateQuotes();
    cycleQuotes();
  });

  function preload() {
    // Apply saved theme
    document.body.classList.add(localStorage.getItem("theme"));
    // Apply saved font
    document.body.style.fontFamily = localStorage.getItem("font");


    // Generate divs/buttons for settings selection
    // Layouts
    const layoutMenu = document.getElementById("layouts");
    for (let layout of layouts) {
      const layoutSelection = document.createElement("div");
      layoutSelection.classList.add("layout-selection");
      const layoutBody = document.createElement("div");
      layoutBody.classList.add("layout-body");
      layoutSelection.appendChild(layoutBody);
      layoutBody.id = layout;

      const dummyCalendar = document.createElement("div");
      dummyCalendar.id = "calendar";
      dummyCalendar.textContent = "calendar";
      layoutBody.appendChild(dummyCalendar);
      const dummyToday = document.createElement("div");
      dummyToday.id = "today";
      dummyToday.textContent = "tdy";
      layoutBody.appendChild(dummyToday);
      const dummyWeek = document.createElement("div");
      dummyWeek.id = "week";
      dummyWeek.textContent = "week";
      layoutBody.appendChild(dummyWeek);
      const dummyMonth = document.createElement("div");
      dummyMonth.id = "month";
      dummyMonth.textContent = "mnth";
      layoutBody.appendChild(dummyMonth);
      const dummyHabits = document.createElement("div");
      dummyHabits.id = "habits";
      dummyHabits.textContent = "hbts";
      layoutBody.appendChild(dummyHabits);

      if (layout === localStorage.getItem("layout")) {
        layoutSelection.id = "selected-layout";
      }

      layoutSelection.addEventListener("click", () => {
        setLayout(layout);
        document.getElementById("selected-layout").removeAttribute("id");
        layoutSelection.id = "selected-layout";
      });

      layoutMenu.appendChild(layoutSelection);
    }

    // Themes
    const themeMenu = document.getElementById("themes");
    const colorFetcher = document.createElement("div"); // will inherit the colors of the themes without updating the screen
    colorFetcher.style.display = "none";
    document.head.appendChild(colorFetcher); // add to head so it is not visible
    for (let theme of themes) {
      const themeSelection = document.createElement("div");
      themeSelection.classList.add("theme-selection");
      
      // retrieve 4 significant colors from the theme
      // will fetch background, text, primary, and secondary colors
      colorFetcher.className = theme;
      const backgroundColor = getComputedStyle(colorFetcher).getPropertyValue('--bg-color');
      const textColor = getComputedStyle(colorFetcher).getPropertyValue('--text-color');
      const primaryColor = getComputedStyle(colorFetcher).getPropertyValue('--primary-color');
      const secondaryColor = getComputedStyle(colorFetcher).getPropertyValue('--secondary-color');
      const buttonColor = getComputedStyle(colorFetcher).getPropertyValue('--button-bg-color');
      
      const backgroundDiv = document.createElement('div');
      backgroundDiv.style.backgroundColor = backgroundColor;
      const textColorDiv = document.createElement('div');
      textColorDiv.style.backgroundColor = textColor;
      const primaryDiv = document.createElement('div');
      primaryDiv.style.backgroundColor = primaryColor;
      const secondaryDiv = document.createElement('div');
      secondaryDiv.style.backgroundColor = secondaryColor;

      //themeSelection.textContent = "text";

      if (theme === localStorage.getItem("theme")) {
        themeSelection.id = "selected-theme";
      }
      themeSelection.addEventListener("click", () => {
        setTheme(theme);
        document.getElementById("selected-theme").removeAttribute("id");
        themeSelection.id = "selected-theme";
      });

      themeMenu.appendChild(themeSelection);
      themeSelection.appendChild(secondaryDiv);
      themeSelection.appendChild(primaryDiv);
      themeSelection.appendChild(textColorDiv);
      themeSelection.appendChild(backgroundDiv);
    }

    // Fonts
    const fontsMenu = document.getElementById("fonts");
    for (let font of fonts) {
      const fontSelection = document.createElement("div");
      fontSelection.classList.add("font-selection");
      fontSelection.textContent = "Tasty Pomodoro!";
      fontSelection.style.fontFamily = font;

      if (font === localStorage.getItem("font")) {
        fontSelection.id = "selected-font";
      }

      fontSelection.addEventListener("click", () => {
        setFont(font);
        document.getElementById("selected-font").removeAttribute("id");
        fontSelection.id = "selected-font";
      });

      fontsMenu.appendChild(fontSelection);
    }
  }

  function setLayout(layout) {
    localStorage.setItem("layout", layout);
  }

  function setTheme(theme) {
    const body = document.body;
    localStorage.setItem("theme", theme);
    // remove the current theme
    for (let t of themes) {
      body.classList.remove(t);
    }
    body.classList.add(theme);
  }

  function setFont(font) {
    localStorage.setItem("font", font);
    document.body.style.fontFamily = font;
  }

function quotesLoad() {
  checkedQuotes = localStorage.getItem('checkedQuotes');
  console.log("checked quotes: " + checkedQuotes);
  const quoteMenu = document.getElementById("quotes");
  const quoteOptions = quoteMenu.children;
  for (let option of quoteOptions) {
    option = option.children[0];
    if (checkedQuotes != null && checkedQuotes.includes(option.value)) {
      option.checked = true;
    }
    option.addEventListener("change", () => {
      updateQuotes();
    });
  }
}

function updateQuotes() {
  checkedQuotes = [];
  quotes = [];
  const quoteMenu = document.getElementById("quotes");
  const quoteOptions = quoteMenu.children;
  for (let option of quoteOptions) {
    option = option.children[0];
    if (option.checked) {
      checkedQuotes.push(option.value);
      quotes = quotes.concat(window[option.value]);
    }
  }
  if (quotes.length <= 0) {
    quotes.push('Select a quote pack.');
  } else {
    shuffleArray(quotes);
  }
  localStorage.setItem("checkedQuotes", checkedQuotes);
}

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

  function cycleQuotes() {
  const quoteElement = document.getElementById("motivational-quote");
    let quoteIndex = 0;
  
    // Function to display the next quote
    const showNextQuote = () => {
      // Remove 'visible' class to start fade-out
      quoteElement.classList.remove("visible");
  
      // After the fade-out transition ends, update the text and fade in
      setTimeout(() => {
        quoteElement.textContent = quotes[quoteIndex];
        quoteElement.classList.add("visible");
  
        // Update index to the next quote, looping back if necessary
        quoteIndex = (quoteIndex + 1) % quotes.length;
      }, 1000); // 1000ms matches the CSS transition duration
    };
  
    // Initially show the first quote
    showNextQuote();
  
    // Set interval to change quotes every 5 seconds
    setInterval(showNextQuote, 5000);
  }
  