import React from 'react';
import { LogOut, Bell, Search } from 'lucide-react';

export default function Header({ user, onLogout }) {
  // Logic to get exactly First Initial and Last Initial
  const getInitials = (fullName) => {
    if (!fullName) return "??";
    const names = fullName.trim().split(/\s+/);
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    const firstInitial = names[0].charAt(0);
    const lastInitial = names[names.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
  };

  const initials = getInitials(user?.name);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 font-sans">
      {/* Search Section */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || 'Guest User'}</p>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              {user?.role || 'Administrator'}
            </p>
          </div>

          {/* Styled Initials Avatar */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-md border border-white/20">
            <span className="text-white font-bold text-sm tracking-tighter">
              {initials}
            </span>
          </div>

          <button 
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}