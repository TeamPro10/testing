const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
let tokenref = firebase.database().ref("Token");

var database = firebase.database();
// Reference to the root of your Firebase structure
let rootRef = database.ref("Orders");
let FoodcountRef = database.ref("Foodcounts");
let categoryRef = database.ref("foodItems2");
let username = localStorage.getItem("inputValue");
const usersRef = db.collection("Users");
let Orderdetails;
let categories = [];

if (username !== null) {
  console.log(username);
  //realtimedatabase

  Orderdetails = usersRef.doc(username).collection("orderdetails");
} else {
  console.warn("loginnn for further operation!");
}

var cart = JSON.parse(localStorage.getItem("cart"));
let cartitemcount = 0;
if (cart !== null) {
  cart.forEach(function (item) {
    cartitemcount = cartitemcount + 1;
  });
}

// Function to format hours and minutes as a 12-hour time string with AM/PM
function format12HourTime(hours, minutes) {
  var period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  // Format the time in HH:mm AM/PM
  var formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;

  return formattedTime;
}

// console.log(cartitemcount);
function placeorder() {
  let token;

  var cart = JSON.parse(localStorage.getItem("cart"));
  // console.log(username)
  tokenref.once("value").then(function (snapshot) {
    token = snapshot.val().token;
    // console.log(snapshot.val().token);

    console.log(token);
    if (cart && cart.length > 0) {
      // You need to implement a function to generate a unique token
      var selectedTime = localStorage.getItem("time");
      // console.log(selectedTime);
      var time;

      if (selectedTime) {
        // Convert the string representation back to a Date object
        var dateObject = new Date(selectedTime);

        // Format the time
        console.log(dateObject)
        var time = format12HourTime(
          dateObject.getHours(),
          dateObject.getMinutes()
        );
        // console.log("Formatted Time:", formattedTime);
      } else {
        console.log("No time found in localStorage");
      }

      // console.log(time);

      const currentDate = new Date();

      // Get individual components of the date
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
      const day = currentDate.getDate();
      var date = day + "/" + month + "/" + year;

      cart.forEach(function (item) {
        if (!categories.includes(item.category)) {
          categories.push(item.category);
          // console.log(item.category);
        }
      });
      let index;
      // Loop through the cart items and save each one as a separate order
      while (categories.length !== 0) {
        console.log("length-cat-before:", categories.length, categories);
        cart.forEach(function (item) {
          index = categories.length - 1;
          if (categories[categories.length - 1] === item.category) {
            console.log("Token:", token);
            console.log("FoodItem:", item.name);

            // reduceing the item count
            let message=reduce_count(item.name,item.quantity)
              console.log(message);
              alert(message)



            Orderdetails.doc(token.toString())
              .collection("items")
              .add({
                Ordered_Food: item.name,
                quantity: item.quantity,
                Price: item.quantity * item.price,
                Date: date,
              })
              .then(function (docRef) {
                console.log(
                  "Order details saved successfully with ID: ",
                  docRef.id
                );
              })
              .catch(function (error) {
                console.error("Error saving order details:", error);
              });
            // console.log("passing token:",token,username, time, item.name, item.quantity)
            addfood_to_uncheckedlist(
              token,
              username,
              time,
              item.name,
              item.quantity
            );
            console.log("passing token:", token);
          }
        });
        const totalAmount = localStorage.getItem("totalAmount");
        console.log("realtime:", totalAmount);
        const PaymentStatus = "Paid";
        // Save the total amount for the order (assuming you want a single total amount for all items)
        Orderdetails.doc(token.toString())
          .set({
            TotalAmount: totalAmount,
            PayStatus: PaymentStatus,
            OrderStatus: "ordered",
          })
          .then(function () {
            console.log("Total amount saved successfully.");

            localStorage.removeItem("cart");
            localStorage.removeItem("fooditemcount");
            localStorage.removeItem("time");
            // console.log(cart, " ", fooditemcount, " ", time);
            location.reload();
          })
          .catch(function (error) {
            console.error("Error saving total amount:", error);
          });
        // Remove the processed category from the array
        categories.splice(index, 1);
        console.log("length-cat-after:", categories.length, categories);
        token += 1;
        tokenref.set({
          token: token,
        });
      }

      // console.log("token",token);
    } else {
      alert("UR order is Already placed once!!");
    }
    //realtimedatabase
  });

  // });
}

let foodItems = {};
let foodcount = {};
let finalorderplacecounter = 0;
function addfood_to_uncheckedlist(token, email, time, foodname, quantity) {
  let count;
  console.log(token);
  // Initialize the array if it doesn't exist for the given token
  if (!foodItems[token]) {
    foodItems[token] = [];
  }

  // Now you can safely push to the array
  foodItems[token].push(foodname);

  // Fetch the count from Firebase
  let FcountRef = FoodcountRef.child(foodname);
  const foodquantity = localStorage.getItem("quantity");
  // console.log(foodname);
  const retrievedArray = JSON.parse(foodquantity);
  

  FcountRef.once("value")
    .then((snapshot) => {
      const Fcount = snapshot.val();

      // Check if Fcount exists and has a count property
      if (Fcount && Fcount.hasOwnProperty("foodCount")) {
        count = parseInt(Fcount.foodCount) + parseInt(retrievedArray[foodname]);
      } else {
        count = parseInt(retrievedArray[foodname]);
        // console.log("count :", count);
      }

      // Update the foodcount object directly
      foodcount[foodname] = count;
     
      // Save the count to Firebase
      FcountRef.set({
        foodCount: foodcount[foodname],
      })
        .then(() => {
          finalorderplacecounter = finalorderplacecounter + 1;
          // console.log(finalorderplacecounter);

          if (cartitemcount === finalorderplacecounter) {
            alert("Order placed successfully!!");
            console.log("Count saved successfully.");
            // location.reload();
          }
        })
        .catch((error) => {
          console.error("Error saving Count Details.", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching count from Firebase:", error);
    });
  
  // console.log(foodItems[token]);
  const TotalAmount = localStorage.getItem("totalAmount");
  // console.log("Realtime:",time);
  rootRef
    .child(token)
    .set({
      foodItem: foodItems[token].join(","),
      Email: email,
      Quantity: quantity,
      TotalAmount: TotalAmount,
      time: time,
      prepared_status: "ordered",
    })
    .then(() => {
      console.log("Details saved successfully.", token);
    })
    .catch((error) => {
      console.error("Error saving Details.", error);
    });
  // token += 1;
  // tokenref.set({
  //   token: token,
  // });
}
// Function to display cart items from local storage
document.addEventListener("click", function (event) {
  var checkbox = document.getElementById("checkbox");
  if (event.target !== checkbox) {
    checkbox.checked = false;
  }
});

function displayCartItems() {
  var cart = JSON.parse(localStorage.getItem("cart"));
  var count = JSON.parse(localStorage.getItem("fooditemcount"));

  console.log(count);
  // Clear the cart list before adding items
  var cartList = document.querySelector(".menu ul");
  cartList.innerHTML = ""; // Remove all items from the cart

  if (cart && cart.length > 0) {
    var totalAmount = 0;
    var itemQuantities = {}; // To track item quantities
    let heighestorderqunty = {};
    cart.forEach(function (item) {
      heighestorderqunty[item.name] = item.quantity;
      // console.log(heighestorderqunty);

      localStorage.setItem("quantity", JSON.stringify(heighestorderqunty));

      

      if (itemQuantities[item.name]) {
        // If the item already exists in the cart, update its quantity and total price
        itemQuantities[item.name].quantity += item.quantity;
        itemQuantities[item.name].totalPrice += item.quantity * item.price;
        // document.querySelector(".cancel").style.display="block";
      } else {
        // If it's a new item, add it to the itemQuantities object
        itemQuantities[item.name] = {
          quantity: item.quantity,
          totalPrice: item.quantity * item.price,
        };
      }
    });

    // Loop through the itemQuantities object and display consolidated items
    for (var itemName in itemQuantities) {
      var itemData = itemQuantities[itemName];
      var listItem = document.createElement("li");

      listItem.innerHTML = `<h3>${itemName} (Qty: ${itemData.quantity})</h3>
                            <p>Rs. ${itemData.totalPrice.toFixed(2)}</p>
                            <button class="cancel-item" onclick="removeItem('${itemName}')">cancel</button><br>`;
      cartList.appendChild(listItem);

      totalAmount += itemData.totalPrice; // Update the total amount
    }

    // Update the total amount
    var totalAmountSpan = document.querySelector(".cart span");
    totalAmountSpan.textContent = "Total amt: Rs. " + totalAmount.toFixed(2);
    localStorage.setItem("totalAmount", totalAmount.toFixed(2));
    console.log(totalAmount);

    // Apply CSS styles (if needed) to the total amount span
    totalAmountSpan.style.fontSize = "24px"; // Adjust the font size as needed
    totalAmountSpan.style.textAlign = "center";
  } else {
    cartList.textContent = "Cart is Empty!! Add food items";
  }
}

function removeItem(itemName) {
  var count = JSON.parse(localStorage.getItem("fooditemcount"));
  count = count.filter((item) => item !== itemName);
  console.log(count);
  var cart = JSON.parse(localStorage.getItem("cart"));
  cart = cart.filter((item) => item.name !== itemName);
  console.log(cart);
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("fooditemcount", JSON.stringify(count));
  displayCartItems();
}

// Function to clear the cart and refresh the page
function clearCart() {
  localStorage.removeItem("fooditemcount");
  // Clear items from local storage
  localStorage.removeItem("cart");

  // Reload the page to clear the cart display
  location.reload();
}

// Call the displayCartItems function when the page loads
window.addEventListener("load", displayCartItems);


// ***************************************payment start*******************************************************
// Define a function to create Razorpay instance
function createRazorpayInstance(options) {
  return new Razorpayy(options);
}

// Flag variable to track whether Razorpay configuration has been executed
let razorpayConfigured = false;

document.getElementById("pay").addEventListener("click", function () {
  // Retrieve necessary details
  // let username = localStorage.getItem('inputValue');
  let phone, name;
  if (username !== null) {
    var cart = JSON.parse(localStorage.getItem("cart"));
    var orderTime = document.getElementById("order-time").value;
    var totalAmount = localStorage.getItem("totalAmount");

    if (!cart || cart.length === 0) {
      alert("Cart is empty!! Add food Items");
    } else if (!orderTime) {
      alert("Please select the delivery time");
    } else {
      // Check if the selected time is within the allowed range (10:30 to 18:00)
      var selectedTime = new Date("2000-01-01 " + orderTime);
      var lowerLimit = new Date("2000-01-01 10:30");
      var upperLimit = new Date("2000-01-01 18:00");
      console.log(selectedTime);
      if (selectedTime >= lowerLimit && selectedTime <= upperLimit) {
        // selectedTime = parse12HourTime(orderTime);
        localStorage.setItem("time", selectedTime); // Move to the payment page
        console.log("Order-Time :", selectedTime);
      } else {
        alert("Delivery time must be between 10:30 and 18:00");
      }

      if (selectedTime >= lowerLimit && selectedTime <= upperLimit) {
        // Retrieve total amount from localStorage
        const TotalAmount = localStorage.getItem("totalAmount");

        // Fetch user details
        // const usersRef = db.collection("Users");
        usersRef
          .doc(username)
          .get()
          .then((doc) => {
            if (doc.exists) {
              phone = doc.data().Phone;
              name = doc.data().UserName;

              // Configure Razorpay object if it hasn't been configured yet
              if (!razorpayConfigured) {
                const razorpayConfig = {
                  key: "rzp_test_j6KWJ17yYlWYl7",
                  amount: TotalAmount * 100, // Convert to smallest currency unit (paise)
                  currency: "INR",
                  name: "FoodCourt MITE",
                  description: "Pay & Checkout this Food",
                  image:
                    "https://media.geeksforgeeks.org/wp-content/uploads/20210806114908/dummy-200x200.png",
                  handler: function (response) {
                    console.log(response, "Payment Succeeded");
                    console.log("res: ", razorpayInstance);
                    placeorder();
                    // alert("Payment succeeded");

                    // Execute additional actions upon successful payment
                  },
                  prefill: {
                    contact: phone,
                    name: name,
                    email: username,
                  },
                  notes: {
                    description:
                      "Breakfast, Meals, fastfood, Beverages, Chats, Icecream",
                    language: "Available in MITE",
                    access: "limited quantity!",
                  },
                  theme: {
                    color: "#2300a3",
                  },
                  method: {
                    card: true,
                    netbanking: true,
                    upi: true,
                  },
                };

                // Create Razorpay instance and store it in a variable
                const razorpayInstance = createRazorpayInstance(razorpayConfig);

                // Set flag to true to indicate that Razorpay has been configured
                razorpayConfigured = true;
              }
            } else {
              console.warn("No such document!");
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          });
      } else {
        alert("Delivery time must be between 10:30 and 18:00");
      }
    }
  } else {
    alert("Please Login to continue!");
  }
});
function reduce_count(foodname,quantity) {
  const itemname = foodname;

  return new Promise((resolve, reject) => {
      categoryRef.once("value")
          .then(snapshot => {
              snapshot.forEach(child => {
                  child.forEach(child2 => {
                      const item = child2.val();
                      const itemId = child2.key;
                      if(item.quantity>=quantity){
                      if (item.foodName === itemname && item.quantity > 0) {
                          item.quantity=item.quantity-quantity;

                          const update_count = {
                              FoodType: item.FoodType,
                              cost: item.cost,
                              displayCategory: item.displayCategory,
                              foodName: item.foodName,
                              quantity: item.quantity,
                              vegNonVeg: item.vegNonVeg
                          };

                          const foodItemRef = child2.ref; // Use ref to reference the item
                          
                          foodItemRef.update(update_count)
                              .then(() => {
                                  console.log("Data updated successfully");
                                  resolve("Data updated successfully");
                              })
                              .catch(error => {
                                  console.error("Error updating data: ", error);
                                  reject("Error updating data: " + error.message);
                              });
                      }
                      }else{
                        alert(foodname,"avilable quantity is less!")
                      }
                  });
              });
          })
          .catch(error => {
              console.error('The read failed: ' + error.code);
              reject('The read failed: ' + error.code);
          });
  });
}



// ******login/logout******************



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
    alert("Login to View Profile!");
  }
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

const checkbox = document.getElementById('t_and_c');
checkbox.checked = true;
    const payButton = document.getElementById('pay');
    payButton.removeAttribute('disabled');
    checkbox.addEventListener('change', function () {
      if (!this.checked) {
        payButton.setAttribute('disabled', 'disabled');
      } else {
        payButton.removeAttribute('disabled');
      }
    });