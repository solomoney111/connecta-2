import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PostComposer } from './PostComposer';
import { PostCard } from './PostCard';
import { useSocial } from '../context/SocialContext';
import {
  Sparkles,
  Users,
  Compass,
  Bookmark,
  Plus,
  Loader2,
  ChevronDown,
  ArrowUp,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

const INITIAL_PAGE_SIZE = 3;
const PAGE_INCREMENT = 3;

export const FeedView: React.FC = () => {
  const {
    posts,
    currentUser,
    friendships,
    follows,
    savedPostIds,
    allUsers,
    setViewingProfileUserId,
    setActiveView,
  } = useSocial();

  const [feedFilter, setFeedFilter] = useState<'all' | 'friends' | 'following' | 'saved'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState<boolean>(true);

  // Ref for the intersection observer sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Friends IDs
  const friendIds = friendships
    .filter((f) => f.status === 'accepted' && (f.senderId === currentUser.id || f.receiverId === currentUser.id))
    .map((f) => (f.senderId === currentUser.id ? f.receiverId : f.senderId));

  // Following IDs
  const followingIds = follows
    .filter((f) => f.followerId === currentUser.id)
    .map((f) => f.followingId);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (feedFilter === 'friends') {
      return post.userId === currentUser.id || friendIds.includes(post.userId);
    }
    if (feedFilter === 'following') {
      return post.userId === currentUser.id || followingIds.includes(post.userId);
    }
    if (feedFilter === 'saved') {
      return savedPostIds.includes(post.id);
    }
    return true; // 'all'
  });

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [feedFilter]);

  const hasMore = visibleCount < filteredPosts.length;
  const currentVisiblePosts = filteredPosts.slice(0, visibleCount);

  // Load more handler
  const loadMorePosts = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    // Simulate network latency for natural social feed pagination
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_INCREMENT, filteredPosts.length));
      setIsLoadingMore(false);
    }, 600);
  }, [isLoadingMore, hasMore, filteredPosts.length]);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    if (!infiniteScrollEnabled || !hasMore || isLoadingMore) return;

    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: '120px', // trigger slightly before bottom is reached
        threshold: 0.1,
      }
    );

    observer.observe(currentSentinel);

    return () => {
      observer.disconnect();
    };
  }, [infiniteScrollEnabled, hasMore, isLoadingMore, loadMorePosts]);

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stories data
  const stories = [
    {
      id: 's_my',
      isCreate: true,
      user: currentUser,
      image: currentUser.profileImage,
      bgImage: currentUser.coverImage,
    },
    ...allUsers
      .filter((u) => u.id !== currentUser.id)
      .slice(0, 4)
      .map((user) => ({
        id: `s_${user.id}`,
        isCreate: false,
        user,
        image: user.profileImage,
        bgImage: user.coverImage,
      })),
  ];

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* 1. Stories Strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => {
              setViewingProfileUserId(story.user.id);
              setActiveView('profile');
            }}
            className="w-24 sm:w-28 h-36 sm:h-40 rounded-2xl overflow-hidden relative shrink-0 cursor-pointer group shadow-xs hover:shadow-md transition-all border border-gray-200"
          >
            <img
              src={story.bgImage}
              alt="Story"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

            {/* Avatar or Create Plus Icon */}
            {story.isCreate ? (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center w-full px-1 text-center">
                <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center -mt-4 border-2 border-white shadow-sm mb-1">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white truncate w-full">
                  Create Story
                </span>
              </div>
            ) : (
              <>
                <div className="absolute top-2.5 left-2.5">
                  <img
                    src={story.image}
                    alt={story.user.firstName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1877F2]"
                  />
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5">
                  <span className="text-xs font-bold text-white block truncate leading-tight drop-shadow-xs">
                    {story.user.firstName}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 2. Post Composer */}
      <PostComposer />

      {/* 3. Feed Navigation Tabs & Scroll Controls */}
      <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-xs space-y-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFeedFilter('all')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              feedFilter === 'all'
                ? 'bg-blue-50 text-[#1877F2]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#1877F2]" />
            <span>All Feeds</span>
          </button>

          <button
            onClick={() => setFeedFilter('friends')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              feedFilter === 'friends'
                ? 'bg-blue-50 text-[#1877F2]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 text-[#1877F2]" />
            <span>Friends</span>
          </button>

          <button
            onClick={() => setFeedFilter('following')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              feedFilter === 'following'
                ? 'bg-blue-50 text-[#1877F2]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Compass className="w-4 h-4 text-[#1877F2]" />
            <span>Following</span>
          </button>

          <button
            onClick={() => setFeedFilter('saved')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              feedFilter === 'saved'
                ? 'bg-blue-50 text-[#1877F2]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#1877F2]" />
            <span>Saved</span>
          </button>
        </div>

        {/* Feed Status & Infinite Scroll Toggle Sub-bar */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 px-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-gray-900 font-semibold">{Math.min(visibleCount, filteredPosts.length)}</strong> of <strong className="text-gray-900 font-semibold">{filteredPosts.length}</strong> posts
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setInfiniteScrollEnabled((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                infiniteScrollEnabled
                  ? 'bg-blue-50 text-[#1877F2] hover:bg-blue-100'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Toggle between automatic infinite scrolling and manual 'Load More' button"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{infiniteScrollEnabled ? 'Infinite Scroll: Auto' : 'Manual Load More'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Posts Stream */}
      <div className="space-y-4">
        {currentVisiblePosts.length > 0 ? (
          currentVisiblePosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1877F2] mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">No posts found in this feed</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {feedFilter === 'saved'
                ? 'You have not saved any posts yet. Click the three dots on any post to bookmark it!'
                : 'Share an update or connect with more creators to see their stories here.'}
            </p>
          </div>
        )}
      </div>

      {/* 5. Pagination Sentinel, Loader & 'Load More' Controls */}
      {filteredPosts.length > 0 && (
        <div className="pt-2">
          {hasMore ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              {/* Invisible sentinel for IntersectionObserver */}
              <div ref={sentinelRef} className="h-2 w-full pointer-events-none" />

              {isLoadingMore ? (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 shadow-xs rounded-full text-xs font-semibold text-gray-600">
                  <Loader2 className="w-4 h-4 text-[#1877F2] animate-spin" />
                  <span>Loading more posts...</span>
                </div>
              ) : (
                <button
                  onClick={loadMorePosts}
                  className="px-6 py-2.5 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 hover:border-gray-300 shadow-xs rounded-xl text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2 transition-all cursor-pointer group"
                >
                  <span>Load More Posts</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">You're all caught up!</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  You've viewed all {filteredPosts.length} posts in this feed.
                </p>
              </div>
              <div>
                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#1877F2] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to top</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
