import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Sparkles,
  Check,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  Info,
  Bot,
  Dices,
  Shield,
  Wand2,
  Swords,
  Scroll,
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const MessagesView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    messages,
    sendMessage,
    simulateQuickReply,
    getUserById,
    activeChatUserId,
    setActiveChatUserId,
    setViewingProfileUserId,
    setActiveView,
    activeView,
    botTypingContactId,
    markConversationAsRead,
    getUnreadMessagesCountForContact,
  } = useSocial();

  const [searchFilter, setSearchFilter] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available conversation contacts (all other users, placing bots prominently)
  const contacts = [...allUsers]
    .filter((u) => u.id !== currentUser.id)
    .sort((a, b) => {
      if (a.isBot && !b.isBot) return -1;
      if (!a.isBot && b.isBot) return 1;
      return 0;
    });

  // Selected contact
  const selectedContactId = activeChatUserId || contacts[0]?.id;
  const selectedContact = getUserById(selectedContactId);

  // Messages between currentUser and selectedContact
  const currentConversation = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === selectedContactId) ||
      (m.senderId === selectedContactId && m.receiverId === currentUser.id)
  );

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation.length, selectedContactId, botTypingContactId]);

  // Immediately clear unread counts for specific conversations upon opening or receiving messages in active chat
  useEffect(() => {
    if (selectedContactId && activeView === 'messages') {
      markConversationAsRead(selectedContactId);
    }
  }, [selectedContactId, activeView, currentConversation.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContactId) return;
    sendMessage(selectedContactId, inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!selectedContactId) return;
    sendMessage(selectedContactId, prompt);
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((line, lIdx) => {
          if (!line.trim()) {
            return <div key={lIdx} className="h-1.5" />;
          }
          const segments = line.split(/(\*\*.*?\*\*|`.*?`)/g);
          return (
            <p key={lIdx} className="leading-relaxed">
              {segments.map((seg, sIdx) => {
                if (seg.startsWith('**') && seg.endsWith('**')) {
                  return (
                    <strong key={sIdx} className="font-bold">
                      {seg.slice(2, -2)}
                    </strong>
                  );
                }
                if (seg.startsWith('`') && seg.endsWith('`')) {
                  return (
                    <code
                      key={sIdx}
                      className="px-1.5 py-0.5 bg-black/10 rounded font-mono text-[11px]"
                    >
                      {seg.slice(1, -1)}
                    </code>
                  );
                }
                return seg;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  const isDndBot = selectedContact?.isBot || selectedContact?.id === 'user_bot_dnd';

  const dndQuickPrompts = [
    { label: '🎲 /roll 1d20', prompt: '/roll 1d20' },
    { label: '⚔️ Start Adventure', prompt: 'adventure' },
    { label: '📊 /roll stats', prompt: '/roll stats' },
    { label: '🧙 Create Character', prompt: 'character' },
    { label: '📜 Quest Hook', prompt: 'quest' },
    { label: '🐉 Monster Lore', prompt: 'monster beholder' },
    { label: '🛡️ DND Mode', prompt: 'dnd mode' },
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8.5rem)] min-h-[500px] bg-white rounded-3xl border border-gray-200 shadow-xs flex overflow-hidden">
      {/* 1. Conversations List (Left Pane) */}
      <div className="w-72 sm:w-84 border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <span>Chats</span>
            </h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Messenger..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#1877F2] focus:bg-white"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {contacts
            .filter((c) =>
              `${c.firstName} ${c.lastName} ${c.username}`
                .toLowerCase()
                .includes(searchFilter.toLowerCase())
            )
            .map((contact) => {
              const lastMsg = messages
                .filter(
                  (m) =>
                    (m.senderId === currentUser.id && m.receiverId === contact.id) ||
                    (m.senderId === contact.id && m.receiverId === currentUser.id)
                )
                .slice(-1)[0];

              const isSelected = contact.id === selectedContactId;
              const unreadCount = getUnreadMessagesCountForContact(contact.id);

              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    setActiveChatUserId(contact.id);
                    markConversationAsRead(contact.id);
                  }}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={contact.profileImage}
                      alt={contact.firstName}
                      className={`w-12 h-12 rounded-2xl object-cover ${
                        contact.isBot ? 'ring-2 ring-purple-400' : ''
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                        contact.isBot ? 'bg-purple-500' : 'bg-green-500'
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-sm text-gray-900 truncate">
                          {contact.firstName} {contact.lastName}
                        </span>
                        {contact.isBot && (
                          <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 rounded-md shrink-0 flex items-center gap-0.5">
                            <Bot className="w-2.5 h-2.5" /> BOT
                          </span>
                        )}
                      </div>
                      {lastMsg && (
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {formatTime(lastMsg.createdAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-gray-500 truncate max-w-[170px]">
                        {lastMsg ? (
                          <>
                            {lastMsg.senderId === currentUser.id && 'You: '}
                            {lastMsg.content}
                          </>
                        ) : (
                          'No messages yet'
                        )}
                      </p>
                      {unreadCount > 0 && (
                        <span className="w-4 h-4 bg-[#1877F2] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 2. Active Chat Pane (Right) */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="h-16 px-5 border-b border-gray-200 flex items-center justify-between gap-3 shrink-0">
            <div
              onClick={() => {
                setViewingProfileUserId(selectedContact.id);
                setActiveView('profile');
              }}
              className="flex items-center gap-3 cursor-pointer group min-w-0"
            >
              <div className="relative">
                <img
                  src={selectedContact.profileImage}
                  alt={selectedContact.firstName}
                  className={`w-10 h-10 rounded-2xl object-cover ${
                    selectedContact.isBot ? 'ring-2 ring-purple-400' : ''
                  }`}
                />
                <div
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                    selectedContact.isBot ? 'bg-purple-500' : 'bg-green-500'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-sm text-gray-900 group-hover:text-[#1877F2] truncate">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h2>
                  {selectedContact.isBot && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 rounded-md flex items-center gap-0.5">
                      <Bot className="w-2.5 h-2.5" /> BOT
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium flex items-center gap-1">
                  {selectedContact.isBot ? (
                    <span className="text-purple-600 font-semibold">
                      Online • AI Dungeon Master & Companion
                    </span>
                  ) : (
                    <span className="text-green-600">Active now</span>
                  )}
                </span>
              </div>
            </div>

            {/* Actions & Simulator Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => simulateQuickReply(selectedContact.id)}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1877F2] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                title="Trigger simulated quick response for testing"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedContact.isBot ? 'Summon DND' : 'Simulate Reply'}</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#F5F7FA]/40">
            {currentConversation.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <img
                  src={selectedContact.profileImage}
                  alt={selectedContact.firstName}
                  className={`w-16 h-16 rounded-full object-cover mb-3 ${
                    selectedContact.isBot ? 'ring-2 ring-purple-400' : ''
                  }`}
                />
                <h3 className="font-bold text-gray-800 text-sm">
                  {isDndBot ? 'Say hi to DND!' : `Say hi to ${selectedContact.firstName}!`}
                </h3>
                <p className="text-xs mt-1 max-w-sm">
                  {isDndBot
                    ? 'Roll dice, generate D&D characters, explore dungeon adventures, or manage your Do-Not-Disturb status!'
                    : 'Start a conversation on Connecta Messenger.'}
                </p>
              </div>
            ) : (
              currentConversation.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMine && (
                      <img
                        src={selectedContact.profileImage}
                        alt={selectedContact.firstName}
                        className={`w-7 h-7 rounded-full object-cover mb-1 ${
                          selectedContact.isBot ? 'ring-1 ring-purple-400' : ''
                        }`}
                      />
                    )}

                    <div
                      className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-2xs ${
                        isMine
                          ? 'bg-[#1877F2] text-white rounded-br-xs'
                          : selectedContact.isBot
                          ? 'bg-white text-gray-800 rounded-bl-xs border border-purple-200/80 shadow-xs'
                          : 'bg-white text-gray-800 rounded-bl-xs border border-gray-200'
                      }`}
                    >
                      {renderFormattedContent(msg.content)}
                      <div
                        className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                          isMine ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        <span>{formatTime(msg.createdAt)}</span>
                        {isMine && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Active Typing Indicator */}
            {botTypingContactId === selectedContactId && (
              <div className="flex items-end gap-2 justify-start">
                <img
                  src={selectedContact.profileImage}
                  alt={selectedContact.firstName}
                  className="w-7 h-7 rounded-full object-cover mb-1 ring-1 ring-purple-400"
                />
                <div className="px-4 py-2.5 bg-white text-gray-700 rounded-2xl rounded-bl-xs border border-purple-200 shadow-2xs flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" /> DND is formulating reply
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips (for DND Chatbot) */}
          {isDndBot && (
            <div className="px-4 py-2 bg-purple-50/60 border-t border-purple-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-purple-800 shrink-0 flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3" /> Prompts:
              </span>
              {dndQuickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPrompt(item.prompt)}
                  className="px-2.5 py-1 bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold rounded-full shrink-0 transition-colors shadow-2xs hover:shadow-xs"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 border-t border-gray-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                isDndBot
                  ? 'Ask DND to roll dice, run adventure, or give quest...'
                  : `Message ${selectedContact.firstName}...`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#1877F2] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#1877F2] hover:bg-[#145DBF] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-full transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
          Select a contact to view conversation
        </div>
      )}
    </div>
  );
};
