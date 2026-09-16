import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Users,
  Lock,
  MoreHorizontal,
  Bookmark,
  Edit2,
  Trash2,
  Flag,
  Share2,
  MessageCircle,
  ThumbsUp,
  CornerDownRight,
  Send,
  X,
  Check,
} from 'lucide-react';
import { Post, ReactionType, Comment } from '../types';
import { useSocial } from '../context/SocialContext';
import { REACTION_CONFIG } from '../data/initialData';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    currentUser,
    getUserById,
    reactToPost,
    sharePost,
    deletePost,
    editPost,
    toggleSavePost,
    savedPostIds,
    createReport,
    comments,
    addComment,
    deleteComment,
    reactToComment,
    setViewingProfileUserId,
    setActiveView,
  } = useSocial();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const author = getUserById(post.userId);
  const isAuthor = currentUser.id === post.userId;
  const isSaved = savedPostIds.includes(post.id);

  // Determine current user's reaction to this post
  const currentUserReactionType = (Object.keys(post.reactions) as ReactionType[]).find(
    (type) => post.reactions[type]?.includes(currentUser.id)
  );

  // Total reaction count
  const totalReactions: number = (Object.values(post.reactions) as (string[] | undefined)[]).reduce(
    (sum: number, userIds) => sum + (userIds?.length || 0),
    0
  );

  // Active distinct reaction types present on this post
  const activeReactionTypes = (Object.keys(post.reactions) as ReactionType[]).filter(
    (type) => (post.reactions[type]?.length || 0) > 0
  );

  // Filter comments for this post
  const postComments = comments.filter((c) => c.postId === post.id);
  const topLevelComments = postComments.filter((c) => !c.parentId);

  const optionsRef = useRef<HTMLDivElement>(null);
  const reactionPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleReactionClick = (type: ReactionType) => {
    reactToPost(post.id, type);
    setShowReactionPicker(false);
  };

  const handleMainReactionButton = () => {
    // If already reacted, clicking toggles it off; otherwise defaults to 'like'
    if (currentUserReactionType) {
      reactToPost(post.id, currentUserReactionType);
    } else {
      reactToPost(post.id, 'like');
    }
  };

  const handleSaveEdit = () => {
    if (editedContent.trim()) {
      editPost(post.id, editedContent.trim(), post.privacy);
      setIsEditing(false);
      showToast('Post updated');
    }
  };

  const handleShare = () => {
    sharePost(post.id);
    showToast('Post shared to your feed!');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
    setShowComments(true);
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    addComment(post.id, replyText.trim(), parentId);
    setReplyText('');
    setReplyingToCommentId(null);
  };

  const handleReportSubmit = () => {
    if (reportReason.trim()) {
      createReport(post.userId, reportReason.trim(), post.id);
      setShowReportModal(false);
      setReportReason('');
      showToast('Report submitted to moderation team.');
    }
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  // Highlight hashtags
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_-]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('#')) {
        return (
          <span key={idx} className="text-[#1877F2] font-medium hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-200 shadow-xs mb-4 overflow-hidden relative">
      {/* Toast alert */}
      {toastMessage && (
        <div className="absolute top-3 right-3 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-30 flex items-center gap-1.5 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header: Author + Timestamp + Options */}
      <div className="p-4 pb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={author?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={author?.firstName}
            onClick={() => {
              if (author) {
                setViewingProfileUserId(author.id);
                setActiveView('profile');
              }
            }}
            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90 ring-1 ring-gray-200"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                onClick={() => {
                  if (author) {
                    setViewingProfileUserId(author.id);
                    setActiveView('profile');
                  }
                }}
                className="font-bold text-sm text-[#1F2937] hover:text-[#1877F2] cursor-pointer truncate"
              >
                {author?.firstName} {author?.lastName}
              </span>
              <span className="text-xs text-gray-500">@{author?.username}</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              {post.privacy === 'public' && <Globe className="w-3 h-3" title="Public" />}
              {post.privacy === 'friends' && <Users className="w-3 h-3" title="Friends only" />}
              {post.privacy === 'only_me' && <Lock className="w-3 h-3" title="Only me" />}
              {post.updatedAt && <span className="italic">(edited)</span>}
            </div>
          </div>
        </div>

        {/* Options dropdown */}
        <div ref={optionsRef} className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-40">
              <button
                onClick={() => {
                  toggleSavePost(post.id);
                  setShowOptions(false);
                  showToast(isSaved ? 'Removed from saved' : 'Saved to collection');
                }}
                className="w-full px-3 py-1.5 text-xs text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-[#1877F2] fill-[#1877F2]' : ''}`} />
                {isSaved ? 'Unsave Post' : 'Save Post'}
              </button>

              {isAuthor && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowOptions(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Post
                  </button>

                  <button
                    onClick={() => {
                      deletePost(post.id);
                      setShowOptions(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Post
                  </button>
                </>
              )}

              {!isAuthor && (
                <button
                  onClick={() => {
                    setShowReportModal(true);
                    setShowOptions(false);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-2 text-sm sm:text-base text-gray-800 leading-relaxed break-words">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              rows={3}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2.5 text-sm border border-[#1877F2] rounded-xl focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 text-xs font-semibold bg-[#1877F2] text-white rounded-lg hover:bg-[#145DBF]"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p>{renderFormattedText(post.content)}</p>
        )}
      </div>

      {/* Post Image (if any) */}
      {post.image && (
        <div
          onClick={() => setShowImageModal(true)}
          className="mt-2 bg-gray-100 cursor-pointer overflow-hidden border-t border-b border-gray-100 max-h-[500px] flex items-center justify-center"
        >
          <img
            src={post.image}
            alt="Post attachment"
            className="w-full max-h-[500px] object-cover hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      )}

      {/* Reaction Summary & Counts row */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          {totalReactions > 0 ? (
            <>
              <div className="flex items-center -space-x-1">
                {activeReactionTypes.slice(0, 3).map((type) => (
                  <span
                    key={type}
                    className="w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center text-xs border border-gray-100"
                  >
                    {REACTION_CONFIG[type].emoji}
                  </span>
                ))}
              </div>
              <span className="font-medium text-gray-700">{totalReactions}</span>
            </>
          ) : (
            <span className="text-gray-400">Be the first to react</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer"
          >
            {postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}
          </button>
          <span>·</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Actions Row: Like, Comment, Share */}
      <div className="px-2 py-1 flex items-center justify-between relative border-b border-gray-100 text-xs sm:text-sm font-semibold text-gray-600">
        {/* Reaction Button with Popover on Hover */}
        <div
          ref={reactionPickerRef}
          onMouseEnter={() => setShowReactionPicker(true)}
          onMouseLeave={() => setShowReactionPicker(false)}
          className="flex-1 relative"
        >
          {/* Floating Emoji Picker */}
          {showReactionPicker && (
            <div className="absolute bottom-full left-2 mb-2 p-1.5 bg-white rounded-full shadow-2xl border border-gray-200 flex items-center gap-1.5 z-40 animate-fade-in">
              {(Object.keys(REACTION_CONFIG) as ReactionType[]).map((type) => {
                const config = REACTION_CONFIG[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleReactionClick(type)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xl hover:scale-125 transition-transform hover:bg-gray-100"
                    title={config.label}
                  >
                    {config.emoji}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={handleMainReactionButton}
            className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-gray-100 ${
              currentUserReactionType
                ? `${REACTION_CONFIG[currentUserReactionType].color} font-bold`
                : 'text-gray-600'
            }`}
          >
            {currentUserReactionType ? (
              <span className="text-base">
                {REACTION_CONFIG[currentUserReactionType].emoji}
              </span>
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            <span>
              {currentUserReactionType
                ? REACTION_CONFIG[currentUserReactionType].label
                : 'Like'}
            </span>
          </button>
        </div>

        {/* Comment Toggle Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-gray-500" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <Share2 className="w-4 h-4 text-gray-500" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="p-4 bg-[#F5F7FA]/60 space-y-3">
          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-start gap-2.5">
            <img
              src={currentUser.profileImage}
              alt={currentUser.firstName}
              className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 pr-10 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#1877F2]"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#1877F2] hover:bg-blue-50 disabled:text-gray-300 rounded-full transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comment Thread List */}
          <div className="space-y-3 pt-1">
            {topLevelComments.length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-2">
                No comments yet. Start the conversation!
              </div>
            ) : (
              topLevelComments.map((comment) => {
                const commentAuthor = getUserById(comment.userId);
                const isCommentAuthor = currentUser.id === comment.userId;
                const replies = postComments.filter((r) => r.parentId === comment.id);

                return (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <img
                        src={commentAuthor?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={commentAuthor?.firstName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                      />

                      <div className="flex-1">
                        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs inline-block max-w-full">
                          <div className="font-bold text-xs text-gray-900 flex items-center justify-between gap-2">
                            <span>
                              {commentAuthor?.firstName} {commentAuthor?.lastName}
                            </span>
                            {isCommentAuthor && (
                              <button
                                onClick={() => deleteComment(comment.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete comment"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">
                            {comment.content}
                          </p>
                        </div>

                        {/* Comment Actions (Like, Reply, Time) */}
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 pl-2">
                          <button
                            onClick={() => reactToComment(comment.id, 'like')}
                            className="font-semibold hover:underline"
                          >
                            Like
                          </button>
                          <button
                            onClick={() => setReplyingToCommentId(comment.id)}
                            className="font-semibold hover:underline"
                          >
                            Reply
                          </button>
                          <span>·</span>
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>

                        {/* Nested Replies List */}
                        {replies.length > 0 && (
                          <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-200">
                            {replies.map((reply) => {
                              const replyAuthor = getUserById(reply.userId);
                              return (
                                <div key={reply.id} className="flex items-start gap-2">
                                  <img
                                    src={replyAuthor?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                    alt={replyAuthor?.firstName}
                                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                                  />
                                  <div className="bg-white p-2.5 rounded-2xl border border-gray-200 text-xs">
                                    <span className="font-bold text-gray-900 block">
                                      {replyAuthor?.firstName} {replyAuthor?.lastName}
                                    </span>
                                    <span className="text-gray-800">{reply.content}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Inline Reply Box */}
                        {replyingToCommentId === comment.id && (
                          <div className="flex items-center gap-2 mt-2 pl-4">
                            <CornerDownRight className="w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder={`Reply to ${commentAuthor?.firstName}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddReply(comment.id);
                                }
                              }}
                              className="flex-1 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs focus:outline-hidden focus:border-[#1877F2]"
                            />
                            <button
                              onClick={() => handleAddReply(comment.id)}
                              className="text-xs font-semibold text-[#1877F2] hover:underline"
                            >
                              Send
                            </button>
                            <button
                              onClick={() => setReplyingToCommentId(null)}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-900">Report Content</span>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-gray-600">
                Help keep Connecta safe and authentic. Please select the reason for reporting:
              </p>

              {['Spam or commercial scam', 'Harassment or hate speech', 'False information or impersonation', 'Inappropriate media', 'Intellectual property violation'].map(
                (r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reportReason === r}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="text-[#1877F2]"
                    />
                    <span>{r}</span>
                  </label>
                )
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportReason}
                className="px-4 py-1.5 text-xs font-semibold bg-[#DC2626] hover:bg-red-700 disabled:opacity-50 text-white rounded-lg"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {showImageModal && post.image && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={post.image}
            alt="Full preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </article>
  );
};
