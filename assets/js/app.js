const showPriorities = document.querySelector(".show-priority-menu");
const priorityMenu = document.querySelector(".priority-menu");
const downIcon = document.querySelector(".down-icon");
const dropIcon = document.querySelector(".drop-icon");
const items = document.querySelectorAll(".items");
const ul = document.querySelector(".ul");
showPriorities.addEventListener("click", function () {
  togglePriority();
});
dropIcon.addEventListener("click", function () {
  togglePriority();
});

function togglePriority() {
  const priorityHeight = priorityMenu.getBoundingClientRect().height;
  const ulHeight = ul.getBoundingClientRect().height;
  if (priorityHeight <= 20) {
    priorityMenu.style.height = `${ulHeight + 20}px`;
    priorityMenu.style.visibility = "visible";
    document.querySelector(".table-wrapper").style.display = "none";
  } else {
    priorityMenu.style.height = 0;
    priorityMenu.style.visibility = "hidden";
    document.querySelector(".table-wrapper").style.display = "block";
  }
  downIcon.classList.toggle("fa-angle-up");
  items.forEach((item) => {
    item.addEventListener("click", function (e) {
      const itemText = this.innerText;
      showPriorities.style.color = "#212529";
      downIcon.classList.remove("fa-angle-up");
      showPriorities.value = itemText;
      priorityMenu.style.height = 0;
      priorityMenu.style.visibility = "hidden";
    });
  });
}
// todo functionality
// getting classes
const enterTask = document.querySelector("#enter-task");
const addTask = document.querySelector(".add-btn");
addTask.addEventListener("click", function () {
  const taskValue = enterTask.value;
  const priorityValue = showPriorities.value;

  if (taskValue.trim() === "") {
    enterTask.style.backgroundColor = "red";
  } else {
    enterTask.style.backgroundColor = "#E9ECEF";
    let itemsArr = [];
    const getItems = localStorage.getItem("task"); // json string
    if (getItems === null) {
      itemsArr = [];
    } else {
      itemsArr = JSON.parse(getItems); // Convert json string to javascript object
    }

    itemsArr.push({ task: taskValue, priority: priorityValue });

    localStorage.setItem("task", JSON.stringify(itemsArr)); // Convert javascript object to json string
    // localStorage.removeItem("task"); // Remove
    displayItems();
    getCompletedItems();
    getPendingItems();
    enterTask.value = "";
    showPriorities.value = "Regular";
    showPriorities.style.color = "#ADB5BD";
  }
});
displayItems();
getPendingItems();

// display items
function displayItems() {
  let itemsContainer = document.querySelector(".items-container");
  const getItems = localStorage.getItem("task"); // json string
  if (getItems === null) {
    itemsArr = [];
  } else {
    itemsArr = JSON.parse(getItems); // Convert json string to javascript object
  }

  document.querySelector(".items-lenght").textContent = itemsArr.length;
  let itemsList = "";
  itemsArr.forEach((item, index) => {
    let priorityClass = "";
    let lineClass = "";
    if (item.priority === "Important") {
      priorityClass = "priority-important";
    } else if (item.priority === "Less Important") {
      priorityClass = "priority-less-important";
    }
    if (item.completed) {
      lineClass = "line-through";
    }
    let editIcon = "";
    if (!item.completed) {
      editIcon = `<i class="fa-solid fa-pen-to-square edit" onclick="editItem(${index})"></i>`;
    }

    itemsList += `
                            <tr class="item-data">
                          <td class="${priorityClass} ${lineClass}">${item.task}</td>
                          <td class="${priorityClass}">${item.priority}</td>
                          <td>
                            ${editIcon}
                              <i class="fa-sharp fa-solid fa-trash delete" onclick="deleteItem(${index})"></i>
                              <i class="fa-sharp fa-solid fa-circle-check completed" onclick="completedItem(${index})"></i>
                          </td>
                      </tr>
      `;
  });
  itemsContainer.innerHTML = itemsList;

  localStorage.setItem("task", JSON.stringify(itemsArr)); // Convert javascript object to json string
}

// filtering tasks
// Nav links
const navLinks = document.querySelectorAll(".nav-links");
const tableContainer = document.querySelector(".table-container");
const tableBodyContainer = document.querySelectorAll(".items-container");
tableContainer.addEventListener("click", function (e) {
  const dataId = e.target.dataset.id;
  if (dataId) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      e.target.classList.add("active");
    });
    tableBodyContainer.forEach((content) => {
      content.classList.remove("active-items");
      // console.log(content)
    });
  }
  const contentElement = document.getElementById(dataId);
  contentElement.classList.add("active-items");
  if (contentElement.classList.contains("active-items")) {
    getCompletedItems();
    getPendingItems();
  }
});

const hiddenTask = document.querySelector(".hidden-task");
const save = document.querySelector(".save");
// const edit = document.querySelector(".edit");
// edit item
function editItem(index) {
  const getItems = localStorage.getItem("task"); // json string
  itemsArr = JSON.parse(getItems); // Convert json string to javascript object
  // hiddshowPrioritiesenTask.value = 1;
  hiddenTask.value = index;
  enterTask.style.backgroundColor = "#212529";
  showPriorities.style.backgroundColor = "#212529";
  enterTask.style.color = "#E9ECEF";
  showPriorities.style.color = "#E9ECEF";
  addTask.style.display = "none";
  save.style.display = "block";
  enterTask.value = itemsArr[index].task;
  showPriorities.value = itemsArr[index].priority;
}

save.addEventListener("click", function (e) {
  e.preventDefault();
  const getItems = localStorage.getItem("task"); // json string
  itemsArr = JSON.parse(getItems); // Convert json string to javascript object

  enterTask.style.backgroundColor = "#E9ECEF";
  showPriorities.style.backgroundColor = "#E9ECEF";
  enterTask.style.color = "#ADB5BD";
  showPriorities.style.color = "#212529";
  addTask.style.display = "block";
  save.style.display = "none";


  itemsArr[hiddenTask.value].task = enterTask.value;
  itemsArr[hiddenTask.value].priority = showPriorities.value;
  // Remove completed item from completed items array
  localStorage.setItem("task", JSON.stringify(itemsArr)); // Convert javascript object to json string
  displayItems();
  getCompletedItems();
  getPendingItems();
  enterTask.value = "";
  showPriorities.value = "";
});

// completed tasks
function completedItem(index) {
  itemsArr[index].completed = true;
  localStorage.setItem("task", JSON.stringify(itemsArr)); // save to local storage
  displayItems();
  getCompletedItems();
}

// delete items
function deleteItem(index) {
  itemsArr.splice(index, 1);
  localStorage.setItem("task", JSON.stringify(itemsArr)); // Convert javascript object to json string
  displayItems();
  getCompletedItems();
  getPendingItems();
}

// clear all items
const clearItems = document.querySelector(".clear");
clearItems.addEventListener("click", function () {
  itemsArr = [];
  localStorage.setItem("task", JSON.stringify(itemsArr)); // Convert javascript object to json string
  displayItems();
  getCompletedItems();
  getPendingItems();
});

// completed items
function getCompletedItems() {
  let itemsContainer = document.querySelector(".h");
  const getItems = localStorage.getItem("task"); // json string
  if (getItems === null) {
    itemsArr = [];
  } else {
    itemsArr = JSON.parse(getItems); // Convert json string to javascript object
  }

  let itemsList = "";
  itemsArr.forEach((item, index) => {
    let priorityClass = "";
    let lineClass = "";
    if (item.priority === "Important") {
      priorityClass = "priority-important";
    } else if (item.priority === "Less Important") {
      priorityClass = "priority-less-important";
    }
    if (item.completed) {
      lineClass = "line-through";
    }
    if (item.completed) {
      itemsList += `
                              <tr class="item-data">
                            <td class="${priorityClass} ${lineClass}">${item.task}</td>
                            <td class="${priorityClass}">${item.priority}</td>
                            <td>
                                <i class="fa-sharp fa-solid fa-trash delete" onclick="deleteItem(${index})"></i>
                            </td>
                        </tr>
        `;
    }
  });
  itemsContainer.innerHTML = itemsList;

  localStorage.setItem("task", JSON.stringify(itemsArr)); // Convert javascript object to json string
}

// pending items
function getPendingItems() {
  let itemsContainer = document.querySelector(".b");
  const getItems = localStorage.getItem("task"); // json string
  if (getItems === null) {
    itemsArr = [];
  } else {
    itemsArr = JSON.parse(getItems); // Convert json string to javascript object
  }

  let filteredItems = itemsArr;

  let itemsList = "";
  itemsArr.forEach((item, index) => {
    let priorityClass = "";
    let lineClass = "";
    if (item.priority === "Important") {
      priorityClass = "priority-important";
    } else if (item.priority === "Less Important") {
      priorityClass = "priority-less-important";
    }
    if (item.completed) {
      lineClass = "line-through";
    }
    if (!item.completed) {
      itemsList += `
                              <tr class="item-data">
                            <td class="${priorityClass} ${lineClass}">${item.task}</td>
                            <td class="${priorityClass}">${item.priority}</td>
                            <td>
                              <i class="fa-solid fa-pen-to-square edit" onclick="editItem(${index})"></i>
                                <i class="fa-sharp fa-solid fa-trash delete" onclick="deleteItem(${index})"></i>
                              <i class="fa-sharp fa-solid fa-circle-check completed" onclick="completedItem(${index})"></i>
                            </td>
                        </tr>
        `;
    }
  });
  itemsContainer.innerHTML = itemsList;

  localStorage.setItem("task", JSON.stringify(itemsArr)); // Convert javascript object to json string
  getCompletedItems();
}
