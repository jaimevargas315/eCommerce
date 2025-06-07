import React from 'react';
import { useState, useEffect } from 'react';
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


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            }); if (response.ok) {
                // Logout successful, update state accordingly
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3001/auth/current_user', {
                    method: 'GET',
                    credentials:'include',
                    headers: {
                    'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setIsAuthenticated(true);
                    setUser(data.user);
                }else {
                        setIsAuthenticated(false);
                        setUser(null);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        checkAuth();
    }, []);
    console.log('App.js render: isAuthenticated =', isAuthenticated, 'user =', user); // <-- ADD THIS
  return (   
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>

                      {isAuthenticated ? (
                          <>
                              <button onClick={handleLogout}>Logout</button>
                          </>) : (
                              
                              <li>
                                  <Link to="/login">Login</Link>
                              </li>
                          )}

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
                  <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    
  );
}

export default App;
