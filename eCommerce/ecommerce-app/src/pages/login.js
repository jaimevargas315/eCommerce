import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      setError(''); // Clear error on input change
      setSuccess(false);
  };
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
      setError('');
      setSuccess(false);

      if (!form.username || !form.password) {
        setError('Please enter both username and password.');
        return;
      }
      try {
          const response = await fetch('http://localhost:3001/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  username: form.username,
                  password: form.password,
              }),
              credentials: 'include', 
          });
          const data = await response.json();
          if (response.ok) {
              console.log('Login successful:', data);
              onLoginSuccess(data.user); // Notify parent component of successful login
              setSuccess(true);
              setError('');
              setForm({
                  username: '',
                  password: ''
              });
          } else {
              console.error('Login failed:', data);
              setError(data.message || data.error || 'Login failed. Please try again.');
              setSuccess(false);
          }
      } catch (error) {
          console.error('Error during login:', error);
          setError('An error occurred while trying to log in. Please try again later.');
          setSuccess(false);
      }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;