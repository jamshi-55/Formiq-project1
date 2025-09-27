import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function User() {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const SubmitBttn = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: 'user', // Default role for signup
    };

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.get('http://localhost:3000/users', {
          params: { email: data.email },
        });
        if (response.data.length > 0) {
          setError('Email already registered');
          toast.error('Email already registered');
          return;
        }
        await axios.post('http://localhost:3000/users', {
          ...data,
          id: Date.now().toString(), // Generating  ID
          isBlocked: false,
        });
        toast.success('Signed up successfully, please log in');
        setCurrentState('Login');
        setError('');
      } else {
        const response = await axios.get('http://localhost:3000/users', {
          params: { email: data.email, password: data.password },
        });
        if (response.data.length > 0) {
          const user = response.data[0];
          if (user.isBlocked) {
            setError('Account is blocked');
            toast.error('Account is blocked');
            return;
          }
          localStorage.setItem('user', JSON.stringify(user));
          toast.success('Logged in successfully');
          setError('');
          if (user.role === 'admin') {
            navigate('/admindashboard');
          } else {
            navigate('/');
          }
        } else {
          setError('Incorrect email or password');
          toast.warn('Incorrect email or password');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Something went wrong, try again');
      toast.error('Something went wrong, try again');
    }
  };

  const ForgotPassword = (e) => {
    e.preventDefault();
    toast.info('Please reset your password');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={SubmitBttn}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8 flex flex-col gap-4"
      >
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-teal-600">
            {currentState === 'Sign Up' ? 'Sign Up' : 'Login'}
          </h2>
        </div>
        {error && (
          <p className="text-red-600 text-center text-sm">{error}</p>
        )}
        {currentState === 'Sign Up' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
              placeholder="Enter your name"
              required
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={ForgotPassword}
            className="text-teal-600 hover:text-teal-800 transition underline"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
            className="text-teal-600 hover:text-teal-800 transition underline"
          >
            {currentState === 'Login' ? 'Create Account' : 'Login here'}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition font-medium text-sm"
        >
          {currentState === 'Login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default User;