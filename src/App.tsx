import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { TopCodersSection } from './components/home/TopCodersSection';
import { UpcomingContestBanner } from './components/home/UpcomingContestBanner';
import { CommunityFeatures } from './components/home/CommunityFeatures';
import { HomeResourcesPreview } from './components/home/HomeResourcesPreview';
import { HomeNoticesPreview } from './components/home/HomeNoticesPreview';
import { HomeFinalCta } from './components/home/HomeFinalCta';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { ContestsView } from './components/contests/ContestsView';
import { ContestDetailView } from './components/contests/ContestDetailView';
import { ResourcesView } from './components/resources/ResourcesView';
import { NoticesView } from './components/notices/NoticesView';
import { AboutView } from './components/about/AboutView';
import { StudentProfileView } from './components/profile/StudentProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SignupModal } from './components/auth/SignupModal';
import { LoginModal } from './components/auth/LoginModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { store } from './services/supabaseClient';
import { StudentProfile } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(store.getCurrentUser());

  // Modals
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Subscribe to store changes
  const [, setStoreVersion] = useState(0);
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setStoreVersion((v) => v + 1);
      setCurrentUser(store.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (hash.startsWith('profile/')) {
        const username = hash.replace('profile/', '');
        setCurrentPage('profile');
        setRouteParams({ username });
      } else if (hash.startsWith('contests/')) {
        const id = hash.replace('contests/', '');
        setCurrentPage('contest-detail');
        setRouteParams({ contestId: id });
      } else if (hash.startsWith('notices/')) {
        const id = hash.replace('notices/', '');
        setCurrentPage('notices');
        setRouteParams({ noticeId: id });
      } else {
        setCurrentPage(hash);
        setRouteParams({});
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string, params: Record<string, string> = {}) => {
    setRouteParams(params);
    if (page === 'profile' && params.username) {
      window.location.hash = `profile/${params.username}`;
    } else if (page === 'contest-detail' && params.contestId) {
      window.location.hash = `contests/${params.contestId}`;
    } else if (page === 'notices' && params.noticeId) {
      window.location.hash = `notices/${params.noticeId}`;
    } else {
      window.location.hash = page;
    }
  };

  const handleLogout = () => {
    store.setCurrentUser(null);
    setCurrentUser(null);
  };

  // Retrieved data
  const students = store.getStudents();
  const contests = store.getContests();
  const resources = store.getResources();
  const notices = store.getNotices();
  const stats = store.getStats();

  const nextContest = contests.find((c) => c.status === 'upcoming') || contests[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-900">
      {/* Sticky Minimal Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        currentUser={currentUser}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenSignup={() => setSignupOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* LANDING PAGE */}
        {currentPage === 'home' && (
          <div>
            {/* 1. Hero & Community Stats */}
            <HeroSection
              stats={stats}
              topStudents={students}
              nextContest={nextContest}
              onJoinClick={() => setSignupOpen(true)}
              onLeaderboardClick={() => navigateTo('leaderboard')}
              onViewContest={(id) => navigateTo('contest-detail', { contestId: id })}
              onSelectStudent={(username) => navigateTo('profile', { username })}
            />

            {/* 2. Top Coders Showcase */}
            <TopCodersSection
              students={students}
              onViewLeaderboard={() => navigateTo('leaderboard')}
              onSelectStudent={(username) => navigateTo('profile', { username })}
            />

            {/* 3. Upcoming Contest Spotlight */}
            {nextContest && (
              <UpcomingContestBanner
                contest={nextContest}
                onViewContest={(id) => navigateTo('contest-detail', { contestId: id })}
                onRegisterToggle={(id) => {
                  if (currentUser) {
                    store.toggleContestRegistration(id, currentUser.id);
                  } else {
                    setSignupOpen(true);
                  }
                }}
                isRegistered={
                  currentUser
                    ? nextContest.registeredUserIds.includes(currentUser.id)
                    : false
                }
              />
            )}

            {/* 4. Curated Resources Preview */}
            <HomeResourcesPreview
              resources={resources}
              onViewAll={() => navigateTo('resources')}
            />

            {/* 5. Latest Notices Preview */}
            <HomeNoticesPreview
              notices={notices}
              onViewAll={() => navigateTo('notices')}
              onSelectNotice={(id) => navigateTo('notices', { noticeId: id })}
            />

            {/* 6. Why Join NUBPC Pillars */}
            <CommunityFeatures onNavigate={navigateTo} />

            {/* 7. Final Call to Action */}
            <HomeFinalCta
              onJoinClick={() => setSignupOpen(true)}
              onLeaderboardClick={() => navigateTo('leaderboard')}
            />
          </div>
        )}

        {/* LEADERBOARD PAGE */}
        {currentPage === 'leaderboard' && (
          <LeaderboardView
            students={students}
            currentUserId={currentUser?.id}
            onSelectStudent={(username) => navigateTo('profile', { username })}
            onOpenSignup={() => setSignupOpen(true)}
          />
        )}

        {/* CONTESTS PAGE */}
        {currentPage === 'contests' && (
          <ContestsView
            contests={contests}
            currentUserId={currentUser?.id}
            onSelectContest={(id) => navigateTo('contest-detail', { contestId: id })}
            onToggleRegister={(id) => {
              if (currentUser) {
                store.toggleContestRegistration(id, currentUser.id);
              } else {
                setSignupOpen(true);
              }
            }}
          />
        )}

        {/* CONTEST DETAIL & STANDINGS */}
        {currentPage === 'contest-detail' && (
          <ContestDetailView
            contest={
              store.getContestById(routeParams.contestId) ||
              contests[0]
            }
            currentUserId={currentUser?.id}
            onBack={() => navigateTo('contests')}
            onToggleRegister={(id) => {
              if (currentUser) {
                store.toggleContestRegistration(id, currentUser.id);
              } else {
                setSignupOpen(true);
              }
            }}
            onSelectStudent={(username) => navigateTo('profile', { username })}
          />
        )}

        {/* RESOURCES PAGE */}
        {currentPage === 'resources' && (
          <ResourcesView resources={resources} />
        )}

        {/* NOTICES PAGE */}
        {currentPage === 'notices' && (
          <NoticesView
            notices={notices}
            initialSelectedNoticeId={routeParams.noticeId}
          />
        )}

        {/* ABOUT PAGE */}
        {currentPage === 'about' && (
          <AboutView />
        )}

        {/* STUDENT PROFILE PAGE */}
        {currentPage === 'profile' && (
          <StudentProfileView
            student={
              store.getStudentByUsername(routeParams.username || '') ||
              currentUser ||
              students[0]
            }
            currentUserId={currentUser?.id}
            onBack={() => navigateTo('leaderboard')}
            onSelectContest={(id) => navigateTo('contest-detail', { contestId: id })}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {currentPage === 'admin' && (
          <AdminDashboard
            onNavigateHome={() => navigateTo('home')}
            onSelectStudent={(username) => navigateTo('profile', { username })}
          />
        )}
      </main>

      {/* Global Minimal Footer */}
      <Footer onNavigate={navigateTo} />

      {/* 3-Step Student Signup Modal */}
      <SignupModal
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSuccess={(newStudent) => {
          navigateTo('profile', { username: newStudent.username });
        }}
      />

      {/* Student Login Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={(user) => {
          navigateTo('profile', { username: user.username });
        }}
        onSwitchToSignup={() => setSignupOpen(true)}
        onOpenForgotPassword={() => setForgotPasswordOpen(true)}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onBackToLogin={() => {
          setForgotPasswordOpen(false);
          setLoginOpen(true);
        }}
      />
    </div>
  );
}
