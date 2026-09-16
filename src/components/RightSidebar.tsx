import React from 'react';
import { UserPlus, Check, X, MessageSquare, MoreHorizontal } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const RightSidebar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    friendships,
    acceptFriendRequest,
    rejectFriendRequest,
    sendFriendRequest,
    getFriendshipStatus,
    setViewingProfileUserId,
    setActiveView,
    setActiveChatUserId,
    getUserById,
    markConversationAsRead,
    getUnreadMessagesCountForContact,
  } = useSocial();

  // Pending friend requests sent TO currentUser
  const receivedRequests = friendships.filter(
    (f) => f.receiverId === currentUser.id && f.status === 'pending'
  );

  // Suggested users (not current user and not already friends/pending)
  const suggestions = allUsers.filter((u) => {
    if (u.id === currentUser.id) return false;
    const status = getFriendshipStatus(u.id);
    return status === 'none';
  });

  // Friends for the contacts list
  const friendUserIds = friendships
    .filter((f) => f.status === 'accepted' && (f.senderId === currentUser.id || f.receiverId === currentUser.id))
    .map((f) => (f.senderId === currentUser.id ? f.receiverId : f.senderId));

  const contactUsers = [...allUsers]
    .filter((u) => u.id !== currentUser.id && (u.isBot || friendUserIds.includes(u.id) || suggestions.length > 0))
    .sort((a, b) => {
      if (a.isBot && !b.isBot) return -1;
      if (!a.isBot && b.isBot) return 1;
      return 0;
    });

  return (
    <aside className="w-72 xl:w-80 shrink-0 hidden xl:block sticky top-18 h-[calc(100vh-4.5rem)] overflow-y-auto pl-2 pb-8 select-none">
      {/* 1. Pending Friend Requests Section */}
      {receivedRequests.length > 0 && (
        <div className="mb-5 bg-white rounded-2xl p-3.5 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Friend Requests ({receivedRequests.length})
            </span>
            <button
              onClick={() => setActiveView('friends')}
              className="text-xs text-[#1877F2] font-semibold hover:underline"
            >
              See all
            </button>
          </div>

          <div className="space-y-3">
            {receivedRequests.map((req) => {
              const sender = getUserById(req.senderId);
              if (!sender) return null;
              return (
                <div key={req.id} className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={sender.profileImage}
                      alt={sender.firstName}
                      onClick={() => {
                        setViewingProfileUserId(sender.id);
                        setActiveView('profile');
                      }}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90"
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        onClick={() => {
                          setViewingProfileUserId(sender.id);
                          setActiveView('profile');
                        }}
                        className="font-bold text-xs text-gray-900 truncate hover:text-[#1877F2] cursor-pointer"
                      >
                        {sender.firstName} {sender.lastName}
                      </div>
                      <div className="text-[11px] text-gray-500">14 mutual connections</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-12">
                    <button
                      onClick={() => acceptFriendRequest(req.id)}
                      className="flex-1 py-1.5 px-3 bg-[#1877F2] hover:bg-[#145DBF] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Confirm
                    </button>
                    <button
                      onClick={() => rejectFriendRequest(req.id)}
                      className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Suggested Connections */}
      {suggestions.length > 0 && (
        <div className="mb-5 bg-white rounded-2xl p-3.5 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              People You May Know
            </span>
          </div>

          <div className="space-y-3">
            {suggestions.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-2">
                <div
                  onClick={() => {
                    setViewingProfileUserId(user.id);
                    setActiveView('profile');
                  }}
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                >
                  <img
                    src={user.profileImage}
                    alt={user.firstName}
                    className="w-9 h-9 rounded-full object-cover group-hover:ring-2 group-hover:ring-[#1877F2]/40 transition-all"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-gray-900 group-hover:text-[#1877F2] truncate">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">{user.location}</div>
                  </div>
                </div>

                <button
                  onClick={() => sendFriendRequest(user.id)}
                  title="Add Friend"
                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#1877F2] rounded-lg transition-colors shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Direct Messaging Contacts */}
      <div className="px-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Contacts
          </span>
          <div className="flex items-center gap-1 text-gray-400">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-0.5">
          {contactUsers.map((user) => {
            const unreadCount = getUnreadMessagesCountForContact(user.id);
            return (
              <div
                key={user.id}
                onClick={() => {
                  setActiveChatUserId(user.id);
                  markConversationAsRead(user.id);
                }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/60 cursor-pointer transition-colors group"
              >
                <div className="relative">
                  <img
                    src={user.profileImage}
                    alt={user.firstName}
                    className={`w-9 h-9 rounded-full object-cover ${
                      user.isBot ? 'ring-1.5 ring-purple-400' : ''
                    }`}
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                      user.isBot ? 'bg-purple-500' : 'bg-green-500'
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-semibold text-gray-800 group-hover:text-[#1877F2] truncate">
                        {user.firstName} {user.lastName}
                      </span>
                      {user.isBot && (
                        <span className="text-[8px] font-black uppercase px-1 py-0.2 bg-purple-100 text-purple-700 rounded border border-purple-200 shrink-0">
                          BOT
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <span className="w-4 h-4 bg-[#1877F2] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {user.isBot ? 'AI Companion' : 'Online'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
