import { useState } from 'react';
import Header from './components/Layout/Header';
import AuthScreen from './components/Auth/AuthScreen';
import Navigation from './components/Navigation/Navigation';
import DiscoverView from './components/Discover/DiscoverView';
import HomeFeed from './components/Feed/HomeFeed';
import CreatePost from './components/Post/CreatePost';
import UserProfile from './components/Profile/UserProfile';
import GroupChat from './components/Chat/GroupChat';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('currentUser') !== null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [followedCategories, setFollowedCategories] = useState(() => {
    const savedCategories = localStorage.getItem('followedCategories');
    return savedCategories ? JSON.parse(savedCategories) : [];
  });
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      return parsedPosts.map(post => ({
        ...post,
        likes: post.likes || [],
        comments: post.comments || []
      }));
    }
    return [];
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleLike = (postId) => {
    setPosts(prevPosts => {
      const newPosts = prevPosts.map(post => {
        if (post.id === postId) {
          const postLikes = post.likes || [];
          const likes = postLikes.includes(currentUser.id)
            ? postLikes.filter(id => id !== currentUser.id)
            : [...postLikes, currentUser.id];
          return { ...post, likes };
        }
        return post;
      });
      localStorage.setItem('posts', JSON.stringify(newPosts));
      return newPosts;
    });
  };

  const handleComment = (postId, comment) => {
    setPosts(prevPosts => {
      const newPosts = prevPosts.map(post => {
        if (post.id === postId) {
          const postComments = post.comments || [];
          return { 
            ...post, 
            comments: [...postComments, comment]
          };
        }
        return post;
      });
      localStorage.setItem('posts', JSON.stringify(newPosts));
      return newPosts;
    });
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId === currentUser.id ? null : userId);
    setCurrentView('profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedUserId(null);
  };

  const handleProfileClick = () => {
    setSelectedUserId(null);
    setCurrentView('profile');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {!isLoggedIn ? (
        <AuthScreen setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />
      ) : (
        <div className="h-screen flex flex-col">
          <Header 
            currentUser={currentUser} 
            onLogout={handleLogout}
            setCurrentView={handleProfileClick}
          />
          <main className="flex-1 overflow-y-auto">
            {currentView === 'home' && (
              <HomeFeed 
                posts={posts}
                currentUser={currentUser}
                followedCategories={followedCategories}
                onLike={handleLike}
                onComment={handleComment}
                onUserClick={handleUserClick}
              />
            )}
            {currentView === 'discover' && (
              <DiscoverView 
                followedCategories={followedCategories}
                setFollowedCategories={setFollowedCategories}
                onCategorySelect={(category) => {
                  setSelectedCategory(category);
                  setCurrentView('chat');
                }}
              />
            )}
            {currentView === 'profile' && (
              <UserProfile 
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                userId={selectedUserId}
                posts={posts}
                onUserClick={handleUserClick}
                onLike={handleLike}
                onComment={handleComment}
              />
            )}
            {currentView === 'chat' && (
              <GroupChat 
                currentUser={currentUser}
                category={selectedCategory}
              />
            )}
          </main>
          <CreatePost 
            currentUser={currentUser}
            setPosts={setPosts}
            followedCategories={followedCategories}
          />
          <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        </div>
      )}
    </div>
  );
}

export default App;