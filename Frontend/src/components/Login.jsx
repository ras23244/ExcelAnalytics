import React, { useState,useContext,Link } from 'react';
import axios from 'axios';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/userContext';
import { useDataContext } from '../context/DataContext';

const url = "https://excelanalytics-backend.onrender.com";

function Login() {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, setUser } = useContext(UserDataContext);
  const { clearUploads, clearCharts } = useDataContext();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(`${url}/user/login`, form, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (res.status === 200) {
        setSuccess('login successful!');
        localStorage.setItem('token', res.data.token);
       localStorage.setItem('user', JSON.stringify(res.data.newUser));

        setUser({
          email: res.data.user.email,
          name: res.data.user.name,
          role: res.data.user.role,
        });
        setForm({email: '', password: ''});
        clearUploads();
        clearCharts();
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || (err.response.data.errors && err.response.data.errors[0]?.msg) || 'Signup failed');
      } else {
        setError('Network error. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Login</h2>
        {error && <div className="signup-error">{error}</div>}
        {success && <div className="signup-success">{success}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Enter your password"
          />
        </div>
        <button className="signup-btn" type="submit" disabled={loading}>
          {loading ? ' Logging...' : ' Login'}
        </button>
        <div className="mid">Don't have account?</div>
        <button className="signup-btn" type="button" onClick={() => navigate('/register')}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Login;
