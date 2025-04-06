// habits.js

//=========================
// MAIN FUNCTION FOR
// CREATING LIST ITEMS
//=========================

function createHabitListItem(habit) {
  const li = document.createElement("li");
  li.dataset.habitId = habit.id;
  li.dataset.title = habit.title;
  li.dataset.frequency = habit.frequency;

  //checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = habit.complete;
  checkbox.addEventListener("click", () => {
    habitComplete(habit, li, checkbox);
  });

  //span
  const span = document.createElement("span");
  switch (habit.frequency.toLowerCase()) {
    case "daily": 
      span.textContent =  `Did you ${habit.title} today? Days streak: ${habit.daysComplete}`;
      break;
    case "weekly":
      span.textContent = `Did you ${habit.title} this week? Days streak: ${habit.daysComplete}`;
      break;
    case "monthly":
      span.textContent = `Did you ${habit.title} this month? Days streak: ${habit.daysComplete}`;
      break;
    default:
      span.textContent = `Did you ${habit.title}? Days streak: ${habit.daysComplete}`;
      break;
  };
  
  //edit button
  const editButton = document.createElement("button");
  editButton.textContent = "🖊";
  editButton.addEventListener("click", () => {
    openHabitEdit(habit, li);
  });

  /*//delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑";
  deleteButton.addEventListener("click", async () => {
    if (confirm(`Delete this item? ${habit.title}`)) {
      const success = await deleteHabit(habit.id);
      if (success) {
        li.remove();
      } else {
        alert("error deleting habit from sql server");
      }
    }
  });*/

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editButton);
  //li.appendChild(deleteButton);

  return li;
}


//=========================
// GET HABITS
//=========================

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api.habits");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const habits = await response.json();
    const habitsList = document.getElementById("habits-list");

    habits.forEach((habit) => {
      const li = createHabitListItem(habit);
      habitsList.appendChild(li);
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }
});


//=========================
// ADD HABIT
//=========================

function addHabitWindow() {
  document.getElementById("add-habit").style.display = "block";
}
function closeHabitWindow() {
  document.getElementById("add-habit").style.display = "none";
}

document
  .getElementById("add-habit-button")
  .addEventListener("click", async function(event) {
    event.preventDefault();

    const habitName = document.getElementById("habit-name").value;
    const habitFrequency = document.getElementById("habit-frequency").value;

    const habitData = {
      title: habitName,
      frequency: habitFrequency,
      complete: false,
      habitStreak: 0
    };

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(habitData),
      });

      if (!response.ok) {
        throw new Error("error: api post error");
      }

      const newHabit = await response.json();
      const habitsList = document.getElementById("habits-list");
      const li = createHabitListItem(newHabit);

      habitsList.appendChild(li);
      console.log("Created habit", habitData.title);

    } catch (error) {
      console.error("API error: ", error);
    }

    closeHabitWindow();

});


//=========================
// MODIFY HABIT
//=========================

//edit habit window function
function openHabitEdit(habit, li) {
  const editHabitWindow = document.getElementById("edit-habit");
  editHabitWindow.style.display = "block";
  editHabitWindow.dataset.habitId = li.dataset.habitId;
  editHabitWindow.dataset.title = habit.title;

  const editHabitName = document.getElementById("edit-habit-name");
  const editHabitFrequency = document.getElementById("edit-habit-frequency");
  editHabitName.value = habit.title;
  editHabitFrequency.value = habit.frequency;

}

function closeHabitEditWindow() {
  document.getElementById("edit-habit").style.display = "none";
}

//toggle habit complete function
async function habitComplete(habit, li, checkbox) {
  const updateComplete = !habit.complete;
  const habitId = habit.id;
  const habitTitle = habit.title;
  const habitStreak = habit.daysComplete;

  try {
    const response = await fetch(`/api/habits/${habitId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complete: updateComplete,
        title: habitTitle,
        habitStreak: habitStreak + 1,
        frequency: habit.frequency
      }),
    });

    if (!response.ok) {
      throw new Error("HTTP error: ", response.status);
    }

    habit.complete = updateComplete;
    checkbox.checked = updateComplete;
  } catch (error) {
    console.error("error updating habit complete: ", error);
    checkbox.checked = habit.complete;
  }
}

/*
//function for the edit window button
document.getElementById("editTaskButton").addEventListener("click", async function (event) {
  event.preventDefault();

  const updateTitle = document.getElementById("edit-task-name").value;
  const updateDueDate = document.getElementById("edit-task-due-date").value;
  const complete = document.getElementById("edit-task").dataset.complete;
  const eventId = document.getElementById("edit-task").dataset.eventId;
  const category = document.getElementById("edit-task-category").value;
  const priority = parseInt(document.getElementById("edit-task-priority").value, 10);

  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: updateTitle,
        startDate: updateDueDate,
        complete: complete,
        category: category,
        priority: priority
      })
    });

    if (!response.ok) {
      throw new Error("HTTP error: ", response.status);
    }

    const li = document.querySelector(`li[data-event-id="${eventId}"]`)
    if (li) {
      const span = li.querySelector("span");
      const formatDate = new Intl.DateTimeFormat("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric"
      });
      const formattedDate = formatDate.format(new Date(updateDueDate));
      span.textContent = `${updateTitle} - ${formattedDate}`
    }

    closeEditWindow();
  } catch (error) {
    console.error("Error updating event: ", error);
  }
});
*/
//=========================
// DELETE HABIT
//=========================

/*getElementById("delete-btn").addEventListener("click", async () => {
  if (confirm(`Delete this item? ${habit.title}`)) {
    const success = await deleteHabit(habit.id);
    if (success) {
      li.remove();
    } else {
      alert("error deleting habit from sql server");
    }
  }
});

async function deleteHabit(habit) {
  if (confirm(`Delete this item? ${habit.title}`)) {
    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      li.remove();
      return true;
    } catch (error) {
      console.error("delete failed:", error);
      return false;
    }
  }
}*/

const deleteHabitButton = document.getElementById("deleteHabitButton");
deleteHabitButton.addEventListener("click", async () => {
  const habitId = document.getElementById("edit-habit").dataset.habitId;
  const habitTitle = document.getElementById("edit-habit").dataset.title;
  const li = document.querySelector(`li[data-habit-id="${habitId}"]`);

    if (confirm(`Delete this item? "${habitTitle}"`)) {
      const success = await deleteHabit(habitId);
      if (success) {
        if(li) {
          li.remove();
          closeHabitEditWindow();
        }
        
      } else {
        alert("error deleting habit from sql server");
      }
    }
});

async function deleteHabit(habitId) {
  try {
    const response = await fetch(`/api/habits/${habitId}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return true;
  } catch (error) {
    console.error("delete failed:", error);
    return false;
  }
}
