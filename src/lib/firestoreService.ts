import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
} from './firebase';
import {
  User,
  Post,
  Comment,
  Friendship,
  Follow,
  Message,
  Notification,
  Report,
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

// Error wrapper helper
const handleFirestoreError = (operation: string, error: any) => {
  // Gracefully log offline / connection transient notifications without throwing unhandled exceptions
  if (error?.code === 'unavailable' || error?.message?.includes('unavailable')) {
    console.warn(`[Firestore - ${operation}]: Operating in offline/cached mode.`);
    return;
  }
  console.warn(`[Firestore - ${operation}]:`, error?.message || error);
};

// 1. Users
export const syncUserToFirestore = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, user, { merge: true });
  } catch (error) {
    handleFirestoreError(`syncUserToFirestore(${user.id})`, error);
  }
};

export const fetchUsersFromFirestore = async (): Promise<User[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (snap.empty) return null;
    return snap.docs.map((d) => d.data() as User);
  } catch (error) {
    handleFirestoreError('fetchUsersFromFirestore', error);
    return null;
  }
};

// 2. Posts
export const savePostToFirestore = async (post: Post): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', post.id);
    await setDoc(postRef, post, { merge: true });
  } catch (error) {
    handleFirestoreError(`savePostToFirestore(${post.id})`, error);
  }
};

export const deletePostFromFirestore = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    handleFirestoreError(`deletePostFromFirestore(${postId})`, error);
  }
};

export const fetchPostsFromFirestore = async (): Promise<Post[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'posts'));
    if (snap.empty) return null;
    return snap.docs.map((d) => d.data() as Post);
  } catch (error) {
    handleFirestoreError('fetchPostsFromFirestore', error);
    return null;
  }
};

// 3. Comments
export const saveCommentToFirestore = async (comment: Comment): Promise<void> => {
  try {
    const commentRef = doc(db, 'comments', comment.id);
    await setDoc(commentRef, comment, { merge: true });
  } catch (error) {
    handleFirestoreError(`saveCommentToFirestore(${comment.id})`, error);
  }
};

export const deleteCommentFromFirestore = async (commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await deleteDoc(commentRef);
  } catch (error) {
    handleFirestoreError(`deleteCommentFromFirestore(${commentId})`, error);
  }
};

export const fetchCommentsFromFirestore = async (): Promise<Comment[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'comments'));
    if (snap.empty) return null;
    return snap.docs.map((d) => d.data() as Comment);
  } catch (error) {
    handleFirestoreError('fetchCommentsFromFirestore', error);
    return null;
  }
};

// 4. Friendships
export const saveFriendshipToFirestore = async (friendship: Friendship): Promise<void> => {
  try {
    const friendshipRef = doc(db, 'friendships', friendship.id);
    await setDoc(friendshipRef, friendship, { merge: true });
  } catch (error) {
    handleFirestoreError(`saveFriendshipToFirestore(${friendship.id})`, error);
  }
};

export const deleteFriendshipFromFirestore = async (friendshipId: string): Promise<void> => {
  try {
    const friendshipRef = doc(db, 'friendships', friendshipId);
    await deleteDoc(friendshipRef);
  } catch (error) {
    handleFirestoreError(`deleteFriendshipFromFirestore(${friendshipId})`, error);
  }
};

export const fetchFriendshipsFromFirestore = async (): Promise<Friendship[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'friendships'));
    if (snap.empty) return null;
    return snap.docs.map((d) => d.data() as Friendship);
  } catch (error) {
    handleFirestoreError('fetchFriendshipsFromFirestore', error);
    return null;
  }
};

// 5. Follows
export const saveFollowToFirestore = async (follow: Follow): Promise<void> => {
  try {
    const followRef = doc(db, 'follows', follow.id);
    await setDoc(followRef, follow, { merge: true });
  } catch (error) {
    handleFirestoreError(`saveFollowToFirestore(${follow.id})`, error);
  }
};

export const deleteFollowFromFirestore = async (followId: string): Promise<void> => {
  try {
    const followRef = doc(db, 'follows', followId);
    await deleteDoc(followRef);
  } catch (error) {
    handleFirestoreError(`deleteFollowFromFirestore(${followId})`, error);
  }
};

export const fetchFollowsFromFirestore = async (): Promise<Follow[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'follows'));
    if (snap.empty) return null;
    return snap.docs.map((d) => d.data() as Follow);
  } catch (error) {
    handleFirestoreError('fetchFollowsFromFirestore', error);
    return null;
  }
};

// 6. Messages
export const saveMessageToFirestore = async (message: Message): Promise<void> => {
  try {
    const msgRef = doc(db, 'messages', message.id);
    await setDoc(msgRef, message, { merge: true });
  } catch (error) {
    handleFirestoreError(`saveMessageToFirestore(${message.id})`, error);
  }
};

export const fetchMessagesFromFirestore = async (): Promise<Message[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'messages'));
    if (snap.empty) return null;
    return snap.docs.map((d) => d.data() as Message);
  } catch (error) {
    handleFirestoreError('fetchMessagesFromFirestore', error);
    return null;
  }
};

// 7. Notifications
export const saveNotificationToFirestore = async (notification: Notification): Promise<void> => {
  try {
    const notifRef = doc(db, 'notifications', notification.id);
    await setDoc(notifRef, notification, { merge: true });
  } catch (error) {
    handleFirestoreError(`saveNotificationToFirestore(${notification.id})`, error);
  }
};

export const fetchNotificationsFromFirestore = async (): Promise<Notification[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'notifications'));
    if (snap.empty) return null;
    return snap.docs.map((d) => d.data() as Notification);
  } catch (error) {
    handleFirestoreError('fetchNotificationsFromFirestore', error);
    return null;
  }
};

// 8. Reports
export const saveReportToFirestore = async (report: Report): Promise<void> => {
  try {
    const repRef = doc(db, 'reports', report.id);
    await setDoc(repRef, report, { merge: true });
  } catch (error) {
    handleFirestoreError(`saveReportToFirestore(${report.id})`, error);
  }
};

export const fetchReportsFromFirestore = async (): Promise<Report[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'reports'));
    if (snap.empty) return null;
    return snap.docs.map((d) => d.data() as Report);
  } catch (error) {
    handleFirestoreError('fetchReportsFromFirestore', error);
    return null;
  }
};

// Seed initial database into Firestore if empty
export const seedInitialDataToFirestore = async (): Promise<boolean> => {
  try {
    const checkSnap = await getDocs(query(collection(db, 'posts'), limit(1)));
    if (!checkSnap.empty) {
      return false; // already seeded
    }

    console.log('Seeding initial social network datasets into Firestore...');

    // Seed Users
    for (const u of INITIAL_USERS) {
      await setDoc(doc(db, 'users', u.id), u);
    }

    // Seed Posts
    for (const p of INITIAL_POSTS) {
      await setDoc(doc(db, 'posts', p.id), p);
    }

    // Seed Comments
    for (const c of INITIAL_COMMENTS) {
      await setDoc(doc(db, 'comments', c.id), c);
    }

    // Seed Friendships
    for (const f of INITIAL_FRIENDSHIPS) {
      await setDoc(doc(db, 'friendships', f.id), f);
    }

    // Seed Follows
    for (const f of INITIAL_FOLLOWS) {
      await setDoc(doc(db, 'follows', f.id), f);
    }

    // Seed Messages
    for (const m of INITIAL_MESSAGES) {
      await setDoc(doc(db, 'messages', m.id), m);
    }

    // Seed Notifications
    for (const n of INITIAL_NOTIFICATIONS) {
      await setDoc(doc(db, 'notifications', n.id), n);
    }

    // Seed Reports
    for (const r of INITIAL_REPORTS) {
      await setDoc(doc(db, 'reports', r.id), r);
    }

    console.log('Firestore seed completed successfully!');
    return true;
  } catch (error) {
    handleFirestoreError('seedInitialDataToFirestore', error);
    return false;
  }
};
