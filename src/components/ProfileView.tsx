import React, { useState } from 'react';
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Edit3,
  UserPlus,
  UserCheck,
  UserX,
  MessageCircle,
  Camera,
  Check,
  Globe,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from './PostCard';
import { PostComposer } from './PostComposer';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    viewingProfileUserId,
    getUserById,
    getFriendshipStatus,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    toggleFollow,
    follows,
    posts,
    friendships,
    allUsers,
    updateProfile,
    setActiveChatUserId,
    setViewingProfileUserId,
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);

  // Determine user to show
  const targetUserId = viewingProfileUserId || currentUser.id;
  const user = getUserById(targetUserId) || currentUser;
  const isOwnProfile = user.id === currentUser.id;

  // Edit form state
  const [editFirstName, setEditFirstName] = useState(user.firstName);
  const [editLastName, setEditLastName] = useState(user.lastName);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location);
  const [editWebsite, setEditWebsite] = useState(user.website);
  const [editProfileImage, setEditProfileImage] = useState(user.profileImage);
  const [editCoverImage, setEditCoverImage] = useState(user.coverImage);

  const friendshipStatus = getFriendshipStatus(user.id);
  const isFollowing = follows.some((f) => f.followerId === currentUser.id && f.followingId === user.id);

  // User posts
  const userPosts = posts.filter((p) => p.userId === user.id);

  // User photos
  const userPhotos = userPosts.filter((p) => Boolean(p.image)).map((p) => p.image as string);

  // User friends
  const userFriendIds = friendships
    .filter((f) => f.status === 'accepted' && (f.senderId === user.id || f.receiverId === user.id))
    .map((f) => (f.senderId === user.id ? f.receiverId : f.senderId));

  const userFriends = allUsers.filter((u) => userFriendIds.includes(u.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(currentUser.id, {
      firstName: editFirstName,
      lastName: editLastName,
      bio: editBio,
      location: editLocation,
      website: editWebsite,
      profileImage: editProfileImage,
      coverImage: editCoverImage,
    });
    setShowEditModal(false);
  };

  const handleFriendshipAction = () => {
    if (friendshipStatus === 'none') {
      sendFriendRequest(user.id);
    } else if (friendshipStatus === 'pending_received') {
      // Find request id
      const req = friendships.find((f) => f.senderId === user.id && f.receiverId === currentUser.id);
      if (req) acceptFriendRequest(req.id);
    } else if (friendshipStatus === 'accepted') {
      removeFriend(user.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* 1. Profile Banner & Header Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xs">
        {/* Cover Photo */}
        <div className="h-48 sm:h-72 w-full relative bg-gray-200">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {isOwnProfile && (
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Edit Cover</span>
            </button>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative">
                <img
                  src={user.profileImage}
                  alt={user.firstName}
                  className="w-32 h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl"
                />
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white" />
              </div>

              <div className="sm:pb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">@{user.username}</p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-gray-500">
                  <span>
                    <strong className="text-gray-900">{userFriends.length}</strong> friends
                  </span>
                  <span>·</span>
                  <span>
                    <strong className="text-gray-900">{user.followersCount || 0}</strong> followers
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pb-2">
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleFriendshipAction}
                    className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors ${
                      friendshipStatus === 'accepted'
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        : friendshipStatus === 'pending_received'
                        ? 'bg-[#1877F2] text-white hover:bg-[#145DBF]'
                        : friendshipStatus === 'pending_sent'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-[#1877F2] text-white hover:bg-[#145DBF]'
                    }`}
                  >
                    {friendshipStatus === 'accepted' && (
                      <>
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span>Friends</span>
                      </>
                    )}
                    {friendshipStatus === 'pending_received' && (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm Request</span>
                      </>
                    )}
                    {friendshipStatus === 'pending_sent' && (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Request Sent</span>
                      </>
                    )}
                    {friendshipStatus === 'none' && (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Add Friend</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-colors ${
                      isFollowing
                        ? 'bg-gray-50 border-gray-300 text-gray-700'
                        : 'border-[#1877F2] text-[#1877F2] hover:bg-blue-50'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>

                  <button
                    onClick={() => setActiveChatUserId(user.id)}
                    className="p-2 bg-[#1877F2] hover:bg-[#145DBF] text-white rounded-xl transition-colors"
                    title="Send Message"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio & Details Bar */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">{user.bio}</p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-gray-500 mt-3">
              {user.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#1877F2]" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1877F2] hover:underline"
                  >
                    {user.website.replace('https://', '')}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Joined January 2024</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-t border-gray-100 mt-5 pt-2">
            {[
              { id: 'posts', label: 'Posts' },
              { id: 'about', label: 'About' },
              { id: 'friends', label: `Friends (${userFriends.length})` },
              { id: 'photos', label: `Photos (${userPhotos.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-[#1877F2]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Tab Contents */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left info column */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Intro</h3>
              <p className="text-xs text-gray-600 mb-3">{user.bio}</p>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Lives in <strong>{user.location}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span>Role: <strong className="capitalize">{user.role}</strong></span>
                </div>
              </div>
            </div>

            {/* Friends preview widget */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Friends</h3>
                  <span className="text-xs text-gray-400">{userFriends.length} friends</span>
                </div>
                <button
                  onClick={() => setActiveTab('friends')}
                  className="text-xs text-[#1877F2] font-semibold hover:underline"
                >
                  See all
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {userFriends.slice(0, 6).map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setViewingProfileUserId(f.id)}
                    className="cursor-pointer group"
                  >
                    <img
                      src={f.profileImage}
                      alt={f.firstName}
                      className="w-full aspect-square rounded-xl object-cover group-hover:opacity-90"
                    />
                    <span className="text-[11px] font-medium text-gray-800 block truncate mt-1">
                      {f.firstName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed Column */}
          <div className="md:col-span-2 space-y-4">
            {isOwnProfile && <PostComposer />}

            {userPosts.length > 0 ? (
              userPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-xs text-gray-500">
                No posts shared yet.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">About {user.firstName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-400 font-semibold uppercase">Email</span>
              <p className="text-sm font-medium text-gray-800">{user.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-400 font-semibold uppercase">Location</span>
              <p className="text-sm font-medium text-gray-800">{user.location}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-400 font-semibold uppercase">Website</span>
              <p className="text-sm font-medium text-[#1877F2]">{user.website}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-400 font-semibold uppercase">Platform Status</span>
              <p className="text-sm font-medium text-green-700 capitalize">{user.status}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Friends ({userFriends.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userFriends.map((f) => (
              <div
                key={f.id}
                onClick={() => setViewingProfileUserId(f.id)}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-3 cursor-pointer transition-colors"
              >
                <img
                  src={f.profileImage}
                  alt={f.firstName}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-sm text-gray-900 block truncate">
                    {f.firstName} {f.lastName}
                  </span>
                  <span className="text-xs text-gray-500">@{f.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Photos ({userPhotos.length})
          </h2>
          {userPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {userPhotos.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-100"
                >
                  <img src={img} alt="User gallery" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-400">
              No photos published yet.
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-lg text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Website</label>
                  <input
                    type="url"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Profile Photo URL</label>
                <input
                  type="url"
                  value={editProfileImage}
                  onChange={(e) => setEditProfileImage(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Cover Photo URL</label>
                <input
                  type="url"
                  value={editCoverImage}
                  onChange={(e) => setEditCoverImage(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-[#1877F2] hover:bg-[#145DBF] text-white rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
