import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import ProductList from './pages/productList';
import Register from './pages/register';
import Home from './pages/Home'; // Assuming you have a Home component

// Dummy components for illustration


function App() {
  return (
    
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/productlist">Product List</Link>
               </li>
               <li>
                <Link to="/register">Register</Link>
               </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    
  );
}

export default App;
