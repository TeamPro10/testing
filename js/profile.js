document.addEventListener("click", function (event) {
  var checkbox = document.getElementById("checkbox");
  if (event.target !== checkbox) {
    checkbox.checked = false;
  }
});

let username = localStorage.getItem('inputValue');
console.log(username);
const db = firebase.firestore();

const settings = { timestampsInSnapshots: true };
db.settings(settings);
const usersRef = db.collection("Users");

let nam = document.getElementById("name");
let Email = document.getElementById("Email");
let phno = document.getElementById("phno");

// Assuming you want to query a specific user document based on the username
usersRef.get().then(function (querySnapshot) {
  if (!querySnapshot.empty) {
    querySnapshot.forEach(function (doc) {
      const userData = doc.data();
      if (userData.Email == username) {
        nam.textContent = userData.UserName;
        Email.textContent = userData.Email;
        phno.textContent = userData.Phone;
      }
    });
  } else {
    console.log("User data not found in Firebase");
  }
}).catch(function (error) {
  console.log("Error getting user data:", error);
});

document.addEventListener("DOMContentLoaded", function () {
  // Display all tokens
  displayUserTokens();
});

// Function to open the popup
function openPopup() {
  document.getElementById('order-details-popup').style.display = 'flex';
}

// Function to close the popup
function closePopup() {
  document.getElementById('order-details-popup').style.display = 'none';
}
let OrderStatus, PaymentStatus;
// Function to display order details for a specific token
function displayOrderDetails(token) {
  // Clear existing order details
  document.getElementById('order-details-container').innerHTML = '';

  // Fetch and display order details for the selected token
  const userOrderDetailsRef = db.collection("Users").doc(username).collection("orderdetails").doc(token).collection("items");
  userOrderDetailsRef.get().then((querySnapshot) => {

    if (querySnapshot.size === 0) {
      console.log("No documents found for the selected token.");
      return;
    }

    // Fetch TotalAmount from the separate collection
    const totalAmountRef = db.collection("Users").doc(username).collection("orderdetails").doc(token);
    totalAmountRef.get().then((totalAmountDoc) => {
      if (totalAmountDoc.exists) {
        const totalAmountData = totalAmountDoc.data();
        const totalAmount = totalAmountData.TotalAmount || 'N/A';
        OrderStatus = totalAmountData.OrderStatus || 'N/A';
        PaymentStatus = totalAmountData.PayStatus || 'N/A';

        // Display other order details
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();

          // Display order details
          console.log(OrderStatus, PaymentStatus);
          const orderDiv = document.createElement("div");
          orderDiv.classList.add("order-details");
          orderDiv.innerHTML = `
          <p><strong>Ordered Food:</strong> ${orderData.Ordered_Food || 'N/A'}</p>
          <p><strong>Quantity:</strong> ${orderData.quantity || 'N/A'}</p>
          <p><strong>Order Status:</strong> ${OrderStatus}</p>
          <p><strong>Payment Status:</strong> ${PaymentStatus}</p>
          
          <hr>
      `;
          document.getElementById('order-details-container').appendChild(orderDiv);
        });

        // Display total amount
        const totalAmountDiv = document.createElement("div");
        totalAmountDiv.classList.add("order-details");
        totalAmountDiv.innerHTML = `<p><strong>Total Amount:</strong> ${totalAmount}</p><br>
                                <button onclick="closePopup()">Close</button>`;
        document.getElementById('order-details-container').appendChild(totalAmountDiv);
      } else {
        console.log("TotalAmount document not found for the selected token.");
      }


    }).catch((error) => {
      console.error("Error getting TotalAmount:", error);
    });

    // Open the popup after loading order details
    openPopup();
  }).catch((error) => {
    console.error("Error getting order details:", error);
  });
}

function displayUserTokens() {
  const userTokensContainer = document.getElementById('user-tokens-container');

  // Fetch and display user tokens
  const userOrderDetailsRef = db.collection("Users").doc(username).collection("orderdetails");

  // Set a limit to the query to get only the recent 10 items
  userOrderDetailsRef.limit(10).get()
    .then((querySnapshot) => {
      if (querySnapshot.size === 0) {
        console.log("No documents found in the collection for the user.");
        return;
      }

      const updatePromises = [];

      querySnapshot.forEach((doc) => {
        console.log(doc.id);

        // Fetch data from the 'items' subcollection
        const itemsSnapshot = userOrderDetailsRef.doc(doc.id).collection("items").get();

        // Assuming that there is a 'Date' field in the 'items' subcollection
        const orderedDatePromise = itemsSnapshot.then((itemsData) => {
          const orderedDate = itemsData.docs.length > 0 ? itemsData.docs[0].data().Date : 'N/A';
          const tokenDiv = document.createElement("div");
        tokenDiv.classList.add("token");
        tokenDiv.textContent = `Token: ${doc.id} - Ordered Date: ${orderedDate}`;
        tokenDiv.addEventListener('click', () => displayOrderDetails(doc.id));
        userTokensContainer.appendChild(tokenDiv);
          return orderedDate;
        });

        updatePromises.push(orderedDatePromise);

        // Update a flag in each document to mark it as displayed
        const docRef = userOrderDetailsRef.doc(doc.id);
        updatePromises.push(docRef.update({ displayed: true }));
      });

      // Wait for all update promises to resolve
      return Promise.all(updatePromises);
    })
    .then(() => {
      // Now, delete the older items that were not displayed

      const deletePromises = [];

      userOrderDetailsRef.where('displayed', '==', false).get()
        .then((oldDocsSnapshot) => {
          oldDocsSnapshot.forEach((oldDoc) => {
            // Delete each old document
            const deletePromise = oldDoc.ref.delete();
            deletePromises.push(deletePromise);
          });

          // Wait for all delete promises to resolve
          return Promise.all(deletePromises);
        })
        .catch((error) => {
          console.error("Error deleting older items:", error);
        });
    })
    .catch((error) => {
      console.error("Error getting and updating user tokens:", error);
    });
}


// *********************login/logout*************

if (username) {
  document.getElementById("loginsts").textContent = "logout";
} else {
  document.getElementById("loginsts").textContent = "login";
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
