import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from './PostCard';

export const SavedPostsView: React.FC = () => {
  const { savedPostIds, posts, setActiveView } = useSocial();

  const savedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-[#1877F2]" />
          <span>Saved Posts ({savedPosts.length})</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Articles, updates, and media you have bookmarked for later.
        </p>
      </div>

      <div className="space-y-4">
        {savedPosts.length > 0 ? (
          savedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="bg-white rounded-2xl p-10 border border-gray-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1877F2] mx-auto flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">No saved posts yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Whenever you come across an inspiring post, click the three dots in the top corner and choose &quot;Save Post&quot;.
            </p>
            <button
              onClick={() => setActiveView('feed')}
              className="px-4 py-2 bg-[#1877F2] text-white text-xs font-semibold rounded-xl hover:bg-[#145DBF] transition-colors"
            >
              Explore Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
