const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items


// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

let updateOnLoad = false;

// Drag Functionality
let draggedItem;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((name, index) =>{
    localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]))
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, columnIndex, item, itemIndex) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.id = itemIndex;
  listEl.textContent = item;
  listEl.draggable =  true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.setAttribute("onfocusout", `updateItem(${itemIndex},${columnIndex})`);
  listEl.contentEditable = true;
  columnEl.appendChild(listEl);
}

function filterArray (array){
  return array.filter(item => item !== "")
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM  ()  {
  // Check localStorage once
  if(!updateOnLoad){
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray = filterArray(backlogListArray);
  backlogListArray.forEach((backlogItem, index) =>{
    createItemEl(backlogList, 0, backlogItem, index);
  })
  // Progress Column
  progressList.textContent = "";
  progressListArray = filterArray(progressListArray);
  progressListArray.forEach((progressItem, index) =>{
    createItemEl(progressList, 1, progressItem, index);
  });

  // Complete Column
  completeList.textContent = "";
  completeListArray = filterArray(completeListArray);
  completeListArray.forEach((completeItem, index) =>{
    createItemEl(completeList, 2, completeItem, index);
  });

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray = filterArray(onHoldListArray);
  onHoldListArray.forEach((onHoldItem, index) =>{
    createItemEl(onHoldList, 3, onHoldItem, index);
  })

  // Run getSavedColumns only once, Update Local Storage
  updateOnLoad = true;
  updateSavedColumns();
}

function updateItem(itemIndex, columnIndex){
  const selectedArray = listArrays[columnIndex];
  const selectedItemEl = Array.from(itemLists[columnIndex].children)[itemIndex];
  const itemText = selectedItemEl.textContent;
  if (!dragging){
    if (itemText !== null){
      selectedArray[itemIndex] = itemText;
    }
    else{
      delete selectedArray[itemIndex];
    }
    updateDOM();
  }
  
}
  
function rebuildArrays(){
  backlogListArray = Array.from(backlogList.children).map(item => item.textContent);

  progressListArray = Array.from(progressList.children).map(item => item.textContent);

  completeListArray = Array.from(completeList.children).map(item => item.textContent);

  onHoldListArray = Array.from(onHoldList.children).map(item => item.textContent);

  updateDOM();
}

function drag(e){
  draggedItem = e.target;
  dragging = true;
}

function allowDrop(e){
  e.preventDefault();
}

function dragEnter(columnIndex){
  itemLists[columnIndex].classList.add("over");
}

function drop(e, columnIndex){
  e.preventDefault();
  let columnEl = itemLists[columnIndex];
  columnEl.appendChild(draggedItem);
  itemLists.forEach(column => column.classList.remove("over"));
  dragging = false;
  rebuildArrays();
}

function addItem(columnIndex){
  let selectedArray = listArrays[columnIndex];
  let newItem = addItems[columnIndex].textContent;
  if(newItem !== "" || newItem !== " "){
    selectedArray.push(newItem);
    addItems[columnIndex].textContent = "";
    updateSavedColumns();
    updateDOM();
  }
}

function showInputBox(columnIndex){
  let addBtn = addBtns[columnIndex];
  let saveBtn = saveItemBtns[columnIndex];
  let container = addItemContainers[columnIndex];
  addBtn.style.visibility = "hidden";
  saveBtn.style.display = "flex";
  container.style.display = "flex";
}

function hideInputBox(columnIndex){
  let addBtn = addBtns[columnIndex];
  let saveBtn = saveItemBtns[columnIndex];
  let container = addItemContainers[columnIndex];
  addBtn.style.visibility = "visible";
  saveBtn.style.display = "none";
  container.style.display = "none";
  addItem(columnIndex);
}

updateDOM();

