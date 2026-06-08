import Razorpay from 'razorpay';

const instance = new Razorpay({
  key_id: 'rzp_test_Sz16HmoeT1G4ta',
  key_secret: 'fWFtrZbjXCg4am7OfEtuhcuJ',
});

const testRazorpay = async () => {
  try {
    const options = {
      amount: Math.round(100 * 100),
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await instance.orders.create(options);
    console.log("Success:", order);
  } catch (err) {
    console.error("Error:", err);
  }
};

testRazorpay();
