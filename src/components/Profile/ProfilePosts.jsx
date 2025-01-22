import React, { useState } from 'react';
import { MessageCircle, Heart, ChevronDown, ChevronUp, User } from 'lucide-react';
import { initialCategories } from '../../utils/constants';

const ProfilePosts = ({ posts, userId, currentUser, onLike, onComment }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  const userPosts = posts
    .filter(post => post.userId === userId)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === 'popular') {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return 0;
    });

  const handleSubmitComment = (postId) => {
    if (!commentText.trim()) return;
    
    onComment(postId, {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      content: commentText,
      timestamp: new Date().toISOString()
    });
    setCommentText('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Posts</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-800 rounded-lg px-3 py-1"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Liked</option>
        </select>
      </div>

      {userPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts yet
        </div>
      ) : (
        <div className="space-y-4">
          {userPosts.map(post => {
            const isLiked = post.likes?.includes(currentUser.id);
            const isExpanded = expandedPostId === post.id;

            return (
              <div 
                key={post.id}
                className={`p-4 rounded-lg ${initialCategories.find(c => c.id === post.categoryId)?.color || 'bg-gray-800'}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${post.userColor || 'bg-gray-600'}`}>
                    <User size={20} className="text-white" />
                  </div>
                  <span className="font-medium">{post.username}</span>
                </div>

                <p className="text-white mb-3">{post.content}</p>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onLike(post.id);
                    }}
                    className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-300'}`}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  
                  <button 
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="flex items-center space-x-1 text-gray-300"
                  >
                    <MessageCircle size={20} />
                    <span>{post.comments?.length || 0}</span>
                    {post.comments?.length > 0 && (
                      isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    {post.comments?.map(comment => (
                      <div key={comment.id} className="bg-black bg-opacity-30 p-3 rounded">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{comment.username}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-black bg-opacity-30 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSubmitComment(post.id)}
                        disabled={!commentText.trim()}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-2 text-sm text-gray-300">
                  {new Date(post.timestamp).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;