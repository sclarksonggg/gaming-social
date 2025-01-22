import React from 'react';
import { Home, Box, MessageCircle } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView }) => (
  <nav className="fixed bottom-0 left-0 right-0 flex justify-around p-4 border-t border-gray-800 bg-black">
    <button
      onClick={() => setCurrentView('home')}
      className={currentView === 'home' ? 'text-blue-500' : 'text-gray-400'}
    >
      <Home size={24} />
    </button>
    <button
      onClick={() => setCurrentView('discover')}
      className={currentView === 'discover' ? 'text-blue-500' : 'text-gray-400'}
    >
      <Box size={24} />
    </button>
    <MessageCircle size={24} className="text-gray-400" />
  </nav>
);

export default Navigation;