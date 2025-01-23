import React from 'react';

const DiscoverView = ({ followedCategories, setFollowedCategories, onCategorySelect }) => {
  const categories = ['Gaming', 'Technology', 'Movies', 'Music', 'Sports'];

  const toggleFollow = (category) => {
    setFollowedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Discover Categories</h2>
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <span className="text-lg">{category}</span>
            <div>
              <button
                onClick={() => toggleFollow(category)}
                className={`mr-2 px-4 py-2 rounded ${
                  followedCategories.includes(category)
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {followedCategories.includes(category) ? 'Unfollow' : 'Follow'}
              </button>
              <button
                onClick={() => onCategorySelect(category)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
              >
                Join Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverView;