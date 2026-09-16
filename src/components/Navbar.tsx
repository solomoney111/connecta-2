import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Home,
  Users,
  MessageCircle,
  Bell,
  Shield,
  Code2,
  Bookmark,
  Settings,
  LogOut,
  ChevronDown,
  UserCheck,
  Check,
  Globe,
  SlidersHorizontal,
  Cloud,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { ActiveView } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    setCurrentUser,
    activeView,
    setActiveView,
    activeChatUserId,
    setActiveChatUserId,
    setViewingProfileUserId,
    getUnreadNotificationsCount,
    getUnreadMessagesCount,
    getPendingFriendRequestsCount,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    markConversationAsRead,
    getUserById,
    firebaseUser,
    isFirebaseSignedIn,
    isFirestoreConnected,
    signInWithGoogleAuth,
    signOutFirebaseAuth,
    authError,
  } = useSocial();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = getUnreadNotificationsCount();
  const unreadMsgs = getUnreadMessagesCount();
  const pendingFriends = getPendingFriendRequestsCount();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    if (view === 'profile') {
      setViewingProfileUserId(currentUser.id);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('search');
      setShowSearchDropdown(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogleAuth();
    } finally {
      setIsSigningIn(false);
    }
  };

  const filteredQuickUsers = allUsers
    .filter(
      (u) =>
        u.id !== currentUser.id &&
        (u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, 4);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E5E7EB] shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Left Section: Brand Logo & Search */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="connecta-logo-btn"
            onClick={() => handleNavClick('feed')}
            className="flex items-center gap-2.5 focus:outline-hidden group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white font-bold text-xl tracking-tight shadow-sm shadow-[#1877F2]/30 group-hover:bg-[#145DBF] transition-colors">
              C
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="font-extrabold text-xl tracking-tight text-[#1877F2]">
                connecta
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Firestore Live
              </span>
            </div>
          </button>

          {/* Search input with live dropdown */}
          <div ref={searchRef} className="relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                placeholder="Search Connecta..."
                className="w-48 lg:w-64 pl-9 pr-4 py-1.5 bg-[#F0F2F5] text-xs text-gray-800 rounded-full border border-transparent focus:border-[#1877F2] focus:bg-white focus:outline-hidden transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2 pointer-events-none" />
            </form>

            {/* Quick search popup */}
            {showSearchDropdown && searchQuery.trim() && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  People
                </div>
                {filteredQuickUsers.length > 0 ? (
                  filteredQuickUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setViewingProfileUserId(user.id);
                        setActiveView('profile');
                        setShowSearchDropdown(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[#F5F7FA] text-left transition-colors"
                    >
                      <img
                        src={user.profileImage}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-800 truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">@{user.username}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-400">No matching members found</div>
                )}
                <div className="border-t border-gray-100 mt-1 pt-1 px-3">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-semibold text-[#1877F2] hover:underline"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Primary Navigation Tabs */}
        <nav className="hidden sm:flex items-center gap-1">
          <button
            id="nav-tab-feed"
            onClick={() => handleNavClick('feed')}
            title="News Feed"
            className={`h-11 px-4 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              activeView === 'feed'
                ? 'text-[#1877F2] border-b-2 border-[#1877F2] rounded-b-none bg-blue-50/50'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="hidden lg:inline">Home</span>
          </button>

          <button
            id="nav-tab-friends"
            onClick={() => handleNavClick('friends')}
            title="Friends & Connections"
            className={`h-11 px-4 rounded-lg flex items-center gap-1.5 text-xs font-semibold relative transition-colors ${
              activeView === 'friends'
                ? 'text-[#1877F2] border-b-2 border-[#1877F2] rounded-b-none bg-blue-50/50'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="hidden lg:inline">Friends</span>
            {pendingFriends > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-[#DC2626] text-white text-[10px] font-bold rounded-full">
                {pendingFriends}
              </span>
            )}
          </button>

          <button
            id="nav-tab-messages"
            onClick={() => handleNavClick('messages')}
            title="Direct Messages"
            className={`h-11 px-4 rounded-lg flex items-center gap-1.5 text-xs font-semibold relative transition-colors ${
              activeView === 'messages'
                ? 'text-[#1877F2] border-b-2 border-[#1877F2] rounded-b-none bg-blue-50/50'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden lg:inline">Messages</span>
            {unreadMsgs > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-[#1877F2] text-white text-[10px] font-bold rounded-full">
                {unreadMsgs}
              </span>
            )}
          </button>

          <button
            id="nav-tab-php-arch"
            onClick={() => handleNavClick('php-architecture')}
            title="PHP & MySQL Codebase Spec"
            className={`h-11 px-4 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              activeView === 'php-architecture'
                ? 'text-[#1877F2] bg-blue-50/80 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Code2 className="w-4 h-4 text-[#1877F2]" />
            <span className="hidden xl:inline">PHP & SQL Code</span>
          </button>
        </nav>

        {/* Right Section: Firebase Google Auth, Notifications, User Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick Search trigger for mobile */}
          <button
            id="mobile-search-toggle"
            onClick={() => handleNavClick('search')}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Google Sign-in Button (if not signed in) */}
          {!isFirebaseSignedIn ? (
            <button
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Sign in with Google to sync with Firestore"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">
                {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
              </span>
              <span className="sm:hidden font-bold">Google</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[11px] font-medium">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Synced</span>
            </div>
          )}

          {/* Admin Moderation Button */}
          <button
            id="nav-admin-dashboard-btn"
            onClick={() => handleNavClick('admin')}
            title="Admin Moderation Dashboard"
            className={`p-2 rounded-full relative transition-colors ${
              activeView === 'admin'
                ? 'bg-blue-100 text-[#1877F2]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="sr-only">Admin Dashboard</span>
          </button>

          {/* Notifications Dropdown */}
          <div ref={notifMenuRef} className="relative">
            <button
              id="notifications-toggle-btn"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className={`p-2 rounded-full relative transition-colors ${
                showNotifMenu || activeView === 'notifications'
                  ? 'bg-blue-100 text-[#1877F2]'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Notifications Menu Popup */}
            {showNotifMenu && (
              <div className="absolute right-0 top-full mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 max-h-[85vh] flex flex-col">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-base text-gray-900">Notifications</span>
                  {unreadNotifs > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs font-semibold text-[#1877F2] hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto divide-y divide-gray-50 flex-1">
                  {notifications.slice(0, 7).map((notif) => {
                    const actor = getUserById(notif.actorId);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.type === 'friend_request') {
                            setActiveView('friends');
                          } else if (notif.type === 'message') {
                            setActiveChatUserId(notif.actorId);
                            markConversationAsRead(notif.actorId);
                            setActiveView('messages');
                          } else {
                            setActiveView('feed');
                          }
                          setShowNotifMenu(false);
                        }}
                        className={`px-4 py-3 flex items-start gap-3 hover:bg-[#F5F7FA] cursor-pointer transition-colors ${
                          !notif.isRead ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <img
                          src={actor?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={actor?.firstName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="text-gray-800 leading-snug">
                            <span className="font-semibold text-gray-900">
                              {actor?.firstName} {actor?.lastName}{' '}
                            </span>
                            {notif.metaText || 'interacted with your profile.'}
                          </p>
                          <span className="text-[11px] text-gray-400 mt-1 block">
                            Just now
                          </span>
                        </div>
                        {!notif.isRead && (
                          <div className="w-2 h-2 rounded-full bg-[#1877F2] shrink-0 mt-2" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-gray-100 text-center">
                  <button
                    onClick={() => {
                      setActiveView('notifications');
                      setShowNotifMenu(false);
                    }}
                    className="text-xs font-medium text-[#1877F2] hover:underline"
                  >
                    See all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Demo Account Switcher Dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-hidden"
            >
              <div className="relative">
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.firstName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1877F2]/30"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-76 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                {/* Current User Card */}
                <div
                  onClick={() => {
                    setViewingProfileUserId(currentUser.id);
                    setActiveView('profile');
                    setShowUserMenu(false);
                  }}
                  className="px-4 py-3 mx-2 rounded-xl hover:bg-[#F5F7FA] cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-gray-200"
                >
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.firstName}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-gray-900 truncate flex items-center gap-1.5">
                      <span>{currentUser.firstName} {currentUser.lastName}</span>
                      {isFirebaseSignedIn && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-[#1877F2] text-[10px] font-bold rounded-sm">
                          Google
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">@{currentUser.username}</div>
                    <div className="text-[11px] font-semibold text-[#1877F2] mt-0.5 flex items-center gap-1">
                      <span>View profile</span>
                      {isFirestoreConnected && (
                        <span className="text-emerald-600 font-normal">· Firestore Active</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Google Auth Status / Actions */}
                <div className="px-3 py-2 mx-2 my-1.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-[#1877F2]" />
                      Firebase Cloud Sync
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Connected
                    </span>
                  </div>

                  {isFirebaseSignedIn ? (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <div className="text-[11px] text-gray-600 truncate max-w-[170px]">
                        {firebaseUser?.email}
                      </div>
                      <button
                        onClick={async () => {
                          await signOutFirebaseAuth();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={async () => {
                          await handleGoogleSignIn();
                          setShowUserMenu(false);
                        }}
                        className="w-full mt-1 flex items-center justify-center gap-2 py-1.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign in with Google</span>
                      </button>
                      {authError && (
                        <p className="text-[11px] text-red-600 mt-1 leading-tight">{authError}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 my-2" />

                {/* Switch Demo Accounts section */}
                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Quick Account Switch
                </div>

                <div className="px-2 space-y-1">
                  {allUsers.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setShowUserMenu(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-[#1877F2] font-semibold'
                            : 'hover:bg-[#F5F7FA] text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={user.profileImage}
                            alt={user.firstName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>
                            {user.firstName} {user.lastName} ({user.role})
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#1877F2]" />}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 my-2" />

                {/* Secondary navigation items */}
                <div className="px-2 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveView('saved');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-xs font-medium text-gray-700 hover:bg-[#F5F7FA] transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-gray-500" />
                    Saved Posts
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-xs font-medium text-gray-700 hover:bg-[#F5F7FA] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings & Privacy
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('admin');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-xs font-medium text-gray-700 hover:bg-[#F5F7FA] transition-colors"
                  >
                    <Shield className="w-4 h-4 text-gray-500" />
                    Admin Moderation Panel
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('php-architecture');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-xs font-medium text-[#1877F2] bg-blue-50/50 hover:bg-blue-50 transition-colors"
                  >
                    <Code2 className="w-4 h-4 text-[#1877F2]" />
                    PHP 8 & MySQL Build Specs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
