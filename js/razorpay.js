function Razorpayy(options) {
    console.log(options);
  
    // Create a new instance of Razorpay using the provided options
    var razorpayObject = new Razorpay(options);
    console.log(razorpayObject);
  
    // Attach a 'payment.failed' event listener
    razorpayObject.on('payment.failed', function (response) {
      console.log(response, "Payment Failed");
      alert("Payment failed");
    });
  
    // Open the Razorpay payment modal
    razorpayObject.open();
  }
  