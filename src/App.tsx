import React from 'react';
import { SocialProvider, useSocial } from './context/SocialContext';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { FeedView } from './components/FeedView';
import { ProfileView } from './components/ProfileView';
import { FriendsView } from './components/FriendsView';
import { MessagesView } from './components/MessagesView';
import { NotificationsView } from './components/NotificationsView';
import { SavedPostsView } from './components/SavedPostsView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { PhpCodeViewer } from './components/PhpCodeViewer';
import { SearchView } from './components/SearchView';
import { FloatingChatWindow } from './components/FloatingChatWindow';
import {
  Home,
  Users,
  MessageCircle,
  Bell,
  Code2,
} from 'lucide-react';

const AppLayout: React.FC = () => {
  const { activeView, setActiveView, notifications, currentUser } = useSocial();

  const unreadNotifCount = notifications.filter(
    (n) => n.userId === currentUser.id && !n.isRead
  ).length;

  const renderActiveView = () => {
    switch (activeView) {
      case 'feed':
        return <FeedView />;
      case 'profile':
        return <ProfileView />;
      case 'friends':
        return <FriendsView />;
      case 'messages':
        return <MessagesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'saved':
        return <SavedPostsView />;
      case 'settings':
        return <SettingsView />;
      case 'admin':
        return <AdminView />;
      case 'php_backend':
        return <PhpCodeViewer />;
      case 'search':
        return <SearchView />;
      default:
        return <FeedView />;
    }
  };

  const showRightSidebar = activeView === 'feed' || activeView === 'search';

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 flex flex-col font-sans selection:bg-[#1877F2]/20 selection:text-[#1877F2]">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Main 3-Column Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 md:px-6 pt-4 pb-16 sm:pb-8 flex gap-4 xl:gap-6 justify-between items-start">
        {/* Left Navigation Sidebar */}
        <LeftSidebar />

        {/* Center Dynamic Content Area */}
        <section className="flex-1 min-w-0">
          {renderActiveView()}
        </section>

        {/* Right Social Sidebar (Online Contacts & Friend Requests) */}
        {showRightSidebar && <RightSidebar />}
      </main>

      {/* 3. Floating Instant Messenger Window */}
      <FloatingChatWindow />

      {/* 4. Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 z-40 flex items-center justify-around px-2 shadow-lg">
        <button
          onClick={() => setActiveView('feed')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
            activeView === 'feed' ? 'text-[#1877F2]' : 'text-gray-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Feed</span>
        </button>

        <button
          onClick={() => setActiveView('friends')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
            activeView === 'friends' ? 'text-[#1877F2]' : 'text-gray-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Friends</span>
        </button>

        <button
          onClick={() => setActiveView('messages')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
            activeView === 'messages' ? 'text-[#1877F2]' : 'text-gray-500'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">Chat</span>
        </button>

        <button
          onClick={() => setActiveView('notifications')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl relative transition-colors ${
            activeView === 'notifications' ? 'text-[#1877F2]' : 'text-gray-500'
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadNotifCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-[#DC2626] rounded-full" />
          )}
          <span className="text-[10px] font-medium">Alerts</span>
        </button>

        <button
          onClick={() => setActiveView('php_backend')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
            activeView === 'php_backend' ? 'text-[#1877F2]' : 'text-gray-500'
          }`}
        >
          <Code2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">PHP/SQL</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <SocialProvider>
      <AppLayout />
    </SocialProvider>
  );
}
