
document.addEventListener("click", function (event) {
  var checkbox = document.getElementById("checkbox");
  if (event.target !== checkbox) {
    checkbox.checked = false;
  }
});

//opening and closing of filters
function openfilter(key, dwn, up) {
  document.getElementById(dwn).style.display = "none";
  document.getElementById(up).style.display = "block";
  document.getElementById(key).style.display = "block";
  document.getElementById(key).style.transform = "translateX(0px)";
}
function closefilter(key, dwn, up) {
  document.getElementById(up).style.display = "none";
  document.getElementById(dwn).style.display = "block";
  document.getElementById(key).style.display = "none";
  document.getElementById(key).style.transform = "translateX(-680px)";
}

function toggleCategory(cat, clickedElement) {

  const menuItems = document.querySelectorAll('.veg-nonveg');
  menuItems.forEach(item => {
    item.style.background = 'white';
    item.style.color = 'rgb(26, 65, 81)';
  });
  // Toggle background color and text color
  clickedElement.style.background = 'rgb(26, 65, 81)';
  clickedElement.style.color = 'white';


  if (cat === 'veg') {
    let elms = document.querySelectorAll('.fooditem-list')

    for (let i = 0; i < elms.length; i++) {
      if (elms[i].style.color === 'white') {
        console.log(elms[i].id)
        // let newcategory = elms[i].id + "_" + cat;
        let newcategory = [elms[i].id, cat];
        console.log(newcategory, newcategory[0]);
        category(newcategory, newcategory[0])
      }
    }

  } else if (cat === 'nonveg') {
    let elms = document.querySelectorAll('.fooditem-list')

    for (let i = 0; i < elms.length; i++) {
      if (elms[i].style.color === 'white') {
        // let newcategory = elms[i].id + "_" + cat;
        let newcategory = [elms[i].id, cat];
        console.log(newcategory, newcategory[0]);
        category(newcategory, newcategory[0])
      }
    }
  }
}

const menuRef = firebase.database().ref("foodItems2");
// Initial loading of items
menuRef.on("value", function (snapshot) {
  
  document.getElementById('Food').style.background = " rgb(26, 65, 81)";
  document.getElementById('Food').style.color = " white";
  clearpresentitems(); // Clear existing items before displaying new ones
  snapshot.forEach(function (child) {
    child.forEach(function (child2) {
      const menuItem2 = child2.val();
      const category = "Food"; //pendinggggggg
      displayMenuItems(menuItem2, category);
    });
  });
});


let categoryList = document.getElementById("menu-list");

menuRef.on("value", function(snapshot) {
  let data = snapshot.val();

  

  for (let categoryName in data) {
    if (data.hasOwnProperty(categoryName)) {
      let li = document.createElement("li");
      li.className = "fooditem-list";
      li.id = categoryName;
      li.textContent = categoryName;
      
      // Attach the click event handler
      li.onclick = function() {
        category(categoryName, li.id);
      };

      categoryList.appendChild(li);
    }
  }
});


function category(category, clickedElement) {
  // console.log(category);
  let flag = 0;
  const menuItems = document.querySelectorAll('.fooditem-list');
  menuItems.forEach(item => {
    item.style.background = 'white';
    item.style.color = 'rgb(26, 65, 81)';
    if (item.id === clickedElement) {
      console.log(clickedElement);
      document.getElementById(clickedElement).style.background = 'rgb(26, 65, 81)';
      document.getElementById(clickedElement).style.color = 'white';
      flag = 1;
    }
  });
  // Highlight the clicked menu item
  if (flag === 0) {
    clickedElement.style.background = 'rgb(26, 65, 81)';
    clickedElement.style.color = 'white';

  }


  menuRef.on("value", function (snapshot) {
    clearpresentitems(); // Clear existing items before displaying new ones
    snapshot.forEach(function (child) {
      if (category === child.key || category[0] === child.key) {
        child.forEach(function (child2) {
          const menuItem2 = child2.val();
          displayMenuItems(menuItem2, category);
        });
      } else if (category === "Food" || category[0] === "Food") {
        child.forEach(function (child2) {
          const menuItem2 = child2.val();
          displayMenuItems(menuItem2, category);
        });
      }
    });
  });
}

function displayMenuItems(menuItem, category) {
  const imagedisplay = document.getElementById("fooditems-display");
 

  

  const itemDiv = document.createElement("div");
  itemDiv.className = "food-item";
  

  const uniqueInputId = generateUniqueInputId(menuItem.foodName);

  
  let Cat;
  if (document.getElementById("veg").style.color === "white") {
    // console.log("in");
    Cat = "veg";
  } else if (document.getElementById("nonveg").style.color === "white") {
    // console.log("in-non");
    Cat = "nonveg";
    
  }
  // console.log(Cat);
  if (Cat === menuItem.vegNonVeg ) {
    itemDiv.innerHTML = `
    
      ${menuItem.vegNonVeg === "veg"
        ? `
        <img src="../Images/vegetarian.png" alt="no_img"  id="veg-nonveg" width="10vw"><br>
      `
        : `
        <img src="../Images/non-vegetarian.png" alt="no_img"  id="veg-nonveg"><br>
      `
      }
    
    <h2 id="food-Name">${menuItem.foodName}</h2>
    <h4 >Rs.<span id="price">${menuItem.cost}</span> </h4>
    <p id="description">Count:${menuItem.quantity}</p>
    <span id="qty">Quantity:</span>
    <div class="quantity">
        <button class="minus" onclick="minus('${uniqueInputId}')">-</button>
        <input type="number" class="input-box" id="${uniqueInputId}" value="1" min="1" max="10">
        <button class="plus" onclick="plus('${uniqueInputId}')">+</button>
    </div>
    ${menuItem.quantity > 0
        ? `<button id="add" onclick="add('${menuItem.foodName}','${menuItem.displayCategory}', ${menuItem.cost}, '${uniqueInputId}')" 
          ${menuItem.quantity <= 0 ? 'disabled' : ''}>Add</button><br>`
        : ''
      }
`;

    // Apply styling if quantity is less than 1
    if (menuItem.quantity <= 0) {
      itemDiv.style.backgroundColor = 'rgba(118, 117, 117, 0.733)';
      itemDiv.style.filter = 'grayscale(100%)'; // Convert to black and white
    }

    // Append the item div to the container
    imagedisplay.appendChild(itemDiv);

  } else if (Cat === menuItem.vegNonVeg ) {
    console.log(menuItem.vegNonVeg);
    itemDiv.innerHTML = `
    
      ${menuItem.vegNonVeg === "veg"
        ? `
        <img src="../Images/vegetarian.png" alt="no_img"  id="veg-nonveg" width="10vw"><br>
      `
        : `
        <img src="../Images/non-vegetarian.png" alt="no_img"  id="veg-nonveg"><br>
      `
      }
    
    <h2 id="food-Name">${menuItem.foodName}</h2>
    <h4 >Rs.<span id="price">${menuItem.cost}</span> </h4>
    <p id="description">Count:${menuItem.quantity}</p>
    <span id="qty">Quantity:</span>
    <div class="quantity">
        <button class="minus" onclick="minus('${uniqueInputId}')">-</button>
        <input type="number" class="input-box" id="${uniqueInputId}" value="1" min="1" max="10">
        <button class="plus" onclick="plus('${uniqueInputId}')">+</button>
    </div>
    ${menuItem.quantity > 0
        ? `<button id="add" onclick="add('${menuItem.foodName}','${menuItem.displayCategory}', ${menuItem.cost}, '${uniqueInputId}')" 
          ${menuItem.quantity <= 0 ? 'disabled' : ''}>Add</button><br>`
        : ''
      }
`;

    // Apply styling if quantity is less than 1
    if (menuItem.quantity <= 0) {
      itemDiv.style.backgroundColor = 'rgba(118, 117, 117, 0.733)';
      itemDiv.style.filter = 'grayscale(100%)'; // Convert to black and white
    }

    // Append the item div to the container
    imagedisplay.appendChild(itemDiv);

  }
  else if (category === "Food" || Cat === undefined) {
    itemDiv.innerHTML = `
      ${menuItem.vegNonVeg === "veg"
        ? `<img src="../Images/vegetarian.png" alt="no_img" id="veg-nonveg" width="10vw"><br>`
        : `<img src="../Images/non-vegetarian.png" alt="no_img" id="veg-nonveg"><br>`
      }
      <h2 id="food-Name">${menuItem.foodName}</h2>
      <h4>Rs.<span id="price">${menuItem.cost}</span></h4>
      <p id="description">Count:${menuItem.quantity}</p>
      <span id="qty">Quantity:</span>
      <div class="quantity">
          <button class="minus" onclick="minus('${uniqueInputId}')">-</button>
          <input type="number" class="input-box" id="${uniqueInputId}" value="1" min="1" max="10">
          <button class="plus" onclick="plus('${uniqueInputId}')">+</button>
      </div>
      ${menuItem.quantity > 0
        ? `<button id="add" onclick="add('${menuItem.foodName}','${menuItem.displayCategory}', ${menuItem.cost}, '${uniqueInputId}')" 
            ${menuItem.quantity <= 0 ? 'disabled' : ''}>Add</button><br>`
        : ''
      }
`;

    // Apply styling if quantity is less than 1
    if (menuItem.quantity <= 0) {
      itemDiv.style.backgroundColor = 'rgba(118, 117, 117, 0.733)';
      itemDiv.style.filter = 'grayscale(100%)';
    }

    // Append the item div to the container
    imagedisplay.appendChild(itemDiv);

  }

  
}

function clearpresentitems() {
  const imagedisplay = document.getElementById("fooditems-display");
  imagedisplay.innerHTML = "";

  
}

function minus(uniqueInputId) {
  const inputField = document.getElementById(uniqueInputId);
  let value = parseInt(inputField.value);
  if (value > 1) {
    value--;
    inputField.value = value;
  }
}

function plus(uniqueInputId) {
  const inputField = document.getElementById(uniqueInputId);
  let value = parseInt(inputField.value);
  if (value < 10) {
    value++;
    inputField.value = value;
  }
}



let fooditemcount = JSON.parse(localStorage.getItem("fooditemcount"))|| [];

// let count = 0;

// Function to update the Food count on cart icon
function updateCountDisplay() {
  const storedCount = JSON.parse(localStorage.getItem("fooditemcount"));
  if(storedCount.length > 0 && storedCount!=null) {
    document.getElementById("cart-sts").style.display = "block";
    document.getElementById("count").textContent =  storedCount.length ;
    document.getElementById("count").style.color = "white";
  }else{
    console.log("empty")
  }
 
}



// // Update the display count when the page loads
const storedCount = JSON.parse(localStorage.getItem("fooditemcount"));
if(storedCount !== null) {
  updateCountDisplay();
}else{
  console.log("no Items in cart")
}



function add(foodName, displayCategory,cost, uniqueInputId) {

  // console.log(displayCategory)
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var selectElement = document.getElementById(uniqueInputId);

  // Check if the element with the specified ID exists
  if (!selectElement) {
    console.error("Invalid element ID: " + uniqueInputId);
    return;
  }
  // this is for the cart icon in the nav bar
  if (!fooditemcount.includes(foodName)) {
    console.log("in")
    fooditemcount.push(foodName);
    // count = count + 1;
    console.log(fooditemcount);
    localStorage.setItem("fooditemcount", JSON.stringify(fooditemcount));
    updateCountDisplay(); // Update the display count
  }else{
    console.log("not in")
  }
  // ********************************

  var qnty = parseInt(selectElement.value);

  if (!isNaN(cost)) {
    cart.push({
      name: foodName,
      price: cost,
      category:displayCategory,
      quantity: qnty,
    });

    

    
    document.getElementById("cart-sts").style.display = "block";
    notification(foodName + " added to Cart");
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    console.error("Cost is NaN. Cannot set the order.");
  }
}



document.getElementById("cart").addEventListener("click", function () {
  window.location.href = "/Order";
});




function notification(foodName) {
  const notification = document.getElementById("notification");
  const text = document.getElementById("notificationText");

  notification.style.display = "block";
  text.textContent = foodName;

  setTimeout(function () {
    notification.style.display = "none";
  }, 3000);
}

// *******************login/logout***************************************************

let username = localStorage.getItem("inputValue"); // Retrieve the username here
console.log(username);
if (username) {
  document.getElementById("loginsts").textContent = "logout";
} else {
  document.getElementById("loginsts").textContent = "login";
}

function redirectToProfile() {

  if (username) {
    console.log("move to profile");
    window.location.href = `/profile`;
  } else {
    alert("Login To view profile!");
  }
}




// ********************************************************************************************


// Reference to the node containing food items and their counts
let FoodcountRef = firebase.database().ref("Foodcounts");
const topThreeItems = [];

// Fetch the data from the database
FoodcountRef.orderByChild("foodCount").limitToLast(3).once("value")
  .then(snapshot => {
    snapshot.forEach(childSnapshot => {
      const foodItem = childSnapshot.key;
      const foodCount = childSnapshot.val().foodCount;
      topThreeItems.push({ foodItem, foodCount });
    });

    // console.log(topThreeItems);
    const menuRef2 = firebase.database().ref("foodItems2");
    // Now fetch the menu items and display the top three
    menuRef2.on("value", function (snapshot) {
      let container = document.querySelector(".content");
      let containerdesktopview = document.querySelector(".food-item-content");
      container.innerHTML = ""; // Clear existing items before displaying new ones
      containerdesktopview.innerHTML = "";

      snapshot.forEach(function (child) {
        child.forEach(function (child2) {
          const menuItem2 = child2.val();
          const uniqueInputId = generateUniqueInputId(menuItem2.foodName);
          // console.log( uniqueInputId );
          // Check if menuItem2.foodName is in the topThreeItems array
          const isTopThree = topThreeItems.some(item => item.foodItem === menuItem2.foodName);

          if (isTopThree && container.style.display !== "none") {
            const itemDiv = document.createElement("div");

            if (getComputedStyle(container).display !== "none") {
              // console.log(getComputedStyle(container).display)
              itemDiv.className = "heighest-ordered-food-item";
            } else {
              itemDiv.className = "food-item2";
            }


            itemDiv.innerHTML = `
            ${menuItem2.vegNonVeg === "veg"
            ? `<img src="../Images/vegetarian.png" alt="no_img" id="veg-nonveg" width="10vw"><br>`
            : `<img src="../Images/non-vegetarian.png" alt="no_img" id="veg-nonveg"><br>`
          }
            
            
            <h2 id="food-Name">${menuItem2.foodName}</h2>
            <h4 >Rs.<span id="price">${menuItem2.cost}</span> </h4>
            <p id="description">Available Count:${menuItem2.quantity}</p>
            <span id="qty">Quantity:</span>
            <div class="quantity">
                <button class="minus" onclick="minus('${uniqueInputId}')">-</button>
                <input type="number" class="input-box" id="${uniqueInputId}" value="1" min="1" max="10">
                <button class="plus" onclick="plus('${uniqueInputId}')">+</button>
            </div>
            
            ${menuItem2.quantity > 0
                ? `<button id="add" onclick="add('${menuItem2.foodName}', ${menuItem2.cost}, '${uniqueInputId}')" 
                  ${menuItem2.quantity <= 0 ? 'disabled' : ''}>Add</button><br>`
                : ''
              }
      `;

            // Apply styling if quantity is less than 1
            if (menuItem2.quantity <= 0) {
              itemDiv.style.backgroundColor = 'rgba(118, 117, 117, 0.733)';
              itemDiv.style.filter = 'grayscale(100%)';
            }
            if (getComputedStyle(container).display !== "none") {
              // console.log(getComputedStyle(container).display)
              container.appendChild(itemDiv);
            } else {
              containerdesktopview.appendChild(itemDiv);
            }
          }
        });
      });

      // Display a message if no top three items are found
      if (container.innerHTML === "") {
        container.textContent = "No Orders Yet!!";
      }
    });
  })
  .catch(error => {
    console.error("Error fetching top three food items:", error);
  });

  // Function to generate a unique input field ID
function generateUniqueInputId(foodName) {
  const uniqueId = Math.random().toString(36).substr(2, 9);
  return `input-${uniqueId}-${foodName}`;
}


function redirectToLogin() {
  var width = window.innerWidth;
  if (width < 500) {
    console.log(username);
        if (username) {
          localStorage.removeItem("inputValue");
          window.location.href = '/loginmob';
      
          // You may want to redirect the user to a login page or do something else here
        } else {
            window.location.href = '/loginmob';
        }
     // Redirect to login1 page for small screens
  } else {
    
        console.log(username);
        if (username) {
          localStorage.removeItem("inputValue");
          window.location.href = `/login`;
      
          // You may want to redirect the user to a login page or do something else here
        } else {
          window.location.href = `/login`;
        }
      
  }
}


    
