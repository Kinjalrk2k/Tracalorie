/**
 * Storage Controller
 */
const StorageCtrl = (function () {
  // public methods
  return {
    storeItem: function (item) {
      let items;
      // check if any itesm in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        // push the new item
        items.push(item);
        // set ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // get stuufs from ls
        items = JSON.parse(localStorage.getItem("items"));

        // Push the new item
        items.push(item);

        // reset ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

/**
 * Item Controller
 */
const ItemCtrl = (function () {
  // constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // data structure or state
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // public methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      // create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // calories to number
      calories = parseInt(calories);

      // create new item
      const newItem = new Item(ID, name, calories);

      // add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;

      // loop through items
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      // calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function (id) {
      // get ids
      ids = data.items.map((item) => {
        return item.id;
      });

      // get the index
      const index = ids.indexOf(id);

      // remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });

      // set total to data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

/**
 * UI Controller
 */
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  // public methods
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;
      });

      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // show list
      document.querySelector(UISelectors.itemList).style.display = "block";

      // create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listitems = document.querySelectorAll(UISelectors.listItems);

      // turn nodelist to array
      listitems = Array.from(listitems);

      listitems.forEach((listItem) => {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);

      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach((item) => {
        item.remove();
      });
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

/**
 * App Controller
 */
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // load events listeners
  const loadEventListeners = function () {
    // getting UI selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

    // diable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13 || e.code === "Enter") {
        e.preventDefault();
        return false;
      }
    });

    // edit icon click
    document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

    // update item event
    document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

    // back button event
    document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);

    // delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

    // clear all items event
    document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
  };

  // add item submit
  const itemAddSubmit = function (e) {
    // get from input from UI constroller
    const input = UICtrl.getItemInput();

    // check for inputs not empty
    if (input.name !== "" && input.calories !== "") {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // add item to UI
      UICtrl.addListItem(newItem);

      // get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localeStorage
      StorageCtrl.storeItem(newItem);

      // clear the fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  // click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // get the list item id
      const listId = e.target.parentNode.parentNode.id;

      // break into an array
      const listIdArr = listId.split("-");

      // get actual id
      const id = parseInt(listIdArr[1]);

      // get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  // item update submit
  const itemUpdateSubmit = function (e) {
    // get item input
    input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI
    UICtrl.updateListItem(updatedItem);

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update ls
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  const itemDeleteSubmit = function (e) {
    // get id from current item
    const currentItem = ItemCtrl.getCurrentItem();

    // delete from data struture
    ItemCtrl.deleteItem(currentItem.id);

    // delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // delete from ls
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // clear items event
  const clearAllItemsClick = function () {
    // delete all items from data structure
    ItemCtrl.clearAllItems();

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    // remove from UI
    UICtrl.removeItems();

    // clear from ls
    StorageCtrl.clearItemsFromStorage();

    // hide UL
    UICtrl.hideList();
  };

  // public methods
  return {
    init: function () {
      // set initial state
      UICtrl.clearEditState();

      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // populate list with items
        UICtrl.populateItemList(items);
      }

      // get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// initialize app
App.init();
