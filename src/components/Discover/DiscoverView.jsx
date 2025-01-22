import React from 'react';
import { initialCategories } from '../../utils/constants';

const DiscoverView = ({ followedCategories, setFollowedCategories }) => {
  const handleFollowCategory = (category) => {
    if (followedCategories.find(c => c.id === category.id)) {
      const newCategories = followedCategories.filter(c => c.id !== category.id);
      setFollowedCategories(newCategories);
      localStorage.setItem('followedCategories', JSON.stringify(newCategories));
    } else {
      const newCategories = [...followedCategories, category];
      setFollowedCategories(newCategories);
      localStorage.setItem('followedCategories', JSON.stringify(newCategories));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 pb-16">
      {initialCategories.map(category => (
        <div 
          key={category.id}
          className={`p-4 rounded-lg ${category.color}`}
        >
          <h3 className="text-xl font-bold mb-2">{category.name}</h3>
          <button
            onClick={() => handleFollowCategory(category)}
            className={`px-4 py-2 rounded-full ${
              followedCategories.find(c => c.id === category.id)
                ? 'bg-white text-black'
                : 'bg-black bg-opacity-50 text-white'
            }`}
          >
            {followedCategories.find(c => c.id === category.id)
              ? 'Following'
              : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DiscoverView;