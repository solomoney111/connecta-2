import React, { useState } from 'react';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  Check,
  CheckCheck,
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { NotificationType } from '../types';

export const NotificationsView: React.FC = () => {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    markConversationAsRead,
    setActiveChatUserId,
    getUserById,
    setActiveView,
    setViewingProfileUserId,
  } = useSocial();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const filteredNotifications = myNotifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'reaction':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
      case 'reply':
        return <MessageCircle className="w-3.5 h-3.5 text-[#1877F2] fill-[#1877F2]" />;
      case 'friend_request':
      case 'friend_accept':
        return <UserPlus className="w-3.5 h-3.5 text-green-600" />;
      case 'share':
        return <Share2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'message':
        return <MessageCircle className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#1877F2]" />
            <span>Notifications</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Stay updated with your connections and content activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'unread' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
              }`}
            >
              Unread
            </button>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="p-2 text-[#1877F2] hover:bg-blue-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Mark all as read"
          >
            <CheckCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Mark read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden divide-y divide-gray-100">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const actor = getUserById(notif.actorId);
            return (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.type === 'friend_request' || notif.type === 'friend_accept') {
                    setActiveView('friends');
                  } else if (notif.type === 'message') {
                    setActiveChatUserId(notif.actorId);
                    markConversationAsRead(notif.actorId);
                    setActiveView('messages');
                  } else {
                    setActiveView('feed');
                  }
                }}
                className={`p-4 flex items-start gap-3.5 hover:bg-[#F5F7FA] cursor-pointer transition-colors ${
                  !notif.isRead ? 'bg-blue-50/40' : ''
                }`}
              >
                {/* Actor Avatar with Type Badge */}
                <div className="relative shrink-0">
                  <img
                    src={actor?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={actor?.firstName}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center">
                    {getIcon(notif.type)}
                  </div>
                </div>

                {/* Text Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 leading-snug">
                    <strong className="text-gray-900 font-bold">
                      {actor?.firstName} {actor?.lastName}{' '}
                    </strong>
                    {notif.metaText || 'interacted with your profile.'}
                  </p>
                  <span className="text-[11px] text-gray-400 mt-1 block">Recently</span>
                </div>

                {/* Unread indicator */}
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1877F2] shrink-0 mt-2" />
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-gray-400">
            No notifications to display.
          </div>
        )}
      </div>
    </div>
  );
};
