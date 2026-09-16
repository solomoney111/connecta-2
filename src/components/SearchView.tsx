import React, { useState } from 'react';
import { Search, Users, MessageSquare, Sparkles } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from './PostCard';

export const SearchView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    allUsers,
    posts,
    setViewingProfileUserId,
    setActiveView,
    getFriendshipStatus,
    sendFriendRequest,
  } = useSocial();

  const [filterType, setFilterType] = useState<'all' | 'users' | 'posts'>('all');

  const q = searchQuery.toLowerCase().trim();

  // Matched users
  const matchedUsers = allUsers.filter(
    (u) =>
      !q ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q)
  );

  // Matched posts
  const matchedPosts = posts.filter(
    (p) => !q || p.content.toLowerCase().includes(q)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      {/* Search Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-[#1877F2]" />
            <span>Search Connecta</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Discover community members, topics, hashtags, and posts.
          </p>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search people, bios, keywords, #hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#1877F2] focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-100 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-blue-50 text-[#1877F2]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setFilterType('users')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'users'
                ? 'bg-blue-50 text-[#1877F2]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            People ({matchedUsers.length})
          </button>
          <button
            onClick={() => setFilterType('posts')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'posts'
                ? 'bg-blue-50 text-[#1877F2]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Posts ({matchedPosts.length})
          </button>
        </div>
      </div>

      {/* Users Results */}
      {(filterType === 'all' || filterType === 'users') && matchedUsers.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#1877F2]" />
            People ({matchedUsers.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedUsers.map((user) => {
              const status = getFriendshipStatus(user.id);
              return (
                <div
                  key={user.id}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-between gap-3 transition-colors"
                >
                  <div
                    onClick={() => {
                      setViewingProfileUserId(user.id);
                      setActiveView('profile');
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                  >
                    <img
                      src={user.profileImage}
                      alt={user.firstName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-gray-900 truncate block">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-gray-500 truncate block">@{user.username}</span>
                      <span className="text-[11px] text-gray-400 truncate block">{user.location}</span>
                    </div>
                  </div>

                  {status === 'none' && (
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      className="px-2.5 py-1.5 bg-[#1877F2] hover:bg-[#145DBF] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts Results */}
      {(filterType === 'all' || filterType === 'posts') && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#1877F2]" />
            Posts ({matchedPosts.length})
          </h2>

          {matchedPosts.length > 0 ? (
            matchedPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-xs text-gray-400">
              No posts matched &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
