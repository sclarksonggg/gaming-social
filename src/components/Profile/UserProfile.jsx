import React, { useState, useEffect } from 'react';
import { User, Users, MessageCircle, Plus } from 'lucide-react';
import ProfilePosts from './ProfilePosts';
import AchievementShowcase from './AchievementShowcase';

const UserProfile = ({ currentUser, setCurrentUser, userId, posts, onUserClick, onLike, onComment }) => {
  const [isOwnProfile, setIsOwnProfile] = useState(userId === null);
  const [profileUser, setProfileUser] = useState(userId === null ? currentUser : null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: currentUser.username,
    bio: currentUser.bio || '',
    avatarColor: currentUser.avatarColor || 'bg-blue-500',
    favoriteGame: currentUser.favoriteGame || '',
    status: currentUser.status || 'offline'
  });

  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    game: '',
    earnedDate: ''
  });

  const avatarColors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500',
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500',
  ];

  useEffect(() => {
    if (userId) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === userId);
      if (user) {
        setProfileUser(user);
        setProfileData({
          username: user.username,
          bio: user.bio || '',
          avatarColor: user.avatarColor || 'bg-blue-500',
          favoriteGame: user.favoriteGame || '',
          status: user.status || 'offline'
        });
      }
    } else {
      setProfileUser(currentUser);
      setProfileData({
        username: currentUser.username,
        bio: currentUser.bio || '',
        avatarColor: currentUser.avatarColor || 'bg-blue-500',
        favoriteGame: currentUser.favoriteGame || '',
        status: currentUser.status || 'offline'
      });
    }
    setIsOwnProfile(userId === null);
  }, [userId, currentUser]);

  const userStats = {
    posts: posts.filter(post => post.userId === (profileUser?.id || currentUser.id)).length,
    followers: profileUser?.followers?.length || 0,
    following: profileUser?.following?.length || 0
  };

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      ...profileData
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? { ...user, ...profileData } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setIsEditing(false);
  };

  const handleFollowUser = () => {
    if (!profileUser) return;

    const isFollowing = currentUser.following?.includes(profileUser.id);
    const updatedCurrentUser = {
      ...currentUser,
      following: isFollowing
        ? (currentUser.following || []).filter(id => id !== profileUser.id)
        : [...(currentUser.following || []), profileUser.id]
    };
    
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => {
      if (user.id === profileUser.id) {
        return {
          ...user,
          followers: isFollowing
            ? (user.followers || []).filter(id => id !== currentUser.id)
            : [...(user.followers || []), currentUser.id]
        };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleAddAchievement = () => {
    setShowAchievementForm(true);
  };

  const handleSaveAchievement = () => {
    const updatedUser = {
      ...currentUser,
      achievements: [...(currentUser.achievements || []), newAchievement]
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setShowAchievementForm(false);
    setNewAchievement({ title: '', description: '', game: '', earnedDate: '' });
  };

  const isFollowing = currentUser.following?.includes(profileUser?.id);

  return (
    <div className="max-w-2xl mx-auto p-4">
    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-start space-x-4">
          <div className={`w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center ${profileData.avatarColor}`}>
            <User size={40} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold truncate">{profileData.username}</h2>
              {!isOwnProfile && (
                <button
                  onClick={handleFollowUser}
                  className={`px-4 py-2 rounded-full ${
                    isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            <p className="text-gray-400 break-words">
              {profileData.bio || 'No bio yet'}
            </p>
            <div className="mt-2 text-sm text-gray-400">
              Status: {profileData.status}
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-800">
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.posts}</div>
            <div className="text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.followers}</div>
            <div className="text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.following}</div>
            <div className="text-gray-400">Following</div>
          </div>
        </div>

        {isOwnProfile && isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full p-2 rounded bg-gray-800 text-white"
                rows="3"
                placeholder="Tell us about yourself"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Favorite Game</label>
              <input
                type="text"
                value={profileData.favoriteGame}
                onChange={(e) => setProfileData({ ...profileData, favoriteGame: e.target.value })}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="What's your favorite game?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profile Color</label>
              <div className="flex space-x-2">
                {avatarColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setProfileData({ ...profileData, avatarColor: color })}
                    className={`w-8 h-8 rounded-full ${color} ${
                      profileData.avatarColor === color ? 'ring-2 ring-white' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={profileData.status}
                onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                className="w-full p-2 rounded bg-gray-800 text-white"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="gaming">Gaming</option>
                <option value="away">Away</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {profileData.favoriteGame && (
              <div>
                <h3 className="text-sm font-medium text-gray-400">Favorite Game</h3>
                <p>{profileData.favoriteGame}</p>
              </div>
            )}
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        )}

  {/* Achievement Showcase */}
  <div className="mt-8">
        <AchievementShowcase 
          achievements={currentUser.achievements || []}
          onAddAchievement={handleAddAchievement}
        />
      </div>

        {/* Profile Posts Section */}
        <div className="mt-8">
          <ProfilePosts 
            posts={posts}
            userId={profileUser?.id || currentUser.id}
            currentUser={currentUser}
            onLike={onLike}
            onComment={onComment}
          />
        </div>
      </div>

      {/* Achievement Form Modal */}
      {showAchievementForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Add New Achievement</h3>
            <input
              type="text"
              placeholder="Achievement Title"
              value={newAchievement.title}
              onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
              className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
            />
            <textarea
              placeholder="Description"
              value={newAchievement.description}
              onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
              className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Game"
              value={newAchievement.game}
              onChange={(e) => setNewAchievement({...newAchievement, game: e.target.value})}
              className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
            />
            <input
              type="date"
              value={newAchievement.earnedDate}
              onChange={(e) => setNewAchievement({...newAchievement, earnedDate: e.target.value})}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAchievementForm(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAchievement}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Save Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;