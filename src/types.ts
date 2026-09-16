export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  status: 'active' | 'suspended';
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  friendsCount?: number;
  followersCount?: number;
  isBot?: boolean;
}

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface Friendship {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export type PostPrivacy = 'public' | 'friends' | 'only_me';

export interface ReactionRecord {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  type: ReactionType;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId?: string | null;
  content: string;
  createdAt: string;
  updatedAt?: string;
  reactions: Record<ReactionType, string[]>; // ReactionType -> array of userIds
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  privacy: PostPrivacy;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  reactions: Record<ReactionType, string[]>; // ReactionType -> array of userIds
  commentsCount: number;
  sharesCount: number;
  sharedPostId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'friend_request'
  | 'friend_accept'
  | 'reaction'
  | 'comment'
  | 'reply'
  | 'share'
  | 'message';

export interface Notification {
  id: string;
  userId: string;
  actorId: string;
  type: NotificationType;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
  metaText?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  postId?: string;
  commentId?: string;
  reportedUserId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface SavedPost {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export type ActiveView =
  | 'feed'
  | 'profile'
  | 'friends'
  | 'messages'
  | 'notifications'
  | 'search'
  | 'saved'
  | 'settings'
  | 'admin'
  | 'php-architecture';
