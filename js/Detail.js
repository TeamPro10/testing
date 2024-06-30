var database = firebase.database();
let details = database.ref("details");
let username = localStorage.getItem("inputValue");

var tablecheched = document.querySelector(".table-checked");


let ham = document.getElementById("hamburger-open");
let cancel = document.getElementById("hamburger-cancel");
let sidebar = document.querySelector(".sidebar");

ham.addEventListener("click", function () {
  ham.style.display = "none";
  cancel.style.display = "block";
  sidebar.style.transition = "1s";
  sidebar.style.transform = "translateX(0px)";
});

cancel.addEventListener("click", function () {
  cancel.style.display = "none";
  ham.style.display = "block";

  sidebar.style.transform = "translateX(-1666px)";
});




function formatTime(time) {
    var formattedTime = new Date("2000-01-01 " + time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return formattedTime;
  }


details.on("value", function (snapshot) {
    let checkedItem = snapshot.val();
    console.log(checkedItem);
    tablecheched.innerHTML="";
    
    for (let key in checkedItem) {
      if (checkedItem.hasOwnProperty(key)) {

        var newRow = document.createElement("tr");
        newRow.setAttribute("data-token-number2", key);
        newRow.innerHTML = `
            <td>${key}</td>
            <td>${checkedItem[key].gmail}</td>
            <td>${checkedItem[key].foodItem}</td>
            <td>${checkedItem[key].amount}</td>
            <td>${formatTime(checkedItem[key].time)}</td>
        `;
        
      //   <td>${checkedItem[key].foodItem}</td>
      // <td>${checkedItem[key].amount}</td>
        var allRows = tablecheched.querySelectorAll("tr[data-token-number2]");
        newRow.querySelector("td:first-child").textContent = allRows.length + 1;
        tablecheched.appendChild(newRow);
      }
    }
  });

function downloadpdf() {
    details.once('value')
      .then(snapshot => {
        const data = [];
        snapshot.forEach(childSnapshot => {
          const tokenNumber = childSnapshot.key;
          const itemData = childSnapshot.val();
          data.push({
            'Token Number': tokenNumber,
            'Food Item': itemData.foodItem,
            'G-mail': itemData.gmail,
            'Time': itemData.time,
            'Amount': itemData.amount,
          });
        });
  
        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, 'Checked Orders');
  
        // Save the workbook to a file
        XLSX.writeFile(workbook, 'checked_orders' + '.xlsx');
  
        // Clear the entries from the frontend (remove rows from the table)
        var tableRows = document.querySelectorAll(".table-checked tbody tr");
        tableRows.forEach(row => row.remove());
      })
      .catch(err => {
        console.error('Error getting data from Firebase:', err);
        // Handle the error here (e.g., display an error message to the user)
      });
  }
  


  
  function clearData() {
    // Display a SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will clear all entries. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear the entries in the Firebase database
        details.remove()
          .then(function () {
            console.log('Entries cleared successfully from checkedItems');
          })
          .catch(function (error) {
            console.error('Error clearing entries from checkedItems:', error);
          });
  
        // Clear the entries from the frontend (remove rows from the table)
        var tableRows = document.querySelectorAll(".table-checked tbody tr");
        tableRows.forEach(row => row.remove());
  
        Swal.fire('Cleared!', 'All entries have been cleared.', 'success');
      } else {
        Swal.fire('Cancelled', 'Entries were not cleared.', 'info');
      }
    });
  }

  document.querySelector(".logout-button").addEventListener("click", function () {
    console.log(username);
    if (username) {
      localStorage.removeItem("inputValue");
      window.location.href = `login.html`;
  
      // You may want to redirect the user to a login page or do something else here
    } else {
      window.location.href = `login.html`;
    }
  });