import React, { useState, useRef } from 'react';
import {
  Image,
  Globe,
  Users,
  Lock,
  Smile,
  X,
  Send,
  Sparkles,
  Link,
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { PostPrivacy } from '../types';

export const PostComposer: React.FC = () => {
  const { currentUser, createPost } = useSocial();
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<PostPrivacy>('public');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    { label: 'Work & Code', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Design Space', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Community', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80' },
  ];

  const feelings = ['✨ feeling excited', '🚀 shipping', '☕ drinking coffee', '🎧 listening to music', '💡 feeling inspired'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl) return;

    let finalContent = content.trim();
    if (feeling) {
      finalContent = `${finalContent} — ${feeling}`;
    }

    createPost(finalContent, privacy, imageUrl || undefined);
    setContent('');
    setImageUrl('');
    setFeeling(null);
    setShowImageInput(false);
    setIsExpanded(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (typeof loadEvt.target?.result === 'string') {
          setImageUrl(loadEvt.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs mb-4">
      {/* Top row: Avatar + input placeholder trigger */}
      <div className="flex items-start gap-3">
        <img
          src={currentUser.profileImage}
          alt={currentUser.firstName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1877F2]/30"
        />

        <div className="flex-1">
          <textarea
            id="post-composer-input"
            rows={isExpanded ? 3 : 2}
            placeholder={`What's on your mind, ${currentUser.firstName}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="w-full text-sm sm:text-base text-gray-800 placeholder:text-gray-400 bg-transparent resize-none focus:outline-hidden"
          />

          {/* Feeling Pill */}
          {feeling && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium rounded-full mb-2">
              <span>{feeling}</span>
              <button
                onClick={() => setFeeling(null)}
                className="hover:text-amber-950 p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Attached Image Preview */}
          {imageUrl && (
            <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 max-h-72">
              <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Image URL Input Drawer */}
          {showImageInput && !imageUrl && (
            <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL (or upload below)..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#1877F2]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 rounded-lg shrink-0"
                >
                  Browse File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Sample Photo Presets for quick testing */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                <span className="text-[11px] text-gray-400 font-medium shrink-0">Sample presets:</span>
                {sampleImages.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setImageUrl(s.url)}
                    className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-[#1877F2] border border-gray-200 text-[11px] text-gray-600 rounded-md shrink-0 transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 my-2.5" />

      {/* Bottom controls: Media upload, Feelings, Privacy selector, and Post button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Photo/Media upload toggle */}
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              showImageInput || imageUrl
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Image className="w-4 h-4 text-green-600" />
            <span className="hidden sm:inline">Photo / Media</span>
          </button>

          {/* Feeling / Activity selector */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Smile className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Feeling</span>
            </button>
            <div className="absolute left-0 bottom-full mb-1 hidden group-hover:flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 w-44 z-30">
              {feelings.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFeeling(f)}
                  className="px-3 py-1.5 text-xs text-left text-gray-700 hover:bg-gray-50"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors bg-gray-50 border border-gray-200"
            >
              {privacy === 'public' && <Globe className="w-3.5 h-3.5 text-gray-500" />}
              {privacy === 'friends' && <Users className="w-3.5 h-3.5 text-gray-500" />}
              {privacy === 'only_me' && <Lock className="w-3.5 h-3.5 text-gray-500" />}
              <span className="capitalize">{privacy.replace('_', ' ')}</span>
            </button>
            <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-36 z-30">
              <button
                type="button"
                onClick={() => setPrivacy('public')}
                className="w-full px-3 py-1.5 text-xs text-left text-gray-700 hover:bg-blue-50 flex items-center gap-2"
              >
                <Globe className="w-3.5 h-3.5" /> Public
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('friends')}
                className="w-full px-3 py-1.5 text-xs text-left text-gray-700 hover:bg-blue-50 flex items-center gap-2"
              >
                <Users className="w-3.5 h-3.5" /> Friends
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('only_me')}
                className="w-full px-3 py-1.5 text-xs text-left text-gray-700 hover:bg-blue-50 flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" /> Only Me
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="post-composer-submit-btn"
          onClick={handleSubmit}
          disabled={!content.trim() && !imageUrl}
          className="px-4 py-1.5 bg-[#1877F2] hover:bg-[#145DBF] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Publish</span>
        </button>
      </div>
    </div>
  );
};
