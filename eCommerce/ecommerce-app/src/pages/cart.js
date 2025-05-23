import React from 'react';

const Cart = () => {
  // Placeholder for cart items, replace with actual state or props as needed
  const cartItems = [
    // Example item
    // { id: 1, name: 'Product 1', price: 29.99, quantity: 2 }
  ];

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <span>{item.name}</span> - 
                <span>Qty: {item.quantity}</span> - 
                <span>${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <strong>Total: ${getTotal()}</strong>
          </div>
          <button>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;