import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  MessageCircle,
  Search,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const FriendsView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    friendships,
    follows,
    acceptFriendRequest,
    rejectFriendRequest,
    sendFriendRequest,
    removeFriend,
    toggleFollow,
    getFriendshipStatus,
    setViewingProfileUserId,
    setActiveView,
    setActiveChatUserId,
    getUserById,
  } = useSocial();

  const [tab, setTab] = useState<'requests' | 'all' | 'suggestions' | 'following'>('requests');
  const [filterQuery, setFilterQuery] = useState('');

  // Received pending friend requests
  const receivedRequests = friendships.filter(
    (f) => f.receiverId === currentUser.id && f.status === 'pending'
  );

  // Sent pending requests
  const sentRequests = friendships.filter(
    (f) => f.senderId === currentUser.id && f.status === 'pending'
  );

  // Accepted friends
  const friendIds = friendships
    .filter((f) => f.status === 'accepted' && (f.senderId === currentUser.id || f.receiverId === currentUser.id))
    .map((f) => (f.senderId === currentUser.id ? f.receiverId : f.senderId));

  const friends = allUsers.filter((u) => friendIds.includes(u.id));

  // Suggested people
  const suggestions = allUsers.filter((u) => {
    if (u.id === currentUser.id) return false;
    const status = getFriendshipStatus(u.id);
    return status === 'none';
  });

  // Following
  const followingUsers = allUsers.filter((u) =>
    follows.some((f) => f.followerId === currentUser.id && f.followingId === u.id)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Top Header & Tab Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1877F2]" />
            <span>Friends & Connections</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your social network, pending requests, and discoveries.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 overflow-x-auto bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
          <button
            onClick={() => setTab('requests')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              tab === 'requests'
                ? 'bg-white text-[#1877F2] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Requests</span>
            {receivedRequests.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#DC2626] text-white text-[10px] font-bold rounded-full">
                {receivedRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              tab === 'all'
                ? 'bg-white text-[#1877F2] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Friends ({friends.length})
          </button>

          <button
            onClick={() => setTab('suggestions')}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              tab === 'suggestions'
                ? 'bg-white text-[#1877F2] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Suggestions ({suggestions.length})
          </button>

          <button
            onClick={() => setTab('following')}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              tab === 'following'
                ? 'bg-white text-[#1877F2] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Following ({followingUsers.length})
          </button>
        </div>
      </div>

      {/* Tab: Requests */}
      {tab === 'requests' && (
        <div className="space-y-6">
          {/* Received Requests */}
          <div>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              Received Friend Requests ({receivedRequests.length})
            </h2>

            {receivedRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {receivedRequests.map((req) => {
                  const sender = getUserById(req.senderId);
                  if (!sender) return null;
                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div className="p-4 flex items-center gap-3">
                        <img
                          src={sender.profileImage}
                          alt={sender.firstName}
                          onClick={() => {
                            setViewingProfileUserId(sender.id);
                            setActiveView('profile');
                          }}
                          className="w-14 h-14 rounded-2xl object-cover cursor-pointer hover:opacity-90"
                        />
                        <div className="min-w-0 flex-1">
                          <h3
                            onClick={() => {
                              setViewingProfileUserId(sender.id);
                              setActiveView('profile');
                            }}
                            className="font-bold text-sm text-gray-900 truncate hover:text-[#1877F2] cursor-pointer"
                          >
                            {sender.firstName} {sender.lastName}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">@{sender.username}</p>
                          <p className="text-[11px] text-gray-400 mt-1">{sender.location}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                        <button
                          onClick={() => acceptFriendRequest(req.id)}
                          className="flex-1 py-1.5 px-3 bg-[#1877F2] hover:bg-[#145DBF] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => rejectFriendRequest(req.id)}
                          className="py-1.5 px-3 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-xs text-gray-500">
                You have no pending friend requests right now.
              </div>
            )}
          </div>

          {/* Sent Pending Requests */}
          {sentRequests.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                Sent Requests ({sentRequests.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sentRequests.map((req) => {
                  const receiver = getUserById(req.receiverId);
                  if (!receiver) return null;
                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={receiver.profileImage}
                          alt={receiver.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-gray-900 block truncate">
                            {receiver.firstName} {receiver.lastName}
                          </span>
                          <span className="text-[11px] text-amber-600 font-medium">
                            Pending confirmation
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => rejectFriendRequest(req.id)}
                        className="text-xs text-gray-500 hover:text-red-600 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: All Friends */}
      {tab === 'all' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your friends..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#1877F2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {friends
              .filter((f) =>
                `${f.firstName} ${f.lastName} ${f.username}`
                  .toLowerCase()
                  .includes(filterQuery.toLowerCase())
              )
              .map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex items-center justify-between gap-3"
                >
                  <div
                    onClick={() => {
                      setViewingProfileUserId(friend.id);
                      setActiveView('profile');
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer group"
                  >
                    <img
                      src={friend.profileImage}
                      alt={friend.firstName}
                      className="w-12 h-12 rounded-2xl object-cover group-hover:ring-2 group-hover:ring-[#1877F2]/30 transition-all"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-gray-900 group-hover:text-[#1877F2] block truncate">
                        {friend.firstName} {friend.lastName}
                      </span>
                      <span className="text-xs text-gray-500">@{friend.username}</span>
                      <span className="text-[11px] text-gray-400 block truncate">{friend.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveChatUserId(friend.id)}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-[#1877F2] rounded-xl transition-colors"
                      title="Send Message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove Friend"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab: Suggestions */}
      {tab === 'suggestions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={user.profileImage}
                  alt={user.firstName}
                  onClick={() => {
                    setViewingProfileUserId(user.id);
                    setActiveView('profile');
                  }}
                  className="w-12 h-12 rounded-2xl object-cover cursor-pointer hover:opacity-90"
                />
                <div className="min-w-0 flex-1">
                  <h3
                    onClick={() => {
                      setViewingProfileUserId(user.id);
                      setActiveView('profile');
                    }}
                    className="font-bold text-sm text-gray-900 truncate hover:text-[#1877F2] cursor-pointer"
                  >
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{user.location}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 mb-3">{user.bio}</p>

              <button
                onClick={() => sendFriendRequest(user.id)}
                className="w-full py-2 px-3 bg-[#1877F2] hover:bg-[#145DBF] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Friend</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Following */}
      {tab === 'following' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {followingUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex items-center justify-between gap-3"
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
                  className="w-12 h-12 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <span className="font-bold text-sm text-gray-900 block truncate">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-gray-500">@{user.username}</span>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(user.id)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Unfollow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
