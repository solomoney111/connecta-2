import React from 'react';
import {
  Home,
  Users,
  MessageCircle,
  Bell,
  Bookmark,
  Shield,
  Code2,
  Settings,
  Sparkles,
  Compass,
  Hash,
  ExternalLink,
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { ActiveView } from '../types';

export const LeftSidebar: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    setViewingProfileUserId,
    getPendingFriendRequestsCount,
    getUnreadMessagesCount,
    getUnreadNotificationsCount,
    savedPostIds,
  } = useSocial();

  const pendingFriends = getPendingFriendRequestsCount();
  const unreadMessages = getUnreadMessagesCount();
  const unreadNotifs = getUnreadNotificationsCount();

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    if (view === 'profile') {
      setViewingProfileUserId(currentUser.id);
    }
  };

  const navItems = [
    { id: 'feed', label: 'News Feed', icon: Home, view: 'feed' as ActiveView },
    {
      id: 'friends',
      label: 'Friends & Requests',
      icon: Users,
      view: 'friends' as ActiveView,
      badge: pendingFriends > 0 ? pendingFriends : undefined,
    },
    {
      id: 'messages',
      label: 'Messenger',
      icon: MessageCircle,
      view: 'messages' as ActiveView,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      view: 'notifications' as ActiveView,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
    },
    {
      id: 'saved',
      label: 'Saved Posts',
      icon: Bookmark,
      view: 'saved' as ActiveView,
      badge: savedPostIds.length > 0 ? savedPostIds.length : undefined,
    },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings, view: 'settings' as ActiveView },
    {
      id: 'admin',
      label: 'Admin Moderation',
      icon: Shield,
      view: 'admin' as ActiveView,
      highlight: true,
    },
    {
      id: 'php-arch',
      label: 'PHP & MySQL Architecture',
      icon: Code2,
      view: 'php-architecture' as ActiveView,
      highlightCode: true,
    },
  ];

  return (
    <aside className="w-64 xl:w-72 shrink-0 hidden lg:block sticky top-18 h-[calc(100vh-4.5rem)] overflow-y-auto pr-2 pb-8 select-none">
      {/* Current User Card */}
      <div
        id="sidebar-current-user-card"
        onClick={() => handleNav('profile')}
        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/60 cursor-pointer transition-colors mb-2"
      >
        <div className="relative">
          <img
            src={currentUser.profileImage}
            alt={currentUser.firstName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1877F2]/40"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm text-[#1F2937] truncate">
            {currentUser.firstName} {currentUser.lastName}
          </div>
          <div className="text-xs text-gray-500 truncate">@{currentUser.username}</div>
        </div>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleNav(item.view)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 text-[#1877F2]'
                  : item.highlightCode
                  ? 'text-[#1877F2] hover:bg-blue-50/60'
                  : 'text-gray-700 hover:bg-gray-200/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive
                      ? 'bg-[#1877F2] text-white'
                      : item.highlightCode
                      ? 'bg-blue-100 text-[#1877F2]'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-bold bg-[#DC2626] text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-gray-200 my-4" />

      {/* Shortcuts / Popular Topics */}
      <div className="px-3">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#1877F2]" />
          Trending Communities
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 px-2 py-1.5 text-gray-600 hover:bg-gray-200/60 rounded-lg cursor-pointer">
            <Hash className="w-3.5 h-3.5 text-[#1877F2]" />
            <span className="font-medium text-gray-800 truncate">#WebDevelopment</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-gray-600 hover:bg-gray-200/60 rounded-lg cursor-pointer">
            <Hash className="w-3.5 h-3.5 text-[#1877F2]" />
            <span className="font-medium text-gray-800 truncate">#UIUXDesign</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-gray-600 hover:bg-gray-200/60 rounded-lg cursor-pointer">
            <Hash className="w-3.5 h-3.5 text-[#1877F2]" />
            <span className="font-medium text-gray-800 truncate">#PhotographyDaily</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-gray-600 hover:bg-gray-200/60 rounded-lg cursor-pointer">
            <Hash className="w-3.5 h-3.5 text-[#1877F2]" />
            <span className="font-medium text-gray-800 truncate">#SoundAndMusic</span>
          </div>
        </div>
      </div>

      {/* Bottom Mini Footer */}
      <div className="px-3 mt-6 text-[11px] text-gray-400 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Cookies</span>
        </div>
        <div>Connecta © 2026 — Social Networking Platform</div>
      </div>
    </aside>
  );
};
