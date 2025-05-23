import React, { useEffect, useState } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="product-list">
      <h1>Product List</h1>
      {products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id} className="product-list-item">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <span>${product.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;