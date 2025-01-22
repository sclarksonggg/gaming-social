import React, { useState } from 'react';

const CreatePost = ({ currentUser, setPosts, followedCategories }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // In CreatePost.jsx, update the handleSubmit function:
  const handleSubmit = () => {
    if (!postContent.trim() || !selectedCategory) return;

    setPosts(prevPosts => {
      const newPosts = [...prevPosts, {
        id: Date.now(),
        userId: currentUser.id,  // Make sure this is included
        username: currentUser.username,
        userColor: currentUser.avatarColor,  // Add this for consistent avatar colors
        content: postContent,
        categoryId: selectedCategory,
        timestamp: new Date().toISOString(),
        likes: [],
        comments: []
      }];
      localStorage.setItem('posts', JSON.stringify(newPosts));
      return newPosts;
    });

    setPostContent('');
    setSelectedCategory(null);
    setIsCreating(false);
  };

  if (!isCreating) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        className="fixed bottom-20 right-4 bg-blue-600 p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        CREATE NEW POST
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-gray-900 rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Create New Post</h3>
          <button 
            onClick={() => setIsCreating(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {followedCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.id 
                  ? category.color 
                  : 'bg-gray-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-32 p-2 rounded bg-gray-800 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!postContent.trim() || !selectedCategory}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;