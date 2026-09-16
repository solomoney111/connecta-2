import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  MessageSquare,
  Flag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Eye,
  Search,
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    posts,
    comments,
    reports,
    resolveReport,
    toggleUserBan,
    deletePost,
    getUserById,
    setViewingProfileUserId,
    setActiveView,
  } = useSocial();

  const [tab, setTab] = useState<'overview' | 'users' | 'reports' | 'posts'>('overview');
  const [userSearch, setUserSearch] = useState('');

  // Metrics
  const totalUsers = allUsers.length;
  const totalPosts = posts.length;
  const totalComments = comments.length;
  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Connecta Administration & Moderation Console</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-white">{currentUser.firstName} {currentUser.lastName}</strong> (Role: {currentUser.role})
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              tab === 'overview' ? 'bg-[#1877F2] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab('users')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              tab === 'users' ? 'bg-[#1877F2] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Users ({totalUsers})
          </button>
          <button
            onClick={() => setTab('reports')}
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              tab === 'reports' ? 'bg-[#1877F2] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Reports</span>
            {pendingReports.length > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {pendingReports.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('posts')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              tab === 'posts' ? 'bg-[#1877F2] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Posts ({totalPosts})
          </button>
        </div>
      </div>

      {/* Tab: Overview */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1877F2] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-gray-900 block">{totalUsers}</span>
              <span className="text-xs text-gray-500 font-medium">Registered Accounts</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-gray-900 block">{totalPosts}</span>
              <span className="text-xs text-gray-500 font-medium">Published Posts</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-gray-900 block">{totalComments}</span>
              <span className="text-xs text-gray-500 font-medium">Total Comments</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <Flag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-gray-900 block">{pendingReports.length}</span>
              <span className="text-xs text-gray-500 font-medium">Pending Moderation Reports</span>
            </div>
          </div>

          {/* Quick Reports Queue */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Urgent Moderation Queue</span>
              </h2>
              <button
                onClick={() => setTab('reports')}
                className="text-xs text-[#1877F2] font-semibold hover:underline"
              >
                View all reports
              </button>
            </div>

            {pendingReports.length > 0 ? (
              <div className="space-y-3">
                {pendingReports.map((r) => {
                  const reporter = getUserById(r.reporterId);
                  const targetUser = getUserById(r.reportedUserId);
                  return (
                    <div
                      key={r.id}
                      className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <span className="font-bold text-gray-900">
                          {reporter?.firstName} reported {targetUser?.firstName}:
                        </span>
                        <p className="text-gray-700 mt-0.5">&quot;{r.reason}&quot;</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => resolveReport(r.id, 'dismissed')}
                          className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg font-semibold text-gray-700"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => resolveReport(r.id, 'resolved')}
                          className="px-3 py-1 bg-[#1877F2] hover:bg-[#145DBF] text-white rounded-lg font-semibold"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-green-700 bg-green-50 rounded-xl">
                ✨ Clean slate! No open moderation flags in the queue.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Users Management */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user accounts..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#1877F2]"
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Showing {allUsers.length} accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allUsers
                  .filter((u) =>
                    `${u.firstName} ${u.lastName} ${u.username} ${u.email}`
                      .toLowerCase()
                      .includes(userSearch.toLowerCase())
                  )
                  .map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={user.profileImage}
                          alt={user.firstName}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-gray-400 text-[11px]">@{user.username}</span>
                        </div>
                      </td>
                      <td className="p-3.5">{user.email}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold capitalize text-[10px] ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold capitalize text-[10px] ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setViewingProfileUserId(user.id);
                            setActiveView('profile');
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                        >
                          Profile
                        </button>
                        {user.id !== currentUser.id && (
                          <button
                            onClick={() => toggleUserBan(user.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              user.status === 'banned'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            {user.status === 'banned' ? 'Unban' : 'Ban User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Reports */}
      {tab === 'reports' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden space-y-4 p-6">
          <h2 className="font-bold text-gray-900 text-base">Submitted Reports ({reports.length})</h2>

          <div className="space-y-3">
            {reports.map((report) => {
              const reporter = getUserById(report.reporterId);
              const reported = getUserById(report.reportedUserId);
              return (
                <div
                  key={report.id}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {reporter?.firstName} {reporter?.lastName}
                      </span>
                      <span className="text-gray-400">reported</span>
                      <span className="font-bold text-red-600">
                        {reported?.firstName} {reported?.lastName}
                      </span>
                    </div>
                    <p className="text-gray-700 bg-white p-2 rounded-lg border border-gray-200">
                      Reason: <em>{report.reason}</em>
                    </p>
                    <span className="text-[11px] text-gray-400 capitalize">
                      Status: {report.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => resolveReport(report.id, 'dismissed')}
                      className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl font-semibold text-gray-700"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => resolveReport(report.id, 'resolved')}
                      className="px-3 py-1.5 bg-[#1877F2] hover:bg-[#145DBF] text-white rounded-xl font-semibold"
                    >
                      Mark Actioned
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Posts */}
      {tab === 'posts' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-base">
            Platform Posts Moderation ({posts.length})
          </h2>

          <div className="space-y-3">
            {posts.map((post) => {
              const author = getUserById(post.userId);
              return (
                <div
                  key={post.id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start justify-between gap-4 text-xs"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-gray-900">
                        {author?.firstName} {author?.lastName}
                      </strong>
                      <span className="text-gray-400">@{author?.username}</span>
                      <span className="text-gray-400">· {post.privacy}</span>
                    </div>
                    <p className="text-gray-800 line-clamp-2">{post.content}</p>
                    {post.image && (
                      <span className="text-[11px] text-[#1877F2] font-semibold">
                        [Has attached image]
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete this post from the platform?')) {
                        deletePost(post.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
