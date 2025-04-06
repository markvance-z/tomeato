// todo.js

//temporary username until database is operational
//const username = "username_test";

// DOM Elements
const habitsList = document.getElementById("habits-list"); // For Habit Tracker
const quoteElement = document.getElementById("motivational-quote");

//Calendar
const calendarHeader = document.getElementById("calendar-header");
const calendarGrid = document.getElementById("calendar-grid");

var calendarTime = new Date();
var calendarDisplay = "month";

// Set date constants for today's date info as well as 7 and
// 30 days from now
const currentDate = new Date();
currentDate.setHours(23, 59, 59, 999);
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

//const weekDate = new Date();
//weekDate.setDate(currentDay + 7);
//weekDate.setHours(23, 59, 59, 999);

//const monthDate = new Date();
//monthDate.setDate(currentDay + 30);
//monthDate.setHours(23, 59, 59, 999);

//temporary todo tasks until database is operational
/*
var widgetData = {
  today: [
    { name: "Task 1", id: new Date().valueOf() + Math.random(), dueDate: currentDate, completed: false },
    { name: "Task 2", id: new Date().valueOf() + Math.random(), dueDate: currentDate, completed: false },
    { name: "Task 3", id: new Date().valueOf() + Math.random(), dueDate: currentDate, completed: false },
    { name: "Task 4", id: new Date().valueOf() + Math.random(), dueDate: currentDate, completed: false },
  ],
  week: [
    { name: "Week Task 1", id: new Date().valueOf() + Math.random(), dueDate: weekDate, completed: false },
    { name: "Week Task 2", id: new Date().valueOf() + Math.random(), dueDate: weekDate, completed: false },
    { name: "Week Task 3", id: new Date().valueOf() + Math.random(), dueDate: weekDate, completed: false },
    { name: "Week Task 4", id: new Date().valueOf() + Math.random(), dueDate: weekDate, completed: false },
  ],
  month: [
    { name: "Month Task 1", id: new Date().valueOf() + Math.random(), dueDate: monthDate, completed: false },
    { name: "Month Task 2", id: new Date().valueOf() + Math.random(), dueDate: monthDate, completed: false },
    { name: "Month Task 3", id: new Date().valueOf() + Math.random(), dueDate: monthDate, completed: false },
    { name: "Month Task 4", id: new Date().valueOf() + Math.random(), dueDate: monthDate, completed: false },
  ],

  habits: [
    {
      name: "Did you drink water today?",
      id: new Date().valueOf() + Math.random(),
      completed: false,
    },
    {
      name: "Did you exercise today?",
      id: new Date().valueOf() + Math.random(),
      completed: false,
    },
    {
      name: "Did you do your XYZ today?",
      id: new Date().valueOf() + Math.random(),
      completed: false,
    },
  ],
};
*/

var widgetIndex = {
  today: 0,
  week: 0,
  month: 0,
  habits: 0,
};

var itemsPerPage = {
  today: 4,
  week: 4,
  month: 2,
  habits: 2,
};

layouts = window.LAYOUTS;
themes = window.THEMES;

/*// Widget Functions
function renderWidget(id, offset) {
  const data = widgetData[id];
  widgetIndex[id] += offset;

  const start = widgetIndex[id] * itemsPerPage[id];
  const end = start + itemsPerPage[id];
  const pageData = data.slice(start, end);

  const backButton = document.getElementById(id + "-back");
  const forwardButton = document.getElementById(id + "-forward");
  if (start === 0) {
    backButton.disabled = true;
  } else {
    backButton.disabled = false;
  }

  if (end >= data.length) {
    forwardButton.disabled = true;
  } else {
    forwardButton.disabled = false;
  }

  if (id === "habits") {
    updateHabits(pageData);
  } else {
    updateTasks(id + "-list", pageData);
  }
}
  */

// Function to render habits in the Habit Tracker widget
/*
function updateHabits(habitsArray) {
  habitsList.innerHTML = "";

  habitsArray.forEach((habit) => {
    const span = document.createElement("span");
    span.textContent = habit.name;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completed;
    checkbox.addEventListener("change", () => toggleHabit(habit.id));

    if (habit.completed) {
      checkbox.checked = true;
      span.style.textDecoration = "line-through";
      span.style.color = "#777"; // Gray out completed habits
    } else {
      checkbox.checked = false;
    }

    const li = document.createElement("li");
    li.appendChild(checkbox);
    li.appendChild(span);

    habitsList.appendChild(li);
  });
}
  
// Function to toggle habit completion
function toggleHabit(habitId) {
  habitTarget = widgetData["habits"].find((habit) => habit.id === habitId);
  habitTarget.completed = !habitTarget.completed;

  renderWidget("habits", 0);

  localStorage.setItem("habits", JSON.stringify(widgetData["habits"]));
}
*/

function setLayout() {
  layout = localStorage.getItem("layout");
  if (layout === "layout-week-calendar") {
    calendarDisplay = "week";
    initCalendar();
  } else {
    calendarDisplay = "month";
    initCalendar();
  }
}

function initCalendar() {
  if (calendarDisplay === "week") {
    weekday = currentDate.getDay();
    dayDiff = currentDate.getDate() - weekday;

    calendarTime = new Date(currentYear, currentMonth, dayDiff);
  } else if (calendarDisplay === "month") {
    calendarTime = new Date(currentYear, currentMonth, 1);
  }

  setCalendar(0);
}

function setCalendar(offset) {
  if (calendarDisplay === "week") {
    calendarTime.setDate(calendarTime.getDate() + offset * 7);

    year = calendarTime.getFullYear();
    month = calendarTime.getMonth();

    lastDay = 7;
    weekday = 0;
  } else if (calendarDisplay === "month") {
    calendarTime.setMonth(calendarTime.getMonth() + offset);
    
    year = calendarTime.getFullYear();
    month = calendarTime.getMonth();

    lastDay = new Date(year, month + 1, 0).getDate();
    weekday = calendarTime.getDay();
  }

  const monthName = calendarTime.toLocaleString('default', {month: 'long'});
  const dateText = monthName + " " + year;

  loadCalendar(weekday, lastDay, dateText);
}

function loadCalendar(weekday, lastDay, dateText) {
  var calendarDateText = document.createElement('h2');
  calendarDateText.innerText = dateText;

  calendarHeader.innerHTML = "";
  calendarHeader.appendChild(calendarDateText);

  calendarGrid.innerHTML = "";
  calendarLoopTime = new Date(calendarTime);
  for (let day = 0; day < lastDay + weekday; day++) {
    const dayCellDiv = document.createElement('div');

    if (day >= weekday) {
      dayCellDiv.className = 'calendar-cell';

      if (calendarLoopTime.toDateString() === currentDate.toDateString()) {
        dayCellDiv.id = "current-day";
      }

      const dayNumberSpan = document.createElement('span');
      dayNumberSpan.className = "day-number";
      dayNumberSpan.textContent = calendarLoopTime.getDate();
      dayCellDiv.appendChild(dayNumberSpan);

      //example code for adding tasts to day (currently adding task icon
      //to current date)
      if (currentDate.toDateString() === calendarLoopTime.toDateString()) {
        const taskDiv = document.createElement('div');
        taskDiv.className = "calendar-task";

        dayCellDiv.appendChild(taskDiv);
      }

      calendarLoopTime.setDate(calendarLoopTime.getDate() + 1);
    }

    calendarGrid.appendChild(dayCellDiv);
  }
}

// Initialization on Page Load
window.addEventListener("DOMContentLoaded", () => {
  // Load Tasks
  //savedPages = ["today", "week", "month", "habits"];
  
  //savedPages.forEach((page) => {
  //  const savedTasks = localStorage.getItem(page);
  //  if (savedTasks) {
      // Parse the JSON string back into an array of tasks
  //    widgetData[page] = JSON.parse(savedTasks);
  //  }

  //  renderWidget(page, 0);
  //});

  setLayout();

  // Initialize quote cycling on window load
  // Start cycling motivational quotes
  cycleQuotes();

  // Apply saved theme
  document.body.classList.add(localStorage.getItem("theme"));
  // Apply saved layout
  document.body.getElementsByClassName("main-content")[0].id = localStorage.getItem("layout");
});


// 6. Motivational Quotes Functionality

// Array of five-word motivational quotes
motivationalQuotes = window.QUOTES;

// Function to cycle through quotes
function cycleQuotes() {
  let quoteIndex = 0;

  // Function to display the next quote
  const showNextQuote = () => {
    // Remove 'visible' class to start fade-out
    quoteElement.classList.remove("visible");

    // After the fade-out transition ends, update the text and fade in
    setTimeout(() => {
      quoteElement.textContent = motivationalQuotes[quoteIndex];
      quoteElement.classList.add("visible");

      // Update index to the next quote, looping back if necessary
      quoteIndex = (quoteIndex + 1) % motivationalQuotes.length;
    }, 1000); // 1000ms matches the CSS transition duration
  };

  // Initially show the first quote
  showNextQuote();

  // Set interval to change quotes every 5 seconds
  setInterval(showNextQuote, 5000);
}
