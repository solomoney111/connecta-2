import { User, Friendship, Follow, Post, Comment, Message, Notification, Report } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    firstName: 'Betty',
    lastName: 'Okosun',
    username: 'betty',
    email: 'bettyokosun7@gmail.com',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1400&auto=format&fit=crop&q=80',
    bio: 'Product strategist & tech enthusiast. Building community-first experiences. Always learning and sharing insights.',
    location: 'London, UK',
    website: 'https://connecta.dev/@betty',
    status: 'active',
    role: 'admin',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
    friendsCount: 342,
    followersCount: 1280,
  },
  {
    id: 'user_2',
    firstName: 'Alex',
    lastName: 'Rivera',
    username: 'alexr',
    email: 'alex.rivera@example.com',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&auto=format&fit=crop&q=80',
    bio: 'Design systems lead & UX researcher. Passionate about typography, clean interfaces, and coffee.',
    location: 'San Francisco, CA',
    website: 'https://riveradesign.io',
    status: 'active',
    role: 'user',
    createdAt: '2024-02-01T10:30:00.000Z',
    updatedAt: '2024-02-01T10:30:00.000Z',
    friendsCount: 420,
    followersCount: 3100,
  },
  {
    id: 'user_3',
    firstName: 'Sarah',
    lastName: 'Chen',
    username: 'sarahc',
    email: 'sarah.chen@example.com',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&auto=format&fit=crop&q=80',
    bio: 'Full-stack engineer & open-source contributor. Currently exploring AI interfaces and scalable distributed systems.',
    location: 'Vancouver, Canada',
    website: 'https://sarahcodes.dev',
    status: 'active',
    role: 'user',
    createdAt: '2024-02-14T14:15:00.000Z',
    updatedAt: '2024-02-14T14:15:00.000Z',
    friendsCount: 512,
    followersCount: 4890,
  },
  {
    id: 'user_4',
    firstName: 'Marcus',
    lastName: 'Vance',
    username: 'marcusv',
    email: 'marcus.vance@example.com',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1400&auto=format&fit=crop&q=80',
    bio: 'Music composer & audio architect. Crafting ambient soundscapes and scoring indie video games. 🎧🎹',
    location: 'Austin, TX',
    website: 'https://marcusvance.audio',
    status: 'active',
    role: 'user',
    createdAt: '2024-03-01T11:00:00.000Z',
    updatedAt: '2024-03-01T11:00:00.000Z',
    friendsCount: 189,
    followersCount: 850,
  },
  {
    id: 'user_5',
    firstName: 'Elena',
    lastName: 'Rostova',
    username: 'elenar',
    email: 'elena.rostova@example.com',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&auto=format&fit=crop&q=80',
    bio: 'Architectural photographer & urban explorer. Finding symmetry and light in Brutalist concrete and glass. 📷',
    location: 'Berlin, Germany',
    website: 'https://elenarostova.photo',
    status: 'active',
    role: 'user',
    createdAt: '2024-03-10T09:40:00.000Z',
    updatedAt: '2024-03-10T09:40:00.000Z',
    friendsCount: 290,
    followersCount: 2200,
  },
  {
    id: 'user_bot_dnd',
    firstName: 'DND',
    lastName: 'Bot',
    username: 'dnd',
    email: 'dnd@connecta.ai',
    profileImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80',
    bio: '🎲 AI Dungeon Master & Smart Assistant. Roll dice (/roll 1d20), run fantasy adventures, generate D&D 5e characters, or check Do-Not-Disturb status!',
    location: 'The Astral Sea 🌌',
    website: 'https://connecta.dev/bots/dnd',
    status: 'active',
    role: 'user',
    isBot: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    friendsCount: 1420,
    followersCount: 9800,
  }
];

export const INITIAL_FRIENDSHIPS: Friendship[] = [
  {
    id: 'friend_1',
    senderId: 'user_1',
    receiverId: 'user_2',
    status: 'accepted',
    createdAt: '2024-02-05T12:00:00.000Z',
    updatedAt: '2024-02-05T12:30:00.000Z',
  },
  {
    id: 'friend_2',
    senderId: 'user_1',
    receiverId: 'user_3',
    status: 'accepted',
    createdAt: '2024-02-15T09:00:00.000Z',
    updatedAt: '2024-02-15T10:00:00.000Z',
  },
  {
    id: 'friend_3',
    senderId: 'user_4',
    receiverId: 'user_1',
    status: 'pending', // Pending request waiting for Betty!
    createdAt: '2026-09-14T18:20:00.000Z',
    updatedAt: '2026-09-14T18:20:00.000Z',
  },
  {
    id: 'friend_4',
    senderId: 'user_5',
    receiverId: 'user_1',
    status: 'pending', // Another pending request for Betty!
    createdAt: '2026-09-15T08:15:00.000Z',
    updatedAt: '2026-09-15T08:15:00.000Z',
  },
  {
    id: 'friend_5',
    senderId: 'user_2',
    receiverId: 'user_3',
    status: 'accepted',
    createdAt: '2024-02-20T16:00:00.000Z',
    updatedAt: '2024-02-20T16:30:00.000Z',
  }
];

export const INITIAL_FOLLOWS: Follow[] = [
  { id: 'f_1', followerId: 'user_1', followingId: 'user_2', createdAt: '2024-02-05T12:00:00Z' },
  { id: 'f_2', followerId: 'user_1', followingId: 'user_3', createdAt: '2024-02-15T09:00:00Z' },
  { id: 'f_3', followerId: 'user_2', followingId: 'user_1', createdAt: '2024-02-05T12:00:00Z' },
  { id: 'f_4', followerId: 'user_3', followingId: 'user_1', createdAt: '2024-02-15T09:00:00Z' },
  { id: 'f_5', followerId: 'user_1', followingId: 'user_5', createdAt: '2024-03-12T10:00:00Z' },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_2',
    content: 'Just wrapped up the initial design specs and component library for Connecta! 🚀 Focus is on lightning-fast interactions, clear typographic hierarchy, and responsive feedback across all screen sizes. What do you all think of the clean blue palette? #webdesign #uiux #socialplatform',
    privacy: 'public',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    createdAt: '2026-09-15T12:30:00.000Z',
    reactions: {
      like: ['user_1', 'user_3'],
      love: ['user_5'],
      haha: [],
      wow: ['user_4'],
      sad: [],
      angry: []
    },
    commentsCount: 3,
    sharesCount: 5,
  },
  {
    id: 'post_2',
    userId: 'user_3',
    content: 'Architecting the backend with PHP 8.2 and MySQL PDO prepared statements! 🛡️ Always ensure parameter binding to prevent SQL injection, and enforce CSRF tokens on every single state-changing POST action. Clean, predictable, and robust. #php #security #mysql #backend',
    privacy: 'public',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    createdAt: '2026-09-15T10:15:00.000Z',
    reactions: {
      like: ['user_1'],
      love: ['user_2'],
      haha: [],
      wow: ['user_1'],
      sad: [],
      angry: []
    },
    commentsCount: 2,
    sharesCount: 3,
  },
  {
    id: 'post_3',
    userId: 'user_1',
    content: 'Excited to welcome everyone to Connecta! A fresh social space built for genuine conversations, creator discovery, and meaningful community groups without intrusive ad clutter. Drop a comment below and let us know what features you are most excited to test out! 🌐✨ #ConnectaLaunch #CommunityFirst',
    privacy: 'public',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
    createdAt: '2026-09-15T08:00:00.000Z',
    reactions: {
      like: ['user_2', 'user_4'],
      love: ['user_3', 'user_5'],
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    commentsCount: 4,
    sharesCount: 12,
  },
  {
    id: 'post_4',
    userId: 'user_5',
    content: 'Morning architectural study in Berlin. The way the light hits modern glass facades against overcast skies creates an almost surreal minimalist geometry. 📸 #architecture #berlin #photography #lightandshadow',
    privacy: 'friends',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    createdAt: '2026-09-14T17:40:00.000Z',
    reactions: {
      like: ['user_2'],
      love: ['user_1', 'user_4'],
      haha: [],
      wow: ['user_3'],
      sad: [],
      angry: []
    },
    commentsCount: 1,
    sharesCount: 2,
  },
  {
    id: 'post_5',
    userId: 'user_4',
    content: 'Exploring database indexing strategies today. Adding compound indexes on (receiver_id, status) reduced our notification and friend-query execution time down to sub-millisecond territory. Never underestimate schema design! 💡⚡ #mysql #database #performancetuning',
    privacy: 'public',
    createdAt: '2026-09-14T14:15:00.000Z',
    reactions: {
      like: ['user_1', 'user_3'],
      love: ['user_2'],
      haha: [],
      wow: ['user_1'],
      sad: [],
      angry: []
    },
    commentsCount: 2,
    sharesCount: 1,
  },
  {
    id: 'post_6',
    userId: 'user_2',
    content: 'Late night prototyping session. The new floating chat heads widget in Connecta allows multi-tasking without breaking feed flow! Super excited about this ergonomic social UX. 💬✨ #designsystem #productdesign #chatux',
    privacy: 'public',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    createdAt: '2026-09-14T11:00:00.000Z',
    reactions: {
      like: ['user_1', 'user_4', 'user_5'],
      love: ['user_3'],
      haha: [],
      wow: ['user_2'],
      sad: [],
      angry: []
    },
    commentsCount: 5,
    sharesCount: 4,
  },
  {
    id: 'post_7',
    userId: 'user_3',
    content: 'Refactoring authentication middleware to support session regeneration upon privilege escalation (e.g. promoting a user to moderator/admin). Always call session_regenerate_id(true) to mitigate session fixation attacks! 🔐 #cybersecurity #php8 #infosec',
    privacy: 'public',
    createdAt: '2026-09-13T19:30:00.000Z',
    reactions: {
      like: ['user_4'],
      love: ['user_1'],
      haha: [],
      wow: ['user_5'],
      sad: [],
      angry: []
    },
    commentsCount: 0,
    sharesCount: 2,
  },
  {
    id: 'post_8',
    userId: 'user_5',
    content: 'Quiet sunset over the Spree canal. Taking a break from screens and soaking in the golden hour reflection. Hope everyone has a peaceful evening! 🌅🍃 #mindfulness #berlin #photography #sunsetvibes',
    privacy: 'public',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80',
    createdAt: '2026-09-13T16:20:00.000Z',
    reactions: {
      like: ['user_1', 'user_2'],
      love: ['user_1', 'user_3', 'user_4'],
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    commentsCount: 3,
    sharesCount: 6,
  },
  {
    id: 'post_9',
    userId: 'user_1',
    content: 'Great community discussions happening across the platform today. Remember: you can easily switch accounts from the top navbar menu to test out live interactions, friend requests, and messaging between profiles! 👥🎉 #ConnectaTips #Community',
    privacy: 'public',
    createdAt: '2026-09-13T10:00:00.000Z',
    reactions: {
      like: ['user_2', 'user_3', 'user_4', 'user_5'],
      love: ['user_2'],
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    commentsCount: 1,
    sharesCount: 3,
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comment_1',
    postId: 'post_1',
    userId: 'user_1',
    content: 'The contrast ratios on the primary blue (#1877F2) and surface whites look super crisp, Alex! Especially loving the reaction preview bar.',
    createdAt: '2026-09-15T12:45:00.000Z',
    reactions: { like: ['user_2'], love: ['user_3'], haha: [], wow: [], sad: [], angry: [] }
  },
  {
    id: 'comment_2',
    postId: 'post_1',
    userId: 'user_2',
    parentId: 'comment_1', // Nested reply!
    content: 'Thanks Betty! We made sure WCAG AA standards were met with 4.5:1 text contrast across all elements.',
    createdAt: '2026-09-15T12:50:00.000Z',
    reactions: { like: ['user_1'], love: [], haha: [], wow: [], sad: [], angry: [] }
  },
  {
    id: 'comment_3',
    postId: 'post_1',
    userId: 'user_3',
    content: 'Can not wait to wire this up with the real-time AJAX feed polling!',
    createdAt: '2026-09-15T13:00:00.000Z',
    reactions: { like: [], love: ['user_2'], haha: [], wow: [], sad: [], angry: [] }
  },
  {
    id: 'comment_4',
    postId: 'post_2',
    userId: 'user_1',
    content: 'Crucial architectural guideline! Using prepared statements for every parameterized query is non-negotiable for enterprise security.',
    createdAt: '2026-09-15T10:30:00.000Z',
    reactions: { like: ['user_3'], love: [], haha: [], wow: [], sad: [], angry: [] }
  },
  {
    id: 'comment_5',
    postId: 'post_2',
    userId: 'user_2',
    content: 'Also indexing the foreign keys (`posts.user_id`, `comments.post_id`) keeps queries snappy even with millions of rows.',
    createdAt: '2026-09-15T11:00:00.000Z',
    reactions: { like: ['user_3'], love: ['user_1'], haha: [], wow: [], sad: [], angry: [] }
  },
  {
    id: 'comment_6',
    postId: 'post_3',
    userId: 'user_2',
    content: 'So excited for this launch! The community is going to love the clean feed without clutter.',
    createdAt: '2026-09-15T08:30:00.000Z',
    reactions: { like: ['user_1'], love: ['user_1'], haha: [], wow: [], sad: [], angry: [] }
  },
  {
    id: 'comment_7',
    postId: 'post_3',
    userId: 'user_5',
    content: 'Already bookmarking fellow photographers and creators. Welcome everyone!',
    createdAt: '2026-09-15T09:05:00.000Z',
    reactions: { like: ['user_1'], love: [], haha: [], wow: [], sad: [], angry: [] }
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    senderId: 'user_2',
    receiverId: 'user_1',
    content: 'Hey Betty! Did you get a chance to check the updated feed layout and reaction animation components?',
    isRead: true,
    createdAt: '2026-09-15T11:15:00.000Z',
  },
  {
    id: 'msg_2',
    senderId: 'user_1',
    receiverId: 'user_2',
    content: 'Hey Alex! Yes, just reviewed them. The floating emoji dock with haptic scales feels so natural and responsive!',
    isRead: true,
    createdAt: '2026-09-15T11:20:00.000Z',
  },
  {
    id: 'msg_3',
    senderId: 'user_2',
    receiverId: 'user_1',
    content: 'Awesome! I am also setting up the 1-on-1 messenger window so it docks at the bottom right like chat heads.',
    isRead: false,
    createdAt: '2026-09-15T14:10:00.000Z',
  },
  {
    id: 'msg_4',
    senderId: 'user_3',
    receiverId: 'user_1',
    content: 'Betty, the MySQL migrations and database seeders for users, posts, reactions, and friendships are ready in connecta.sql!',
    isRead: false,
    createdAt: '2026-09-15T14:45:00.000Z',
  },
  {
    id: 'msg_dnd_welcome',
    senderId: 'user_bot_dnd',
    receiverId: 'user_1',
    content: "Greetings, traveler! 🎲 I'm DND, your interactive Dungeon Master & Messenger companion. Type /roll d20 to roll the dice, ask for a quest, or type 'adventure' to begin an epic campaign!",
    isRead: false,
    createdAt: '2026-09-15T15:00:00.000Z',
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'user_1',
    actorId: 'user_4',
    type: 'friend_request',
    isRead: false,
    createdAt: '2026-09-15T14:20:00.000Z',
    metaText: 'sent you a friend request.',
  },
  {
    id: 'notif_2',
    userId: 'user_1',
    actorId: 'user_2',
    type: 'reaction',
    referenceId: 'post_3',
    isRead: false,
    createdAt: '2026-09-15T13:40:00.000Z',
    metaText: 'reacted with ❤️ Love to your post.',
  },
  {
    id: 'notif_3',
    userId: 'user_1',
    actorId: 'user_3',
    type: 'comment',
    referenceId: 'post_3',
    isRead: true,
    createdAt: '2026-09-15T10:30:00.000Z',
    metaText: 'commented on your post: "Excited to welcome everyone..."',
  },
  {
    id: 'notif_4',
    userId: 'user_1',
    actorId: 'user_5',
    type: 'friend_request',
    isRead: false,
    createdAt: '2026-09-15T08:15:00.000Z',
    metaText: 'sent you a friend request.',
  },
  {
    id: 'notif_5',
    userId: 'user_1',
    actorId: 'user_2',
    type: 'message',
    referenceId: 'user_2',
    isRead: false,
    createdAt: '2026-09-15T14:10:00.000Z',
    metaText: 'sent you a new message in Messenger.',
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep_1',
    reporterId: 'user_3',
    reportedUserId: 'user_4',
    postId: 'post_1',
    reason: 'Commercial spam link in comment section test',
    status: 'pending',
    createdAt: '2026-09-15T12:00:00.000Z',
  }
];

export const REACTION_CONFIG: Record<
  import('../types').ReactionType,
  { label: string; emoji: string; color: string; bg: string }
> = {
  like: { label: 'Like', emoji: '👍', color: 'text-[#1877F2]', bg: 'bg-[#1877F2]/10' },
  love: { label: 'Love', emoji: '❤️', color: 'text-[#F33E5B]', bg: 'bg-[#F33E5B]/10' },
  haha: { label: 'Haha', emoji: '😆', color: 'text-[#F7B125]', bg: 'bg-[#F7B125]/10' },
  wow: { label: 'Wow', emoji: '😮', color: 'text-[#F7B125]', bg: 'bg-[#F7B125]/10' },
  sad: { label: 'Sad', emoji: '😢', color: 'text-[#F7B125]', bg: 'bg-[#F7B125]/10' },
  angry: { label: 'Angry', emoji: '😡', color: 'text-[#E9710F]', bg: 'bg-[#E9710F]/10' },
};
