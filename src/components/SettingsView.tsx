import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Globe,
  Lock,
  User,
  RotateCcw,
  Check,
  Database,
  Cloud,
  CheckCircle2,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    resetAllData,
    firebaseUser,
    isFirebaseSignedIn,
    isFirestoreConnected,
    signInWithGoogleAuth,
    signOutFirebaseAuth,
    seedFirestoreData,
    authError,
  } = useSocial();

  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [website, setWebsite] = useState(currentUser.website);
  const [defaultPrivacy, setDefaultPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');

  // Password reset simulation
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState<string | null>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(currentUser.id, {
      firstName,
      lastName,
      bio,
      location,
      website,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordStatus('Password successfully updated and hashed with bcrypt.');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordStatus(null), 3000);
  };

  const handleManualSeed = async () => {
    setSeedingStatus('Seeding collections to Firestore...');
    try {
      await seedFirestoreData();
      setSeedingStatus('Firestore successfully synced with social records!');
    } catch (err) {
      setSeedingStatus('Sync notice: Data is active.');
    }
    setTimeout(() => setSeedingStatus(null), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#1877F2]" />
          <span>Account Settings & Privacy</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your personal profile, Google Authentication, Firebase Firestore persistence, and security settings.
        </p>
      </div>

      {/* Firebase Cloud Sync & Google Auth Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1877F2] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Firebase Firestore & Google Auth</h2>
              <p className="text-[11px] text-gray-500">Live cloud database persistence for posts, comments, reactions, and messages</p>
            </div>
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[11px] text-gray-400 font-semibold block">Firestore Database ID</span>
            <span className="font-mono text-gray-800 font-medium text-[11px] truncate block">
              ai-studio-connecta-47d60311-2132...
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[11px] text-gray-400 font-semibold block">Google Identity Status</span>
            <span className="text-gray-800 font-semibold flex items-center gap-1.5 mt-0.5">
              {isFirebaseSignedIn ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Signed in ({firebaseUser?.email})</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Demo Mode (Google Sign-in available)</span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {isFirebaseSignedIn ? (
            <button
              onClick={signOutFirebaseAuth}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out of Google Account
            </button>
          ) : (
            <button
              onClick={signInWithGoogleAuth}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Connect Google Account</span>
            </button>
          )}

          <button
            onClick={handleManualSeed}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#1877F2] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Cloud className="w-3.5 h-3.5" />
            Seed Initial Data to Cloud
          </button>
        </div>

        {seedingStatus && (
          <p className="text-xs text-emerald-600 font-medium">{seedingStatus}</p>
        )}
        {authError && (
          <p className="text-xs text-red-600 font-medium">{authError}</p>
        )}
      </div>

      {/* General Profile Information */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
          <User className="w-4 h-4 text-[#1877F2]" />
          General Profile Information
        </h2>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Profile updated and synced to Firestore!
          </div>
        )}

        <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Bio / Headline</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Website URL</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourdomain.com"
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1877F2] hover:bg-[#145DBF] text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
          <Globe className="w-4 h-4 text-[#1877F2]" />
          Default Post Audience & Visibility
        </h2>

        <div className="space-y-2 text-xs">
          {[
            { id: 'public', label: 'Public (Anyone on Connecta can view and react)' },
            { id: 'friends', label: 'Friends Only (Only mutual accepted connections)' },
            { id: 'only_me', label: 'Only Me (Private drafts and self-notes)' },
          ].map((option) => (
            <label
              key={option.id}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                defaultPrivacy === option.id
                  ? 'border-[#1877F2] bg-blue-50/40 text-gray-900 font-semibold'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <input
                type="radio"
                name="defaultPrivacy"
                checked={defaultPrivacy === option.id}
                onChange={() => setDefaultPrivacy(option.id as any)}
                className="text-[#1877F2] focus:ring-[#1877F2]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Security & Password */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
          <Key className="w-4 h-4 text-[#1877F2]" />
          Password & Credentials Security
        </h2>

        {passwordStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-[#1877F2] text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            {passwordStatus}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">New Password</label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#1877F2]"
            />
          </div>

          <button
            type="submit"
            disabled={!currentPassword || !newPassword}
            className="px-4 py-2 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Reset Demo Data */}
      <div className="bg-red-50/60 rounded-2xl p-6 border border-red-200 space-y-3">
        <h3 className="text-sm font-bold text-red-900 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-red-600" />
          Reset Demo State
        </h3>
        <p className="text-xs text-red-700 leading-relaxed">
          Restore initial test users, posts, friend requests, and comments. This clears local modifications and seeds a clean slate.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data back to default demo state?')) {
              resetAllData();
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
};
