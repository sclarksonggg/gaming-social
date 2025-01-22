import React, { useState } from 'react';
import Post from './Post';
import { initialCategories } from '../../utils/constants';

const HomeFeed = ({ posts, followedCategories, currentUser, onLike, onComment, onUserClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('FOR YOU');
  
  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'FOR YOU') {
      return followedCategories.some(category => category.id === post.categoryId);
    }
    return post.categoryId === selectedCategory;
  });

  return (
    <div className="pb-16">
      <div className="flex space-x-2 p-4 overflow-x-auto">
        <button 
          onClick={() => setSelectedCategory('FOR YOU')}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            selectedCategory === 'FOR YOU' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
              : 'bg-gray-800'
          }`}
        >
          FOR YOU
        </button>
        {followedCategories.map(category => (
          <button 
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category.id 
                ? category.color 
                : 'bg-gray-800'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="space-y-4 p-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {selectedCategory === 'FOR YOU' 
              ? 'Follow some categories to see posts here!' 
              : 'No posts in this category yet.'}
          </div>
        ) : (
          filteredPosts.map(post => (
            <Post 
              key={post.id} 
              post={post}
              currentUser={currentUser}
              categoryColor={initialCategories.find(c => c.id === post.categoryId)?.color}
              onLike={onLike}
              onComment={onComment}
              onUserClick={onUserClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeFeed;