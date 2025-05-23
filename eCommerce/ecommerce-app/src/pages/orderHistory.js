import React, { useEffect, useState } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    async function fetchOrders() {
      setLoading(true);
      // Simulated fetch
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              {
                id: 1,
                date: '2024-06-01',
                total: 120.5,
                status: 'Delivered',
                items: [
                  { name: 'Product A', quantity: 2 },
                  { name: 'Product B', quantity: 1 },
                ],
              },
              {
                id: 2,
                date: '2024-05-15',
                total: 75.0,
                status: 'Shipped',
                items: [{ name: 'Product C', quantity: 3 }],
              },
            ]),
          1000
        )
      );
      setOrders(response);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading order history...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <h2>Order History</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <div>
              <strong>Order #{order.id}</strong> - {order.date}
            </div>
            <div>Status: {order.status}</div>
            <div>Total: ${order.total.toFixed(2)}</div>
            <div>
              <strong>Items:</strong>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;    