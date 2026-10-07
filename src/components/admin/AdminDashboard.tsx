import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Trophy,
  BookOpen,
  Bell,
  Sliders,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2,
  Edit2,
  Building2,
  Calendar,
  Lock,
  Unlock,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  Settings as SettingsIcon,
  Search,
  Filter,
  UserCheck,
  UserX,
  Database,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { store, isLiveSupabaseConnected } from '../../services/supabaseClient';
import {
  Contest,
  DepartmentInfo,
  Notice,
  RatingConfig,
  LevelThresholds,
  Resource,
  StudentProfile,
  SyncLog,
} from '../../types';
import { LevelBadge } from '../common/LevelBadge';
import { PlatformBadge } from '../common/PlatformBadge';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onSelectStudent: (username: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateHome,
  onSelectStudent,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'students'
    | 'leaderboard'
    | 'contests'
    | 'resources'
    | 'notices'
    | 'departments'
    | 'rating_settings'
    | 'sync'
    | 'settings'
  >('dashboard');

  // State from store
  const [students, setStudents] = useState<StudentProfile[]>(store.getStudents());
  const [contests, setContests] = useState<Contest[]>(store.getContests());
  const [resources, setResources] = useState<Resource[]>(store.getResources());
  const [notices, setNotices] = useState<Notice[]>(store.getNotices());
  const [departments, setDepartments] = useState<DepartmentInfo[]>(store.getDepartments());
  const [ratingConfig, setRatingConfig] = useState<RatingConfig>(store.getRatingConfig());
  const [levelThresholds, setLevelThresholds] = useState<LevelThresholds>(store.getLevelThresholds());
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(store.getSyncLogs());
  const stats = store.getStats();

  const [notificationMsg, setNotificationMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const showSuccess = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 4000);
  };

  const refreshAll = () => {
    setStudents(store.getStudents());
    setContests(store.getContests());
    setResources(store.getResources());
    setNotices(store.getNotices());
    setDepartments(store.getDepartments());
    setRatingConfig(store.getRatingConfig());
    setLevelThresholds(store.getLevelThresholds());
    setSyncLogs(store.getSyncLogs());
  };

  // 1. STUDENTS MANAGEMENT STATE
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('ALL');
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);

  // 2. RATING CONFIGURATION STATE
  const [cfWeight, setCfWeight] = useState(ratingConfig.codeforcesWeight * 100);
  const [ccWeight, setCcWeight] = useState(ratingConfig.codechefWeight * 100);
  const [acWeight, setAcWeight] = useState(ratingConfig.atcoderWeight * 100);
  const [lcWeight, setLcWeight] = useState(ratingConfig.leetcodeWeight * 100);
  const totalWeight = cfWeight + ccWeight + acWeight + lcWeight;

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    if (Math.round(totalWeight) !== 100) {
      showError(`The sum of weights must equal 100%. Currently: ${Math.round(totalWeight)}%`);
      return;
    }

    const newConfig: RatingConfig = {
      codeforcesWeight: cfWeight / 100,
      codechefWeight: ccWeight / 100,
      atcoderWeight: acWeight / 100,
      leetcodeWeight: lcWeight / 100,
      baselineRating: 1000,
    };

    store.updateRatingConfig(newConfig);
    setRatingConfig(newConfig);
    refreshAll();
    showSuccess('Rating weights saved! All student ratings successfully recalculated.');
  };

  // Level Thresholds
  const [newbieMax, setNewbieMax] = useState(levelThresholds.newbieMax);
  const [pupilMax, setPupilMax] = useState(levelThresholds.pupilMax);
  const [specialistMax, setSpecialistMax] = useState(levelThresholds.specialistMax);
  const [expertMax, setExpertMax] = useState(levelThresholds.expertMax);
  const [masterMax, setMasterMax] = useState(levelThresholds.masterMax);

  const handleSaveLevels = (e: React.FormEvent) => {
    e.preventDefault();
    const newThresholds: LevelThresholds = {
      newbieMax: Number(newbieMax),
      pupilMax: Number(pupilMax),
      specialistMax: Number(specialistMax),
      expertMax: Number(expertMax),
      masterMax: Number(masterMax),
    };
    store.updateLevelThresholds(newThresholds);
    setLevelThresholds(newThresholds);
    refreshAll();
    showSuccess('Level thresholds updated! Student levels refreshed.');
  };

  // 3. CONTEST MANAGEMENT
  const [showAddContest, setShowAddContest] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [contestTitle, setContestTitle] = useState('');
  const [contestDesc, setContestDesc] = useState('');
  const [contestDuration, setContestDuration] = useState(120);
  const [contestPlatform, setContestPlatform] = useState<'NUBPC Arena' | 'VJudge' | 'HackerRank'>('NUBPC Arena');
  const [contestRegLink, setContestRegLink] = useState('');

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contestTitle.trim()) return;

    if (editingContest) {
      store.updateContest(editingContest.id, {
        title: contestTitle,
        description: contestDesc,
        durationMinutes: Number(contestDuration),
        platform: contestPlatform,
        registrationLink: contestRegLink,
      });
      showSuccess(`Contest "${contestTitle}" updated!`);
      setEditingContest(null);
    } else {
      store.addContest({
        title: contestTitle,
        slug: contestTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: contestDesc || 'Official NUBPC contest.',
        rules: 'Standard individual ICPC rules.',
        startTime: new Date(Date.now() + 86400000 * 3).toISOString(),
        durationMinutes: Number(contestDuration),
        status: 'upcoming',
        participantsCount: 0,
        registeredUserIds: [],
        platform: contestPlatform,
        registrationLink: contestRegLink,
        isPublished: true,
        problems: [
          { id: 'np-1', code: 'A', title: 'Problem A', difficulty: 'Easy', points: 100, solvedByCount: 0 },
          { id: 'np-2', code: 'B', title: 'Problem B', difficulty: 'Medium', points: 200, solvedByCount: 0 },
        ],
      });
      showSuccess(`Contest "${contestTitle}" published!`);
    }

    refreshAll();
    setShowAddContest(false);
    setContestTitle('');
    setContestDesc('');
    setContestRegLink('');
  };

  // 4. RESOURCE MANAGEMENT
  const [showAddResource, setShowAddResource] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resCat, setResCat] = useState<Resource['category']>('Algorithms');
  const [resDiff, setResDiff] = useState<Resource['difficulty']>('Intermediate');
  const [resType, setResType] = useState<Resource['type']>('Tutorial');
  const [resLink, setResLink] = useState('');
  const [resAuthor, setResAuthor] = useState('');

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resLink.trim()) return;

    store.addResource({
      title: resTitle,
      description: resDesc,
      category: resCat,
      difficulty: resDiff,
      type: resType,
      link: resLink,
      author: resAuthor || 'NUBPC Curators',
      recommendedBy: 'NUBPC Admin',
      starsCount: 1,
    });

    refreshAll();
    setShowAddResource(false);
    setResTitle('');
    setResDesc('');
    setResLink('');
    setResAuthor('');
    showSuccess('Resource added to library!');
  };

  // 5. NOTICE MANAGEMENT
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Contest' | 'Workshop' | 'Announcement' | 'General' | 'Important'>('Announcement');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePinned, setNoticePinned] = useState(false);

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    store.addNotice({
      title: noticeTitle,
      category: noticeCategory,
      date: new Date().toISOString().split('T')[0],
      shortDescription: noticeDesc,
      content: noticeContent || noticeDesc,
      isPinned: noticePinned,
      isPublished: true,
      author: 'NUBPC Administration',
      tags: ['Official', noticeCategory],
    });

    refreshAll();
    setShowAddNotice(false);
    setNoticeTitle('');
    setNoticeDesc('');
    setNoticeContent('');
    showSuccess('Notice published successfully!');
  };

  // 6. DEPARTMENTS MANAGEMENT
  const [showAddDept, setShowAddDept] = useState(false);
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptCoord, setDeptCoord] = useState('');

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptCode.trim() || !deptName.trim()) return;

    store.addDepartment(deptCode.trim().toUpperCase(), deptName.trim(), deptCoord.trim());
    refreshAll();
    setShowAddDept(false);
    setDeptCode('');
    setDeptName('');
    setDeptCoord('');
    showSuccess(`Department ${deptCode} added.`);
  };

  // 7. PLATFORM SYNCHRONIZATION
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingStudentId, setSyncingStudentId] = useState<string | null>(null);

  const handleTriggerSync = (platform: 'Codeforces' | 'CodeChef' | 'LeetCode' | 'AtCoder' | 'All') => {
    setIsSyncing(true);
    setTimeout(() => {
      store.triggerSync(platform);
      refreshAll();
      setIsSyncing(false);
      showSuccess(`Synchronized ${platform} ratings for all active coders.`);
    }, 1000);
  };

  const handleSyncSingleStudent = async (studentId: string) => {
    setSyncingStudentId(studentId);
    try {
      const log = await store.syncStudent(studentId);
      refreshAll();
      showSuccess(log.message);
    } catch (err: any) {
      showError(`Sync failed: ${err.message}`);
    } finally {
      setSyncingStudentId(null);
    }
  };

  // Destructive Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const openConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.username.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.includes(studentSearch);
    const matchesDept = studentDeptFilter === 'ALL' || s.department === studentDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Toast message */}
      {notificationMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-20 right-6 z-50 bg-rose-900 text-white px-4 py-3 rounded-xl shadow-xl border border-rose-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-300" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            NUBPC Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage students, contests, resources, notices, rating weights, and platform synchronizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriggerSync('All')}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Sync All Profiles</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
          >
            Exit to Platform
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar & Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Clean Sidebar Navigation - 10 Sections */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'contests', label: 'Contests', icon: Calendar },
            { id: 'resources', label: 'Resources', icon: BookOpen },
            { id: 'notices', label: 'Notices', icon: Bell },
            { id: 'departments', label: 'Departments', icon: Building2 },
            { id: 'rating_settings', label: 'Rating Settings', icon: Sliders },
            { id: 'sync', label: 'Synchronization', icon: RefreshCw },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: DASHBOARD (6 Cards) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 6 Required Dashboard Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Total Members
                  </span>
                  <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                    {stats.members}
                  </div>
                  <div className="text-[10px] text-slate-500">Across all university batches</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Verified Coders
                  </span>
                  <div className="text-2xl font-black font-mono text-blue-600 mt-1">
                    {stats.verifiedCoders}
                  </div>
                  <div className="text-[10px] text-slate-500">Connected & verified platforms</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Active Coders
                  </span>
                  <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
                    {stats.activeCoders}
                  </div>
                  <div className="text-[10px] text-slate-500">Participated this month</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Contests
                  </span>
                  <div className="text-2xl font-black font-mono text-purple-600 mt-1">
                    {contests.length}
                  </div>
                  <div className="text-[10px] text-slate-500">Intra & speed sprint arenas</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Resources
                  </span>
                  <div className="text-2xl font-black font-mono text-amber-600 mt-1">
                    {resources.length}
                  </div>
                  <div className="text-[10px] text-slate-500">Curated CP materials</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Notices
                  </span>
                  <div className="text-2xl font-black font-mono text-slate-800 mt-1">
                    {notices.length}
                  </div>
                  <div className="text-[10px] text-slate-500">Published official circulars</div>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Active Platform Weights
                    </h3>
                    <button
                      onClick={() => setActiveTab('rating_settings')}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Configure
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Codeforces ({ratingConfig.codeforcesWeight * 100}%)</span>
                      <span className="font-mono font-bold text-blue-600">35%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: '35%' }} />
                    </div>

                    <div className="flex justify-between pt-1">
                      <span>CodeChef ({ratingConfig.codechefWeight * 100}%)</span>
                      <span className="font-mono font-bold text-amber-600">25%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-600 h-full" style={{ width: '25%' }} />
                    </div>

                    <div className="flex justify-between pt-1">
                      <span>AtCoder ({ratingConfig.atcoderWeight * 100}%)</span>
                      <span className="font-mono font-bold text-slate-800">20%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-700 h-full" style={{ width: '20%' }} />
                    </div>

                    <div className="flex justify-between pt-1">
                      <span>LeetCode ({ratingConfig.leetcodeWeight * 100}%)</span>
                      <span className="font-mono font-bold text-orange-600">20%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-600 h-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Recent Synchronizations
                    </h3>
                    <button
                      onClick={() => setActiveTab('sync')}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {syncLogs.slice(0, 3).map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span className="font-bold text-slate-800">
                            {log.platform} Sync
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {log.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] truncate">{log.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {log.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS MANAGEMENT */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Student Profiles Management ({students.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Search, view, edit profiles, toggle active status, or trigger platform sync.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 w-44"
                    />
                  </div>

                  <select
                    value={studentDeptFilter}
                    onChange={(e) => setStudentDeptFilter(e.target.value)}
                    className="text-xs rounded-xl border border-slate-200 py-1.5 px-2 bg-white text-slate-700"
                  >
                    <option value="ALL">All Depts</option>
                    {departments.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase text-[11px]">
                      <th className="py-2.5 px-3">Student</th>
                      <th className="py-2.5 px-3">Student ID</th>
                      <th className="py-2.5 px-3">Dept & Batch</th>
                      <th className="py-2.5 px-3 text-right">Rating</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={s.avatar}
                              alt={s.fullName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{s.fullName}</div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                @{s.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {s.studentId}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {s.department} • Batch {s.batch}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {s.overallRating}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {s.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Profile */}
                            <button
                              onClick={() => onSelectStudent(s.username)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                              title="View Profile"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Profile */}
                            <button
                              onClick={() => setEditingStudent(s)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                              title="Edit Student"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Sync Student */}
                            <button
                              onClick={() => handleSyncSingleStudent(s.id)}
                              disabled={syncingStudentId === s.id}
                              className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 disabled:opacity-40"
                              title="Sync Student Ratings"
                            >
                              <RefreshCw
                                className={`w-3.5 h-3.5 ${
                                  syncingStudentId === s.id ? 'animate-spin text-blue-600' : ''
                                }`}
                              />
                            </button>

                            {/* Disable / Enable toggle */}
                            <button
                              onClick={() => {
                                store.toggleStudentStatus(s.id);
                                refreshAll();
                                showSuccess(`Account status updated for ${s.fullName}`);
                              }}
                              className={`p-1.5 rounded-lg hover:bg-slate-100 ${
                                s.isActive
                                  ? 'text-slate-400 hover:text-amber-600'
                                  : 'text-emerald-600 hover:text-emerald-700'
                              }`}
                              title={s.isActive ? 'Disable Account' : 'Enable Account'}
                            >
                              {s.isActive ? (
                                <UserX className="w-3.5 h-3.5" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Delete Student */}
                            <button
                              onClick={() => {
                                openConfirm(
                                  'Delete Student Account',
                                  `Are you sure you want to delete ${s.fullName} (@${s.username})? This action cannot be undone.`,
                                  () => {
                                    store.deleteStudent(s.id);
                                    refreshAll();
                                    showSuccess(`Student ${s.fullName} deleted.`);
                                  }
                                );
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LEADERBOARD OVERVIEW */}
          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Leaderboard Standing Recalculation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Global ranking audit and distribution breakdown.
                  </p>
                </div>
                <button
                  onClick={() => {
                    store.recalculateAllRatings();
                    refreshAll();
                    showSuccess('All student ranks and rating changes refreshed.');
                  }}
                  className="px-3.5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer"
                >
                  Recalculate All Standings
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    Rank #1 Coder
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {students[0]?.fullName}
                  </div>
                  <div className="text-xs font-mono text-blue-600">
                    Rating: {students[0]?.overallRating}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    Rank #2 Coder
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {students[1]?.fullName}
                  </div>
                  <div className="text-xs font-mono text-blue-600">
                    Rating: {students[1]?.overallRating}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    Rank #3 Coder
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {students[2]?.fullName}
                  </div>
                  <div className="text-xs font-mono text-blue-600">
                    Rating: {students[2]?.overallRating}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    Median Rating
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                    {Math.round(
                      students.reduce((acc, curr) => acc + curr.overallRating, 0) /
                        (students.length || 1)
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">Across entire roster</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTESTS */}
          {activeTab === 'contests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Contests Management ({contests.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create, edit, publish/unpublish, and delete contests.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingContest(null);
                    setContestTitle('');
                    setContestDesc('');
                    setShowAddContest(!showAddContest);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Contest</span>
                </button>
              </div>

              {/* Form */}
              {showAddContest && (
                <form
                  onSubmit={handleCreateContest}
                  className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4"
                >
                  <h4 className="font-bold text-sm text-slate-900">
                    {editingContest ? 'Edit Contest' : 'New Contest Specifications'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contest Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Weekly Speed Sprint #15"
                        value={contestTitle}
                        onChange={(e) => setContestTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        value={contestDuration}
                        onChange={(e) => setContestDuration(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Platform
                      </label>
                      <select
                        value={contestPlatform}
                        onChange={(e) => setContestPlatform(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="NUBPC Arena">NUBPC Arena</option>
                        <option value="VJudge">VJudge</option>
                        <option value="HackerRank">HackerRank</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        External Registration Link
                      </label>
                      <input
                        type="url"
                        placeholder="Optional contest portal url"
                        value={contestRegLink}
                        onChange={(e) => setContestRegLink(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief rules and focal topics..."
                      value={contestDesc}
                      onChange={(e) => setContestDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddContest(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      {editingContest ? 'Save Changes' : 'Publish Contest'}
                    </button>
                  </div>
                </form>
              )}

              {/* Contests List */}
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {contests.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            c.status === 'upcoming'
                              ? 'bg-blue-50 text-blue-700'
                              : c.status === 'ongoing'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.status}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {c.durationMinutes} min • {c.participantsCount} participants • {c.platform}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingContest(c);
                          setContestTitle(c.title);
                          setContestDesc(c.description);
                          setContestDuration(c.durationMinutes);
                          setContestPlatform(c.platform as any);
                          setContestRegLink(c.registrationLink || '');
                          setShowAddContest(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                        title="Edit Contest"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          openConfirm(
                            'Delete Contest',
                            `Are you sure you want to delete "${c.title}"?`,
                            () => {
                              store.deleteContest(c.id);
                              refreshAll();
                              showSuccess('Contest deleted.');
                            }
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Contest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Resources Library ({resources.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add, edit, or remove algorithmic resources.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddResource(!showAddResource)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Resource</span>
                </button>
              </div>

              {/* Add Resource Form */}
              {showAddResource && (
                <form
                  onSubmit={handleCreateResource}
                  className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4"
                >
                  <h4 className="font-bold text-sm text-slate-900">Add New Resource</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Graph Algorithms Guide"
                        value={resTitle}
                        onChange={(e) => setResTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL Link *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://..."
                        value={resLink}
                        onChange={(e) => setResLink(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={resCat}
                        onChange={(e) => setResCat(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="C/C++">C/C++</option>
                        <option value="Data Structures">Data Structures</option>
                        <option value="Algorithms">Algorithms</option>
                        <option value="Competitive Programming">Competitive Programming</option>
                        <option value="Problem Solving">Problem Solving</option>
                        <option value="Git & GitHub">Git & GitHub</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Interview Preparation">Interview Preparation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Difficulty
                      </label>
                      <select
                        value={resDiff}
                        onChange={(e) => setResDiff(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Type
                      </label>
                      <select
                        value={resType}
                        onChange={(e) => setResType(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="Tutorial">Tutorial</option>
                        <option value="Practice Sheet">Practice Sheet</option>
                        <option value="Video Playlist">Video Playlist</option>
                        <option value="Interactive">Interactive</option>
                        <option value="Book / PDF">Book / PDF</option>
                        <option value="Roadmap">Roadmap</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Why should students read this?"
                      value={resDesc}
                      onChange={(e) => setResDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddResource(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Save Resource
                    </button>
                  </div>
                </form>
              )}

              {/* Resource List */}
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {resources.map((r) => (
                  <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {r.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{r.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{r.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-600 p-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => {
                          openConfirm(
                            'Delete Resource',
                            `Are you sure you want to delete "${r.title}"?`,
                            () => {
                              store.deleteResource(r.id);
                              refreshAll();
                              showSuccess('Resource deleted.');
                            }
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Notices & Circulars ({notices.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage official community circulars and bulletins.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddNotice(!showAddNotice)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Draft Notice</span>
                </button>
              </div>

              {/* Add Notice Form */}
              {showAddNotice && (
                <form
                  onSubmit={handleCreateNotice}
                  className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4"
                >
                  <h4 className="font-bold text-sm text-slate-900">Draft Notice</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Notice heading"
                        value={noticeTitle}
                        onChange={(e) => setNoticeTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={noticeCategory}
                        onChange={(e) => setNoticeCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="Contest">Contest</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Announcement">Announcement</option>
                        <option value="General">General</option>
                        <option value="Important">Important</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Description *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="One line summary"
                      value={noticeDesc}
                      onChange={(e) => setNoticeDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Detailed Content
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Full circular details..."
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pinNotice"
                      checked={noticePinned}
                      onChange={(e) => setNoticePinned(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <label htmlFor="pinNotice" className="text-xs text-slate-700 font-medium">
                      Pin this notice to top
                    </label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddNotice(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Publish Notice
                    </button>
                  </div>
                </form>
              )}

              {/* Notice List */}
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {notices.map((n) => (
                  <div key={n.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {n.category}
                        </span>
                        {n.isPinned && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                            PINNED
                          </span>
                        )}
                        <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.shortDescription}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          openConfirm(
                            'Delete Notice',
                            `Are you sure you want to delete notice "${n.title}"?`,
                            () => {
                              store.deleteNotice(n.id);
                              refreshAll();
                              showSuccess('Notice deleted.');
                            }
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Departments & Batches Management
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure university academic departments and faculty contacts.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDept(!showAddDept)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Department</span>
                </button>
              </div>

              {/* Add Dept Form */}
              {showAddDept && (
                <form
                  onSubmit={handleAddDepartment}
                  className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4"
                >
                  <h4 className="font-bold text-sm text-slate-900">New Department</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ME, CE"
                        value={deptCode}
                        onChange={(e) => setDeptCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Mechanical Engineering"
                        value={deptName}
                        onChange={(e) => setDeptName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Coordinator
                      </label>
                      <input
                        type="text"
                        placeholder="Faculty advisor"
                        value={deptCoord}
                        onChange={(e) => setDeptCoord(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddDept(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Add Department
                    </button>
                  </div>
                </form>
              )}

              {/* Departments Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {departments.map((d) => (
                  <div
                    key={d.code}
                    className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200/60">
                          {d.code}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {d.headOrCoordinator || 'NUB Engineering Faculty'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        openConfirm(
                          'Delete Department',
                          `Are you sure you want to remove department ${d.code}?`,
                          () => {
                            store.deleteDepartment(d.code);
                            refreshAll();
                            showSuccess(`Department ${d.code} removed.`);
                          }
                        );
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: RATING SETTINGS */}
          {activeTab === 'rating_settings' && (
            <div className="space-y-6">
              {/* Platform Weights Slider Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Platform Weight Distribution
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust normalization weights. Must sum to 100%. Changing weights recalculates all student ratings.
                  </p>
                </div>

                <form onSubmit={handleSaveWeights} className="space-y-5">
                  <div className="space-y-4">
                    {/* CF */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800">Codeforces Weight</span>
                        <span className="font-mono text-blue-600">{cfWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="70"
                        step="5"
                        value={cfWeight}
                        onChange={(e) => setCfWeight(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    {/* CC */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800">CodeChef Weight</span>
                        <span className="font-mono text-amber-600">{ccWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="5"
                        value={ccWeight}
                        onChange={(e) => setCcWeight(Number(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>

                    {/* LC */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800">LeetCode Weight</span>
                        <span className="font-mono text-orange-600">{lcWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={lcWeight}
                        onChange={(e) => setLcWeight(Number(e.target.value))}
                        className="w-full accent-orange-600 cursor-pointer"
                      />
                    </div>

                    {/* AC */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800">AtCoder Weight</span>
                        <span className="font-mono text-slate-800">{acWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={acWeight}
                        onChange={(e) => setAcWeight(Number(e.target.value))}
                        className="w-full accent-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="text-xs">
                      <span className="text-slate-500">Total Sum: </span>
                      <span
                        className={`font-mono font-bold ${
                          totalWeight === 100 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {totalWeight}%
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={totalWeight !== 100}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Recalculate Leaderboard</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* NUBPC Level Thresholds */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    NUBPC Rank Tier Thresholds
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set rating upper bounds for Newbie, Pupil, Specialist, Expert, and Master.
                  </p>
                </div>

                <form onSubmit={handleSaveLevels} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Newbie Max
                      </label>
                      <input
                        type="number"
                        value={newbieMax}
                        onChange={(e) => setNewbieMax(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Pupil Max
                      </label>
                      <input
                        type="number"
                        value={pupilMax}
                        onChange={(e) => setPupilMax(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Specialist Max
                      </label>
                      <input
                        type="number"
                        value={specialistMax}
                        onChange={(e) => setSpecialistMax(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Expert Max
                      </label>
                      <input
                        type="number"
                        value={expertMax}
                        onChange={(e) => setExpertMax(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Master Max
                      </label>
                      <input
                        type="number"
                        value={masterMax}
                        onChange={(e) => setMasterMax(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <span className="text-[11px] text-slate-400">
                        {masterMax + 1}+ is <strong className="text-rose-600">Grandmaster</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Thresholds</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 9: SYNCHRONIZATION */}
          {activeTab === 'sync' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Platform Synchronization Controls
                </h3>
                <p className="text-xs text-slate-500">
                  Execute backend-safe synchronization jobs and audit rating changes.
                </p>
              </div>

              {/* Sync Trigger Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleTriggerSync('Codeforces')}
                  disabled={isSyncing}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 text-left hover:bg-blue-50/50 transition-all cursor-pointer"
                >
                  <span className="text-xs font-bold text-blue-700 block">
                    Sync Codeforces
                  </span>
                  <span className="text-[10px] text-slate-500">Fetch CF API deltas</span>
                </button>

                <button
                  onClick={() => handleTriggerSync('CodeChef')}
                  disabled={isSyncing}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 text-left hover:bg-amber-50/50 transition-all cursor-pointer"
                >
                  <span className="text-xs font-bold text-amber-800 block">
                    Sync CodeChef
                  </span>
                  <span className="text-[10px] text-slate-500">Star ratings & handles</span>
                </button>

                <button
                  onClick={() => handleTriggerSync('LeetCode')}
                  disabled={isSyncing}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-orange-400 text-left hover:bg-orange-50/50 transition-all cursor-pointer"
                >
                  <span className="text-xs font-bold text-orange-700 block">
                    Sync LeetCode
                  </span>
                  <span className="text-[10px] text-slate-500">Contest rating updates</span>
                </button>

                <button
                  onClick={() => handleTriggerSync('AtCoder')}
                  disabled={isSyncing}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 text-left hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-800 block">
                    Sync AtCoder
                  </span>
                  <span className="text-[10px] text-slate-500">Kyu / Dan rankings</span>
                </button>
              </div>

              {/* Logs */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Audit Sync Logs ({syncLogs.length})
                </h4>

                <div className="space-y-2">
                  {syncLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{log.platform}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            by {log.triggeredBy}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{log.message}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {log.timestamp}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          ✓ {log.recordsUpdated} updated
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Platform Settings</h3>
                <p className="text-xs text-slate-500">
                  Backend configuration, Supabase RLS security, and environment integrity.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Supabase Status */}
                <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 block">
                      Supabase Cloud Database & Auth
                    </span>
                    <p className="text-slate-500 text-[11px]">
                      {isLiveSupabaseConnected
                        ? 'Connected to live Supabase project instance.'
                        : 'Using reactive local persistence fallback store (VITE_SUPABASE_URL not configured).'}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full font-mono font-bold text-[10px] ${
                      isLiveSupabaseConnected
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isLiveSupabaseConnected ? 'Live Mode' : 'Local Fallback'}
                  </span>
                </div>

                {/* Security and RLS Notice */}
                <div className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
                  <span className="font-bold text-slate-800 block">
                    Security & Row Level Security (RLS) Status
                  </span>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    All 14 database tables in <code className="font-mono bg-white px-1 py-0.5 rounded border">supabase/schema.sql</code> are protected with Row Level Security. Public users have read access to published contests, notices, resources, and public leaderboard ratings. Only administrators with validated credentials can alter ratings or publish content.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{confirmDialog.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
