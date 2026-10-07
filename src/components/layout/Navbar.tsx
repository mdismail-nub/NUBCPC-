import React, { useState } from 'react';
import {
  Code2,
  Trophy,
  BookOpen,
  Bell,
  Info,
  Calendar,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { LevelBadge } from '../common/LevelBadge';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  currentUser: StudentProfile | null;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onOpenLogin,
  onOpenSignup,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Code2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'contests', label: 'Contests', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNav = (id: string, params?: Record<string, string>) => {
    onNavigate(id, params);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <span className="font-mono tracking-tighter">&lt;/&gt;</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  NUBPC
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 tracking-tight hidden sm:block">
                Northern University Bangladesh Programming Community
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Admin Access Toggle */}
            <button
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                currentPage === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Admin</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-blue-600 font-bold leading-tight">
                      {currentUser.overallRating}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        @{currentUser.username} • {currentUser.department}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <LevelBadge level={currentUser.level} size="sm" />
                        <span className="text-xs font-mono font-bold text-slate-700">
                          #{currentUser.rank}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNav('profile', { username: currentUser.username })}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => handleNav('leaderboard')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Trophy className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Standings</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={onOpenSignup}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join Community</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNav('admin')}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Dashboard</span>
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleNav('profile', { username: currentUser.username })}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span>{currentUser.fullName}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs text-rose-600 font-semibold px-2 py-1 hover:bg-rose-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="py-2 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSignup();
                  }}
                  className="py-2 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Join Community
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
