import React, { useState } from 'react';

const AuthScreen = ({ setIsLoggedIn, setCurrentUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('All fields are required');
      return;
    }

    if (isRegistering) {
      // Registration logic
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if username already exists
      if (existingUsers.some(user => user.username === formData.username)) {
        setError('Username already exists');
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        username: formData.username,
        password: formData.password, // In a real app, you'd hash this
        email: formData.email
      };

      // Save user to "database"
      localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
      
      // Log them in
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);
      setIsLoggedIn(true);
    } else {
      // Login logic
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === formData.username);

      if (!user || user.password !== formData.password) {
        setError('Invalid username or password');
        return;
      }

      // Login successful
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          {isRegistering ? 'Create Account' : 'Login'}
        </h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded text-center mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          
          {isRegistering && (
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          )}
          
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <button
            type="submit"
            className="w-full py-3 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
          >
            {isRegistering ? 'Create Account' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setFormData({ username: '', password: '', email: '' });
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;