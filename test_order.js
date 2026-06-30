const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjNjZTRiYTQ1YjQ0N2M1ZDdiODNhNSIsImlhdCI6MTc4MjgxMzM0NywiZXhwIjoxNzg1NDA1MzQ3fQ.kWhP2QqLk0YGXF3oEujW4g_tjHvLvTlYLnDDlm0TpS0';

const body = {
  orderItems: [
    {
      product: '6a23ce4ba45b447c5d7b83a6',
      quantity: 1,
      price: 100
    }
  ],
  shippingAddress: {
    address: '123 test',
    city: 'test city',
    postalCode: '12345',
    country: 'Test'
  },
  paymentMethod: 'CashOnDelivery',
  totalPrice: 100
};

fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(body)
}).then(res => res.json()).then(console.log).catch(console.error);
