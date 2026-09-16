import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Send, Sparkles, CheckCheck, Bot } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const FloatingChatWindow: React.FC = () => {
  const {
    currentUser,
    activeChatUserId,
    setActiveChatUserId,
    getUserById,
    messages,
    sendMessage,
    simulateQuickReply,
    activeView,
    setViewingProfileUserId,
    setActiveView,
    botTypingContactId,
    markConversationAsRead,
    getUnreadMessagesCountForContact,
  } = useSocial();

  const [isMinimized, setIsMinimized] = useState(false);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  // If no chat selected, or currently viewing full messages page, hide floating widget
  if (!activeChatUserId || activeView === 'messages') {
    return null;
  }

  const contact = getUserById(activeChatUserId);
  if (!contact) return null;

  const chatMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === contact.id) ||
      (m.senderId === contact.id && m.receiverId === currentUser.id)
  );

  const unreadCount = getUnreadMessagesCountForContact(contact.id);

  // Immediately clear unread counts for this conversation upon opening or when receiving a message in active open window
  useEffect(() => {
    if (contact?.id && !isMinimized) {
      markConversationAsRead(contact.id);
    }
  }, [contact?.id, isMinimized, chatMessages.length]);

  useEffect(() => {
    if (!isMinimized) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages.length, isMinimized, botTypingContactId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(contact.id, text.trim());
    setText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(contact.id, prompt);
  };

  const isDndBot = contact.isBot || contact.id === 'user_bot_dnd';

  return (
    <div className="fixed bottom-0 right-4 sm:right-6 z-50 w-76 sm:w-84 bg-white rounded-t-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all">
      {/* Top Header */}
      <div className="px-3.5 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between gap-2 select-none">
        <div
          onClick={() => {
            setViewingProfileUserId(contact.id);
            setActiveView('profile');
          }}
          className="flex items-center gap-2 cursor-pointer group min-w-0"
        >
          <div className="relative">
            <img
              src={contact.profileImage}
              alt={contact.firstName}
              className={`w-8 h-8 rounded-full object-cover ${
                isDndBot ? 'ring-1.5 ring-purple-400' : ''
              }`}
            />
            <div
              className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white ${
                isDndBot ? 'bg-purple-500' : 'bg-green-500'
              }`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs text-gray-900 group-hover:text-[#1877F2] truncate block">
                {contact.firstName} {contact.lastName}
              </span>
              {isDndBot && (
                <span className="px-1 py-0.2 text-[8px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 rounded shrink-0 flex items-center gap-0.5">
                  <Bot className="w-2 h-2" /> BOT
                </span>
              )}
            </div>
            <span className="text-[10px] text-green-600 block">
              {isDndBot ? (
                <span className="text-purple-600 font-medium">AI Companion</span>
              ) : (
                'Active now'
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isMinimized && unreadCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#1877F2] text-white text-[10px] font-bold rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
          <button
            onClick={() => simulateQuickReply(contact.id)}
            className="p-1 hover:bg-gray-100 rounded text-[#1877F2]"
            title={isDndBot ? 'Summon DND' : 'Simulate quick reply'}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const next = !isMinimized;
              setIsMinimized(next);
              if (!next) {
                markConversationAsRead(contact.id);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-500"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveChatUserId(null)}
            className="p-1 hover:bg-gray-100 rounded text-gray-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body & Input (when not minimized) */}
      {!isMinimized && (
        <>
          <div className="h-64 overflow-y-auto p-3 bg-[#F5F7FA]/50 space-y-2 text-xs">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-[11px] p-4">
                <p className="font-semibold text-gray-700">
                  {isDndBot ? 'Say hi to DND!' : `Chat with ${contact.firstName}`}
                </p>
                <p className="text-[10px] mt-1 text-gray-400">
                  {isDndBot
                    ? 'Roll dice (/roll d20) or click a prompt below.'
                    : 'Start your conversation on Messenger.'}
                </p>
              </div>
            ) : (
              chatMessages.map((m) => {
                const isMine = m.senderId === currentUser.id;
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-1.5 ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMine && (
                      <img
                        src={contact.profileImage}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover mb-0.5"
                      />
                    )}
                    <div
                      className={`max-w-[82%] px-3 py-1.5 rounded-xl text-xs whitespace-pre-wrap ${
                        isMine
                          ? 'bg-[#1877F2] text-white rounded-br-xs'
                          : isDndBot
                          ? 'bg-white border border-purple-200/80 text-gray-800 rounded-bl-xs shadow-2xs'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs'
                      }`}
                    >
                      <p className="break-words">{m.content}</p>
                    </div>
                  </div>
                );
              })
            )}

            {/* Active Typing Indicator */}
            {botTypingContactId === contact.id && (
              <div className="flex items-end gap-1.5 justify-start">
                <img
                  src={contact.profileImage}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover mb-0.5 ring-1 ring-purple-400"
                />
                <div className="px-2.5 py-1 bg-white border border-purple-200 text-purple-700 rounded-xl rounded-bl-xs shadow-2xs flex items-center gap-1.5 text-[10px]">
                  <span>DND is rolling</span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Quick Prompts for DND */}
          {isDndBot && (
            <div className="px-2 py-1 bg-purple-50 border-t border-purple-100 flex items-center gap-1 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => handleQuickPrompt('/roll 1d20')}
                className="px-2 py-0.5 bg-white text-purple-900 border border-purple-200 hover:bg-purple-100 text-[10px] font-bold rounded-md shrink-0 shadow-2xs"
              >
                🎲 1d20
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('adventure')}
                className="px-2 py-0.5 bg-white text-purple-900 border border-purple-200 hover:bg-purple-100 text-[10px] font-bold rounded-md shrink-0 shadow-2xs"
              >
                ⚔️ Adventure
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('character')}
                className="px-2 py-0.5 bg-white text-purple-900 border border-purple-200 hover:bg-purple-100 text-[10px] font-bold rounded-md shrink-0 shadow-2xs"
              >
                🧙 Character
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('quest')}
                className="px-2 py-0.5 bg-white text-purple-900 border border-purple-200 hover:bg-purple-100 text-[10px] font-bold rounded-md shrink-0 shadow-2xs"
              >
                📜 Quest
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="p-2 bg-white border-t border-gray-100 flex items-center gap-1.5">
            <input
              type="text"
              placeholder={isDndBot ? 'Type /roll d20 or message...' : 'Aa'}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-xs focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-[#1877F2]"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="p-1.5 text-[#1877F2] hover:bg-blue-50 disabled:text-gray-300 rounded-full"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
