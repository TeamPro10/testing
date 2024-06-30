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
 