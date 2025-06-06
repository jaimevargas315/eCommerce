import React, { useState } from 'react';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
      setError('');
      setSuccess(false);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess(false);
      if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.');
          return;
      }
      if (!form.username || !form.email || !form.password || !form.confirmPassword) {
          setError('All fields are required.');
          return;
      }
      try {
          const response = await fetch('http://localhost:3001/auth/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  "username": form.username,
                  "email": form.email,
                  "password": form.password
              }),
          });
          const data = await response.json();
          if (response.ok) {
              console.log('Registration successful:', data);
              setSuccess(true);
              setError('');
              setForm({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
              });
          }
          else {
              console.error('Registration failed:', data);
              setError(data.message || data.error || 'Registration failed');
              setSuccess(false);
          }
      } catch (error) {
          console.error('Error during registration:', error);
          setError('An error occurred during registration. Please try again later.');
          setSuccess(false);
      }

  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      {success ? (
        <div className="success">Registration successful!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
};

export default Register;