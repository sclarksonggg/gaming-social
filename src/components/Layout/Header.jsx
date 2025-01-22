import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

const Header = ({ currentUser, onLogout, setCurrentView }) => (
  <header className="p-4 flex items-center justify-between border-b border-gray-800">
    <Menu size={24} className="text-white" />
    <div className="flex items-center space-x-4">
      <Search size={24} className="text-white" />
      <Bell size={24} className="text-white" />
      <button 
        onClick={() => setCurrentView('profile')}
        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentUser.avatarColor || 'bg-gray-600'}`}
      >
        <User size={20} className="text-white" />
      </button>
      <button 
        onClick={onLogout}
        className="px-4 py-2 bg-red-600 rounded-full hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  </header>
);

export default Header;