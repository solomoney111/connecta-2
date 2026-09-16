import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  Comment,
  Friendship,
  Follow,
  Message,
  Notification,
  Report,
  ReactionType,
  PostPrivacy,
  ActiveView,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_FRIENDSHIPS,
  INITIAL_FOLLOWS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
} from '../data/initialData';
import { generateDndBotResponse } from '../lib/dndChatbot';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  onAuthStateChanged,
  FirebaseUser,
} from '../lib/firebase';
import {
  syncUserToFirestore,
  fetchUsersFromFirestore,
  savePostToFirestore,
  deletePostFromFirestore,
  fetchPostsFromFirestore,
  saveCommentToFirestore,
  deleteCommentFromFirestore,
  fetchCommentsFromFirestore,
  saveFriendshipToFirestore,
  deleteFriendshipFromFirestore,
  fetchFriendshipsFromFirestore,
  saveFollowToFirestore,
  deleteFollowFromFirestore,
  fetchFollowsFromFirestore,
  saveMessageToFirestore,
  fetchMessagesFromFirestore,
  saveNotificationToFirestore,
  fetchNotificationsFromFirestore,
  saveReportToFirestore,
  fetchReportsFromFirestore,
  seedInitialDataToFirestore,
} from '../lib/firestoreService';

interface SocialContextType {
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  viewingProfileUserId: string | null;
  setViewingProfileUserId: (userId: string | null) => void;
  activeChatUserId: string | null;
  setActiveChatUserId: (userId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  posts: Post[];
  comments: Comment[];
  friendships: Friendship[];
  follows: Follow[];
  messages: Message[];
  notifications: Notification[];
  reports: Report[];
  savedPostIds: string[];

  // Firebase Auth & Cloud Firestore State
  firebaseUser: FirebaseUser | null;
  isFirebaseSignedIn: boolean;
  isFirestoreConnected: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  signInWithGoogleAuth: () => Promise<void>;
  signOutFirebaseAuth: () => Promise<void>;
  seedFirestoreData: () => Promise<void>;

  // Actions
  createPost: (content: string, privacy: PostPrivacy, image?: string) => void;
  editPost: (postId: string, content: string, privacy: PostPrivacy) => void;
  deletePost: (postId: string) => void;
  reactToPost: (postId: string, type: ReactionType) => void;
  sharePost: (postId: string) => void;
  addComment: (postId: string, content: string, parentId?: string | null) => void;
  deleteComment: (commentId: string) => void;
  reactToComment: (commentId: string, type: ReactionType) => void;

  sendFriendRequest: (targetUserId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (targetUserId: string) => void;
  toggleFollow: (targetUserId: string) => void;

  sendMessage: (receiverId: string, content: string) => void;
  simulateQuickReply: (contactId: string) => void;
  markConversationAsRead: (contactId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  toggleSavePost: (postId: string) => void;

  createReport: (reportedUserId: string, reason: string, postId?: string, commentId?: string) => void;
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;
  updateProfile: (userId: string, data: Partial<User>) => void;
  adminToggleUserStatus: (userId: string) => void;
  adminDeletePost: (postId: string) => void;
  resetAllData: () => void;

  // Helpers
  getUserById: (id: string) => User | undefined;
  getFriendshipStatus: (targetUserId: string) => 'none' | 'pending_sent' | 'pending_received' | 'accepted';
  getUnreadNotificationsCount: () => number;
  getUnreadMessagesCount: () => number;
  getUnreadMessagesCountForContact: (contactId: string) => number;
  getPendingFriendRequestsCount: () => number;
  botTypingContactId: string | null;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const STORAGE_KEY = 'connecta_state_v1';

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage or fallback to initial data, merging any new default entities (e.g. DND chatbot)
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((u) => u.id));
        const missing = INITIAL_USERS.filter((u) => !existingIds.has(u.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return users[0]?.id || 'user_1';
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
      if (saved) {
        const parsed: Post[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((p) => p.id));
        const missing = INITIAL_POSTS.filter((p) => !existingIds.has(p.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      }
      return INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_comments`);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const [friendships, setFriendships] = useState<Friendship[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_friendships`);
      return saved ? JSON.parse(saved) : INITIAL_FRIENDSHIPS;
    } catch {
      return INITIAL_FRIENDSHIPS;
    }
  });

  const [follows, setFollows] = useState<Follow[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_follows`);
      return saved ? JSON.parse(saved) : INITIAL_FOLLOWS;
    } catch {
      return INITIAL_FOLLOWS;
    }
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
      if (saved) {
        const parsed: Message[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((m) => m.id));
        const missing = INITIAL_MESSAGES.filter((m) => !existingIds.has(m.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      }
      return INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reports`);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_saved_posts`);
      return saved ? JSON.parse(saved) : ['post_1'];
    } catch {
      return ['post_1'];
    }
  });

  // UI state
  const [activeView, setActiveView] = useState<ActiveView>('feed');
  const [viewingProfileUserId, setViewingProfileUserId] = useState<string | null>(null);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [botTypingContactId, setBotTypingContactId] = useState<string | null>(null);

  // Firebase Auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Monitor Firebase Auth changes and synchronize user profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthLoading(false);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const names = (fbUser.displayName || 'Google User').trim().split(' ');
        const firstName = names[0] || 'User';
        const lastName = names.slice(1).join(' ') || '';
        const username = (fbUser.email?.split('@')[0] || `user_${Date.now()}`)
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '');

        const existingUser = users.find((u) => u.id === fbUser.uid || u.email === fbUser.email);
        const authedUser: User = existingUser
          ? {
              ...existingUser,
              id: fbUser.uid,
              profileImage: fbUser.photoURL || existingUser.profileImage,
              updatedAt: new Date().toISOString(),
            }
          : {
              id: fbUser.uid,
              firstName,
              lastName,
              username,
              email: fbUser.email || '',
              profileImage:
                fbUser.photoURL ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
              coverImage:
                'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1600&auto=format&fit=crop&q=80',
              bio: 'Active member on Connecta social network',
              location: 'San Francisco, CA',
              website: 'https://connecta.dev',
              status: 'active',
              role: 'user',
              friendsCount: 0,
              followersCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

        // Add to local users if new
        setUsers((prev) => {
          const exists = prev.some((u) => u.id === authedUser.id);
          return exists ? prev.map((u) => (u.id === authedUser.id ? authedUser : u)) : [authedUser, ...prev];
        });
        setCurrentUserId(authedUser.id);

        // Sync with Firestore
        try {
          await syncUserToFirestore(authedUser);
        } catch (e) {
          console.error('Failed to sync auth user to Firestore:', e);
        }
      } else {
        setFirebaseUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch or Seed Firestore on initialization
  useEffect(() => {
    const initFirestoreSync = async () => {
      try {
        const cloudPosts = await fetchPostsFromFirestore();
        if (cloudPosts && cloudPosts.length > 0) {
          // Merge cloud posts with any fresh local items
          setPosts((prev) => {
            const cloudIds = new Set(cloudPosts.map((p) => p.id));
            const localOnly = prev.filter((p) => !cloudIds.has(p.id));
            return [...localOnly, ...cloudPosts];
          });
          setIsFirestoreConnected(true);
        } else {
          // Attempt seeding
          await seedInitialDataToFirestore();
        }

        const cloudUsers = await fetchUsersFromFirestore();
        if (cloudUsers && cloudUsers.length > 0) {
          setUsers((prev) => {
            const cloudIds = new Set(cloudUsers.map((u) => u.id));
            const localOnly = prev.filter((u) => !cloudIds.has(u.id));
            return [...localOnly, ...cloudUsers];
          });
        }
      } catch (err) {
        console.warn('Firestore initial sync note:', err);
      }
    };

    initFirestoreSync();
  }, []);

  // Persist state updates to localStorage for offline resilience
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(posts));
      localStorage.setItem(`${STORAGE_KEY}_comments`, JSON.stringify(comments));
      localStorage.setItem(`${STORAGE_KEY}_friendships`, JSON.stringify(friendships));
      localStorage.setItem(`${STORAGE_KEY}_follows`, JSON.stringify(follows));
      localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messages));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_reports`, JSON.stringify(reports));
      localStorage.setItem(`${STORAGE_KEY}_saved_posts`, JSON.stringify(savedPostIds));
    } catch {
      // ignore quota errors
    }
  }, [users, posts, comments, friendships, follows, messages, notifications, reports, savedPostIds]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
  };

  const getUserById = (id: string) => users.find((u) => u.id === id);

  const getFriendshipStatus = (targetUserId: string): 'none' | 'pending_sent' | 'pending_received' | 'accepted' => {
    if (targetUserId === currentUser.id) return 'none';
    const relation = friendships.find(
      (f) =>
        (f.senderId === currentUser.id && f.receiverId === targetUserId) ||
        (f.senderId === targetUserId && f.receiverId === currentUser.id)
    );
    if (!relation) return 'none';
    if (relation.status === 'accepted') return 'accepted';
    if (relation.status === 'pending') {
      return relation.senderId === currentUser.id ? 'pending_sent' : 'pending_received';
    }
    return 'none';
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length;
  };

  const getUnreadMessagesCount = () => {
    return messages.filter((m) => m.receiverId === currentUser.id && !m.isRead).length;
  };

  const getUnreadMessagesCountForContact = (contactId: string) => {
    return messages.filter(
      (m) => m.senderId === contactId && m.receiverId === currentUser.id && !m.isRead
    ).length;
  };

  const getPendingFriendRequestsCount = () => {
    return friendships.filter((f) => f.receiverId === currentUser.id && f.status === 'pending').length;
  };

  // Google Sign-in action
  const signInWithGoogleAuth = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed');
    }
  };

  // Sign-out action
  const signOutFirebaseAuth = async () => {
    try {
      await signOutUser();
      setFirebaseUser(null);
      setCurrentUserId('user_1'); // Fallback to demo default
    } catch (err: any) {
      console.error('Error signing out:', err);
    }
  };

  // Manual seed action
  const seedFirestoreData = async () => {
    await seedInitialDataToFirestore();
  };

  // POST ACTIONS
  const createPost = (content: string, privacy: PostPrivacy, image?: string) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      content,
      privacy,
      image,
      createdAt: new Date().toISOString(),
      reactions: {
        like: [],
        love: [],
        haha: [],
        wow: [],
        sad: [],
        angry: [],
      },
      commentsCount: 0,
      sharesCount: 0,
    };
    setPosts((prev) => [newPost, ...prev]);

    // Persist to Firestore
    savePostToFirestore(newPost);
  };

  const editPost = (postId: string, content: string, privacy: PostPrivacy) => {
    let updatedPost: Post | null = null;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          updatedPost = { ...p, content, privacy, updatedAt: new Date().toISOString() };
          return updatedPost;
        }
        return p;
      })
    );

    if (updatedPost) {
      savePostToFirestore(updatedPost);
    }
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setComments((prev) => prev.filter((c) => c.postId !== postId));

    // Delete from Firestore
    deletePostFromFirestore(postId);
  };

  const reactToPost = (postId: string, type: ReactionType) => {
    let updatedPost: Post | null = null;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        const reactions = { ...p.reactions };
        const currentlyHasThisReaction = reactions[type]?.includes(currentUser.id);

        // Remove user from all reaction types on this post
        (Object.keys(reactions) as ReactionType[]).forEach((rType) => {
          reactions[rType] = (reactions[rType] || []).filter((uid) => uid !== currentUser.id);
        });

        // Toggle on if not removing
        if (!currentlyHasThisReaction) {
          reactions[type] = [...(reactions[type] || []), currentUser.id];

          // Create notification for post owner if not self
          if (p.userId !== currentUser.id) {
            const notif: Notification = {
              id: `notif_${Date.now()}`,
              userId: p.userId,
              actorId: currentUser.id,
              type: 'reaction',
              referenceId: p.id,
              isRead: false,
              createdAt: new Date().toISOString(),
              metaText: `reacted to your post.`,
            };
            setNotifications((n) => [notif, ...n]);
            saveNotificationToFirestore(notif);
          }
        }

        updatedPost = { ...p, reactions };
        return updatedPost;
      })
    );

    if (updatedPost) {
      savePostToFirestore(updatedPost);
    }
  };

  const sharePost = (postId: string) => {
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = { ...p, sharesCount: p.sharesCount + 1 };
          savePostToFirestore(updated);
          return updated;
        }
        return p;
      })
    );

    // Create a new shared post in feed
    const sharedPost: Post = {
      id: `post_shared_${Date.now()}`,
      userId: currentUser.id,
      content: `Shared a post from ${getUserById(targetPost.userId)?.firstName}: "${targetPost.content.slice(0, 80)}..."`,
      privacy: 'public',
      image: targetPost.image,
      createdAt: new Date().toISOString(),
      reactions: { like: [], love: [], haha: [], wow: [], sad: [], angry: [] },
      commentsCount: 0,
      sharesCount: 0,
      sharedPostId: targetPost.id,
    };
    setPosts((prev) => [sharedPost, ...prev]);
    savePostToFirestore(sharedPost);

    if (targetPost.userId !== currentUser.id) {
      const notif: Notification = {
        id: `notif_${Date.now()}`,
        userId: targetPost.userId,
        actorId: currentUser.id,
        type: 'share',
        referenceId: targetPost.id,
        isRead: false,
        createdAt: new Date().toISOString(),
        metaText: 'shared your post with their network.',
      };
      setNotifications((n) => [notif, ...n]);
      saveNotificationToFirestore(notif);
    }
  };

  // COMMENT ACTIONS
  const addComment = (postId: string, content: string, parentId?: string | null) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      userId: currentUser.id,
      parentId: parentId || null,
      content,
      createdAt: new Date().toISOString(),
      reactions: {
        like: [],
        love: [],
        haha: [],
        wow: [],
        sad: [],
        angry: [],
      },
    };

    setComments((prev) => [...prev, newComment]);
    saveCommentToFirestore(newComment);

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = { ...p, commentsCount: p.commentsCount + 1 };
          savePostToFirestore(updated);
          return updated;
        }
        return p;
      })
    );

    const post = posts.find((p) => p.id === postId);
    if (post && post.userId !== currentUser.id) {
      const notif: Notification = {
        id: `notif_${Date.now()}`,
        userId: post.userId,
        actorId: currentUser.id,
        type: parentId ? 'reply' : 'comment',
        referenceId: postId,
        isRead: false,
        createdAt: new Date().toISOString(),
        metaText: parentId ? 'replied to a comment on your post.' : 'commented on your post.',
      };
      setNotifications((n) => [notif, ...n]);
      saveNotificationToFirestore(notif);
    }
  };

  const deleteComment = (commentId: string) => {
    const targetComment = comments.find((c) => c.id === commentId);
    if (!targetComment) return;

    setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
    deleteCommentFromFirestore(commentId);

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === targetComment.postId) {
          const updated = { ...p, commentsCount: Math.max(0, p.commentsCount - 1) };
          savePostToFirestore(updated);
          return updated;
        }
        return p;
      })
    );
  };

  const reactToComment = (commentId: string, type: ReactionType) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const reactions = { ...c.reactions };
        const currentlyReacted = reactions[type]?.includes(currentUser.id);

        Object.keys(reactions).forEach((rKey) => {
          reactions[rKey as ReactionType] = (reactions[rKey as ReactionType] || []).filter(
            (id) => id !== currentUser.id
          );
        });

        if (!currentlyReacted) {
          reactions[type] = [...(reactions[type] || []), currentUser.id];
        }

        const updated = { ...c, reactions };
        saveCommentToFirestore(updated);
        return updated;
      })
    );
  };

  // FRIENDSHIP & CONNECTIONS
  const sendFriendRequest = (targetUserId: string) => {
    const existing = friendships.find(
      (f) =>
        (f.senderId === currentUser.id && f.receiverId === targetUserId) ||
        (f.senderId === targetUserId && f.receiverId === currentUser.id)
    );
    if (existing) return;

    const newReq: Friendship = {
      id: `friend_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: targetUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFriendships((prev) => [...prev, newReq]);
    saveFriendshipToFirestore(newReq);

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      userId: targetUserId,
      actorId: currentUser.id,
      type: 'friend_request',
      referenceId: newReq.id,
      isRead: false,
      createdAt: new Date().toISOString(),
      metaText: 'sent you a friend request.',
    };
    setNotifications((n) => [notif, ...n]);
    saveNotificationToFirestore(notif);
  };

  const acceptFriendRequest = (requestId: string) => {
    const req = friendships.find((f) => f.id === requestId);
    if (!req) return;

    const updated: Friendship = { ...req, status: 'accepted', updatedAt: new Date().toISOString() };
    setFriendships((prev) => prev.map((f) => (f.id === requestId ? updated : f)));
    saveFriendshipToFirestore(updated);

    // Increment friend counts
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === req.senderId || u.id === req.receiverId) {
          const userUpdated = { ...u, friendsCount: (u.friendsCount || 0) + 1 };
          syncUserToFirestore(userUpdated);
          return userUpdated;
        }
        return u;
      })
    );

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      userId: req.senderId,
      actorId: currentUser.id,
      type: 'friend_accept',
      referenceId: req.id,
      isRead: false,
      createdAt: new Date().toISOString(),
      metaText: 'accepted your friend request.',
    };
    setNotifications((n) => [notif, ...n]);
    saveNotificationToFirestore(notif);
  };

  const rejectFriendRequest = (requestId: string) => {
    setFriendships((prev) => prev.filter((f) => f.id !== requestId));
    deleteFriendshipFromFirestore(requestId);
  };

  const removeFriend = (targetUserId: string) => {
    const rel = friendships.find(
      (f) =>
        (f.senderId === currentUser.id && f.receiverId === targetUserId) ||
        (f.senderId === targetUserId && f.receiverId === currentUser.id)
    );
    if (rel) {
      deleteFriendshipFromFirestore(rel.id);
    }

    setFriendships((prev) =>
      prev.filter(
        (f) =>
          !(
            (f.senderId === currentUser.id && f.receiverId === targetUserId) ||
            (f.senderId === targetUserId && f.receiverId === currentUser.id)
          )
      )
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id || u.id === targetUserId) {
          const userUpdated = { ...u, friendsCount: Math.max(0, (u.friendsCount || 1) - 1) };
          syncUserToFirestore(userUpdated);
          return userUpdated;
        }
        return u;
      })
    );
  };

  const toggleFollow = (targetUserId: string) => {
    const existing = follows.find(
      (f) => f.followerId === currentUser.id && f.followingId === targetUserId
    );

    if (existing) {
      setFollows((prev) => prev.filter((f) => f.id !== existing.id));
      deleteFollowFromFirestore(existing.id);

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === targetUserId) {
            const userUpdated = { ...u, followersCount: Math.max(0, (u.followersCount || 1) - 1) };
            syncUserToFirestore(userUpdated);
            return userUpdated;
          }
          return u;
        })
      );
    } else {
      const newFollow: Follow = {
        id: `f_${Date.now()}`,
        followerId: currentUser.id,
        followingId: targetUserId,
        createdAt: new Date().toISOString(),
      };
      setFollows((prev) => [...prev, newFollow]);
      saveFollowToFirestore(newFollow);

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === targetUserId) {
            const userUpdated = { ...u, followersCount: (u.followersCount || 0) + 1 };
            syncUserToFirestore(userUpdated);
            return userUpdated;
          }
          return u;
        })
      );
    }
  };

  // MESSAGING
  const sendMessage = (receiverId: string, content: string) => {
    if (!content.trim()) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    saveMessageToFirestore(newMsg);

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      userId: receiverId,
      actorId: currentUser.id,
      type: 'message',
      referenceId: newMsg.id,
      isRead: false,
      createdAt: new Date().toISOString(),
      metaText: `sent you a message: "${content.slice(0, 30)}..."`,
    };
    setNotifications((n) => [notif, ...n]);
    saveNotificationToFirestore(notif);

    // If sending to DND Chatbot or any Bot, trigger intelligent conversational response
    const recipientUser = getUserById(receiverId);
    if (receiverId === 'user_bot_dnd' || recipientUser?.isBot) {
      setBotTypingContactId(receiverId);
      setTimeout(() => {
        const botResponse = generateDndBotResponse(content, currentUser.firstName);
        const botReplyMsg: Message = {
          id: `msg_bot_${Date.now()}`,
          senderId: receiverId,
          receiverId: currentUser.id,
          content: botResponse.content,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botReplyMsg]);
        saveMessageToFirestore(botReplyMsg);
        setBotTypingContactId(null);
      }, 650);
    }
  };

  const simulateQuickReply = (contactId: string) => {
    const contact = getUserById(contactId);
    if (!contact) return;

    if (contactId === 'user_bot_dnd' || contact.isBot) {
      setBotTypingContactId(contactId);
      setTimeout(() => {
        const botResponse = generateDndBotResponse('help', currentUser.firstName);
        const replyMsg: Message = {
          id: `msg_reply_${Date.now()}`,
          senderId: contactId,
          receiverId: currentUser.id,
          content: botResponse.content,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, replyMsg]);
        saveMessageToFirestore(replyMsg);
        setBotTypingContactId(null);
      }, 600);
      return;
    }

    const replies = [
      'Hey! Thanks for messaging, sounds great! 👍',
      'Awesome idea! Let me check the Connecta specs and get back to you shortly.',
      'Totally agree. The responsive mobile layout is working super smoothly.',
      'Just posted a new update on my feed, check it out when you have a moment!',
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
      const replyMsg: Message = {
        id: `msg_reply_${Date.now()}`,
        senderId: contactId,
        receiverId: currentUser.id,
        content: randomReply,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, replyMsg]);
      saveMessageToFirestore(replyMsg);
    }, 800);
  };

  const markConversationAsRead = (contactId: string) => {
    if (!contactId) return;

    // 1. Immediately mark all unread messages received from this contact as read
    setMessages((prev) => {
      const hasUnread = prev.some(
        (m) => m.senderId === contactId && m.receiverId === currentUser.id && !m.isRead
      );
      if (!hasUnread) return prev;

      return prev.map((m) => {
        if (m.senderId === contactId && m.receiverId === currentUser.id && !m.isRead) {
          const updatedMsg = { ...m, isRead: true };
          saveMessageToFirestore(updatedMsg);
          return updatedMsg;
        }
        return m;
      });
    });

    // 2. Mark any related message notifications from this contact as read to prevent duplicate notifications
    setNotifications((prev) => {
      const hasUnread = prev.some(
        (n) => n.userId === currentUser.id && n.actorId === contactId && n.type === 'message' && !n.isRead
      );
      if (!hasUnread) return prev;

      return prev.map((n) => {
        if (n.userId === currentUser.id && n.actorId === contactId && n.type === 'message' && !n.isRead) {
          const updatedNotif = { ...n, isRead: true };
          saveNotificationToFirestore(updatedNotif);
          return updatedNotif;
        }
        return n;
      });
    });
  };

  // NOTIFICATIONS
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, isRead: true };
          saveNotificationToFirestore(updated);
          return updated;
        }
        return n;
      })
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.userId === currentUser.id) {
          const updated = { ...n, isRead: true };
          saveNotificationToFirestore(updated);
          return updated;
        }
        return n;
      })
    );
  };

  // SAVED POSTS
  const toggleSavePost = (postId: string) => {
    setSavedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // REPORTS
  const createReport = (reportedUserId: string, reason: string, postId?: string, commentId?: string) => {
    const newReport: Report = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reportedUserId,
      reason,
      postId,
      commentId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    saveReportToFirestore(newReport);
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const updated = { ...r, status: action };
          saveReportToFirestore(updated);
          return updated;
        }
        return r;
      })
    );
  };

  // USER & ADMIN
  const updateProfile = (userId: string, data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...data, updatedAt: new Date().toISOString() };
          syncUserToFirestore(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const adminToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        const updated = { ...u, status: nextStatus };
        syncUserToFirestore(updated);
        return updated;
      })
    );
  };

  const adminDeletePost = (postId: string) => {
    deletePost(postId);
    // Mark associated reports as resolved
    setReports((prev) =>
      prev.map((r) => {
        if (r.postId === postId) {
          const updated = { ...r, status: 'resolved' };
          saveReportToFirestore(updated);
          return updated;
        }
        return r;
      })
    );
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setPosts(INITIAL_POSTS);
    setComments(INITIAL_COMMENTS);
    setFriendships(INITIAL_FRIENDSHIPS);
    setFollows(INITIAL_FOLLOWS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReports(INITIAL_REPORTS);
    setSavedPostIds(['post_1']);
    setCurrentUserId('user_1');
    localStorage.clear();
  };

  const handleSetActiveChatUserId = (userId: string | null) => {
    setActiveChatUserId(userId);
    if (userId) {
      markConversationAsRead(userId);
    }
  };

  return (
    <SocialContext.Provider
      value={{
        currentUser,
        allUsers: users,
        setCurrentUser,
        activeView,
        setActiveView,
        viewingProfileUserId,
        setViewingProfileUserId,
        activeChatUserId,
        setActiveChatUserId: handleSetActiveChatUserId,
        searchQuery,
        setSearchQuery,
        posts,
        comments,
        friendships,
        follows,
        messages,
        notifications,
        reports,
        savedPostIds,

        firebaseUser,
        isFirebaseSignedIn: !!firebaseUser,
        isFirestoreConnected,
        isAuthLoading,
        authError,
        signInWithGoogleAuth,
        signOutFirebaseAuth,
        seedFirestoreData,

        createPost,
        editPost,
        deletePost,
        reactToPost,
        sharePost,
        addComment,
        deleteComment,
        reactToComment,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        toggleFollow,
        sendMessage,
        simulateQuickReply,
        markConversationAsRead,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toggleSavePost,
        createReport,
        resolveReport,
        updateProfile,
        adminToggleUserStatus,
        adminDeletePost,
        resetAllData,
        getUserById,
        getFriendshipStatus,
        getUnreadNotificationsCount,
        getUnreadMessagesCount,
        getUnreadMessagesCountForContact,
        getPendingFriendRequestsCount,
        botTypingContactId,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
