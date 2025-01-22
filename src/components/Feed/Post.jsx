import React, { useState } from 'react';
import { Heart, MessageCircle, ChevronDown, ChevronUp, User } from 'lucide-react';

const Post = ({ post, categoryColor, currentUser, onLike, onComment, onUserClick }) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Initialize likes and comments if they don't exist
  const likes = post.likes || [];
  const comments = post.comments || [];
  
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    onComment(post.id, {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      content: commentText,
      timestamp: new Date().toISOString()
    });
    setCommentText('');
    setIsCommenting(false);
  };

  const isLiked = likes.includes(currentUser.id);

  return (
    <div className={`p-4 rounded-lg ${categoryColor}`}>
      <div className="flex items-center space-x-2 mb-2">
        <button 
          onClick={() => onUserClick(post.userId)}
          className="flex items-center space-x-2 hover:opacity-80"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${post.userColor || 'bg-gray-600'}`}>
            <User size={20} className="text-white" />
          </div>
          <span className="font-medium">{post.username}</span>
        </button>
      </div>
      
      <p className="text-white">{post.content}</p>
      
      <div className="mt-4 flex items-center space-x-4">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onLike(post.id);
          }}
          className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-300'}`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likes.length}</span>
        </button>
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (comments.length > 0) {
              setShowComments(!showComments);
            }
            setIsCommenting(!isCommenting);
          }}
          className="flex items-center space-x-1 text-gray-300"
        >
          <MessageCircle size={20} />
          <span>{comments.length}</span>
          {comments.length > 0 && (
            showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </button>
      </div>

      {/* Comments section */}
      {(isCommenting || (showComments && comments.length > 0)) && (
        <div className="mt-4 space-y-4">
          {showComments && comments.map(comment => (
            <div key={comment.id} className="bg-black bg-opacity-30 p-3 rounded">
              <div className="flex items-center space-x-2 mb-1">
                <button 
                  onClick={() => onUserClick(comment.userId)}
                  className="font-medium text-sm hover:opacity-80"
                >
                  {comment.username}
                </button>
                <span className="text-xs text-gray-400">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}

          {isCommenting && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-black bg-opacity-30 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-2 text-sm text-gray-300">
        {new Date(post.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default Post;