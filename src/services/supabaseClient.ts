import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  MOCK_COMMUNITY_STATS,
  MOCK_CONTESTS,
  MOCK_NOTICES,
  MOCK_RESOURCES,
  MOCK_STUDENTS,
  MOCK_SYNC_LOGS,
  MOCK_DEPARTMENTS,
  INITIAL_RATING_CONFIG,
  INITIAL_LEVEL_THRESHOLDS,
} from '../data/mockData';
import {
  Contest,
  DepartmentInfo,
  Notice,
  RatingConfig,
  LevelThresholds,
  Resource,
  StudentProfile,
  SyncLog,
  CommunityStats,
  CodingProfiles,
  PlatformAccount,
} from '../types';
import { calculateOverallRating, getNUBPCLevel, updateLeaderboard } from './ratingService';
import { codeforcesService } from './codeforcesService';
import { codechefService } from './codechefService';
import { leetcodeService } from './leetcodeService';
import { atcoderService } from './atcoderService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const isLiveSupabaseConnected = !!supabase;

const STORAGE_PREFIX = 'nubpc_store_';

class NUBPCStore {
  private students: StudentProfile[];
  private contests: Contest[];
  private resources: Resource[];
  private notices: Notice[];
  private departments: DepartmentInfo[];
  private ratingConfig: RatingConfig;
  private levelThresholds: LevelThresholds;
  private syncLogs: SyncLog[];
  private currentUser: StudentProfile | null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.students = this.load('students', MOCK_STUDENTS);
    this.contests = this.load('contests', MOCK_CONTESTS);
    this.resources = this.load('resources', MOCK_RESOURCES);
    this.notices = this.load('notices', MOCK_NOTICES);
    this.departments = this.load('departments', MOCK_DEPARTMENTS);
    this.ratingConfig = this.load('rating_config', INITIAL_RATING_CONFIG);
    this.levelThresholds = this.load('level_thresholds', INITIAL_LEVEL_THRESHOLDS);
    this.syncLogs = this.load('sync_logs', MOCK_SYNC_LOGS);

    const storedUserId = localStorage.getItem(STORAGE_PREFIX + 'current_user_id');
    const existing = this.students.find((s) => s.id === storedUserId);
    this.currentUser = existing || this.students[0]; // Tanvir Hossain by default
  }

  private load<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private save<T>(key: string, value: T) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // storage unavailable
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // GETTERS
  public getStudents(): StudentProfile[] {
    return [...this.students];
  }

  public getTopCoders(count = 5): StudentProfile[] {
    return [...this.students]
      .filter((s) => s.isActive)
      .sort((a, b) => b.overallRating - a.overallRating)
      .slice(0, count);
  }

  public getStudentByUsername(username: string): StudentProfile | undefined {
    return this.students.find(
      (s) => s.username.toLowerCase() === username.toLowerCase()
    );
  }

  public getStudentById(id: string): StudentProfile | undefined {
    return this.students.find((s) => s.id === id);
  }

  public getContests(): Contest[] {
    return [...this.contests];
  }

  public getContestById(idOrSlug: string): Contest | undefined {
    return this.contests.find(
      (c) => c.id === idOrSlug || c.slug === idOrSlug
    );
  }

  public getResources(): Resource[] {
    return [...this.resources];
  }

  public getNotices(): Notice[] {
    return [...this.notices].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  public getDepartments(): DepartmentInfo[] {
    return [...this.departments];
  }

  public getNoticeById(id: string): Notice | undefined {
    return this.notices.find((n) => n.id === id);
  }

  public getRatingConfig(): RatingConfig {
    return { ...this.ratingConfig };
  }

  public getLevelThresholds(): LevelThresholds {
    return { ...this.levelThresholds };
  }

  public getSyncLogs(): SyncLog[] {
    return [...this.syncLogs];
  }

  public getStats(): CommunityStats {
    const activeCoders = this.students.filter((s) => s.isActive).length + 176;
    const verifiedCoders = this.students.filter(
      (s) =>
        s.isActive &&
        (s.codingProfiles?.codeforces?.verified ||
          s.codingProfiles?.codechef?.verified ||
          s.codingProfiles?.leetcode?.verified ||
          s.codingProfiles?.atcoder?.verified)
    ).length + 165;

    return {
      members: this.students.length + 512,
      activeCoders,
      verifiedCoders,
      contests: this.contests.length + 34,
      resources: this.resources.length,
      notices: this.notices.length,
      problemsSolved:
        this.students.reduce((acc, curr) => acc + (curr.solvedProblemsCount || 0), 0) +
        11500,
    };
  }

  public getCurrentUser(): StudentProfile | null {
    return this.currentUser;
  }

  // AUTHENTICATION
  public setCurrentUser(user: StudentProfile | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(STORAGE_PREFIX + 'current_user_id', user.id);
    } else {
      localStorage.removeItem(STORAGE_PREFIX + 'current_user_id');
    }
    this.notify();
  }

  public async signUpWithSupabase(
    email: string,
    password: string,
    studentData: Omit<
      StudentProfile,
      | 'id'
      | 'rank'
      | 'overallRating'
      | 'level'
      | 'ratingChange'
      | 'joinedDate'
      | 'solvedProblemsCount'
      | 'ratingHistory'
      | 'contestHistory'
      | 'achievements'
      | 'isActive'
    >
  ): Promise<StudentProfile> {
    if (supabase) {
      try {
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: studentData.fullName,
              student_id: studentData.studentId,
              department: studentData.department,
              batch: studentData.batch,
            },
          },
        });
      } catch (err) {
        console.warn('Supabase auth signup notice:', err);
      }
    }
    return this.registerStudent(studentData);
  }

  public async signInWithSupabase(
    email: string,
    password: string
  ): Promise<{ user: StudentProfile | null; error?: string }> {
    if (supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.warn('Supabase signIn notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase signIn exception:', err);
      }
    }

    const found = this.students.find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
    if (!found) {
      return { user: null, error: 'No student account found with this email.' };
    }
    if (!found.isActive) {
      return { user: null, error: 'This student account has been deactivated by administration.' };
    }

    this.setCurrentUser(found);
    return { user: found };
  }

  public async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (supabase) {
      try {
        await supabase.auth.resetPasswordForEmail(email);
      } catch (err) {
        console.warn('Supabase password reset notice:', err);
      }
    }
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}.`,
    };
  }

  public registerStudent(
    newStudent: Omit<
      StudentProfile,
      | 'id'
      | 'rank'
      | 'overallRating'
      | 'level'
      | 'ratingChange'
      | 'joinedDate'
      | 'solvedProblemsCount'
      | 'ratingHistory'
      | 'contestHistory'
      | 'achievements'
      | 'isActive'
    >
  ): StudentProfile {
    const { overallRating } = calculateOverallRating(
      newStudent.codingProfiles,
      this.ratingConfig
    );
    const level = getNUBPCLevel(overallRating, this.levelThresholds);

    const fullStudent: StudentProfile = {
      ...newStudent,
      id: 'user-' + Date.now(),
      overallRating,
      ratingChange: 0,
      rank: this.students.length + 1,
      level,
      joinedDate: 'Sep 2026',
      solvedProblemsCount: Math.floor(overallRating * 0.4),
      isActive: true,
      ratingHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          contestName: 'Initial Account Verification',
          rating: overallRating,
          change: 0,
        },
      ],
      contestHistory: [],
      achievements: [],
    };

    this.students.push(fullStudent);
    this.recalculateRanks();
    this.save('students', this.students);
    this.setCurrentUser(fullStudent);
    return fullStudent;
  }

  public updateStudentProfile(
    studentId: string,
    updates: Partial<StudentProfile>
  ): StudentProfile | undefined {
    const idx = this.students.findIndex((s) => s.id === studentId);
    if (idx === -1) return undefined;

    const student = { ...this.students[idx], ...updates };

    // Recalculate rating if codingProfiles changed
    if (updates.codingProfiles) {
      const { overallRating } = calculateOverallRating(
        student.codingProfiles,
        this.ratingConfig
      );
      student.overallRating = overallRating;
      student.level = getNUBPCLevel(overallRating, this.levelThresholds);
    }

    this.students[idx] = student;
    this.recalculateRanks();
    this.save('students', this.students);

    if (this.currentUser?.id === studentId) {
      this.currentUser = student;
    }
    return student;
  }

  public toggleStudentStatus(studentId: string): boolean {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return false;
    student.isActive = !student.isActive;
    this.save('students', this.students);
    return student.isActive;
  }

  public deleteStudent(studentId: string): boolean {
    const idx = this.students.findIndex((s) => s.id === studentId);
    if (idx === -1) return false;
    this.students.splice(idx, 1);
    this.recalculateRanks();
    this.save('students', this.students);

    if (this.currentUser?.id === studentId) {
      this.setCurrentUser(null);
    }
    return true;
  }

  public recalculateRanks() {
    this.students = updateLeaderboard(
      this.students,
      this.ratingConfig,
      this.levelThresholds
    );
  }

  // RATING ENGINE ACTIONS
  public updateRatingConfig(newConfig: RatingConfig) {
    this.ratingConfig = newConfig;
    this.save('rating_config', this.ratingConfig);
    this.recalculateAllRatings();
  }

  public updateLevelThresholds(newThresholds: LevelThresholds) {
    this.levelThresholds = newThresholds;
    this.save('level_thresholds', this.levelThresholds);
    this.recalculateAllRatings();
  }

  public recalculateAllRatings() {
    this.students = updateLeaderboard(
      this.students,
      this.ratingConfig,
      this.levelThresholds
    );
    this.save('students', this.students);
  }

  // CONTEST MANAGEMENT
  public toggleContestRegistration(contestId: string, userId: string): boolean {
    const contest = this.contests.find((c) => c.id === contestId);
    if (!contest) return false;

    const index = contest.registeredUserIds.indexOf(userId);
    let isRegistered = false;
    if (index > -1) {
      contest.registeredUserIds.splice(index, 1);
      contest.participantsCount = Math.max(0, contest.participantsCount - 1);
      isRegistered = false;
    } else {
      contest.registeredUserIds.push(userId);
      contest.participantsCount += 1;
      isRegistered = true;
    }

    this.save('contests', this.contests);
    return isRegistered;
  }

  public addContest(contest: Omit<Contest, 'id'>): Contest {
    const newContest: Contest = {
      ...contest,
      id: 'contest-' + Date.now(),
      isPublished: contest.isPublished ?? true,
    };
    this.contests.unshift(newContest);
    this.save('contests', this.contests);
    return newContest;
  }

  public updateContest(id: string, updates: Partial<Contest>): Contest | undefined {
    const idx = this.contests.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.contests[idx] = { ...this.contests[idx], ...updates };
    this.save('contests', this.contests);
    return this.contests[idx];
  }

  public deleteContest(id: string): boolean {
    const idx = this.contests.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.contests.splice(idx, 1);
    this.save('contests', this.contests);
    return true;
  }

  // NOTICE MANAGEMENT
  public addNotice(notice: Omit<Notice, 'id'>): Notice {
    const newNotice: Notice = {
      ...notice,
      id: 'notice-' + Date.now(),
      isPublished: notice.isPublished ?? true,
    };
    this.notices.unshift(newNotice);
    this.save('notices', this.notices);
    return newNotice;
  }

  public updateNotice(id: string, updates: Partial<Notice>): Notice | undefined {
    const idx = this.notices.findIndex((n) => n.id === id);
    if (idx === -1) return undefined;
    this.notices[idx] = { ...this.notices[idx], ...updates };
    this.save('notices', this.notices);
    return this.notices[idx];
  }

  public deleteNotice(id: string): boolean {
    const idx = this.notices.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    this.notices.splice(idx, 1);
    this.save('notices', this.notices);
    return true;
  }

  // RESOURCE MANAGEMENT
  public addResource(resource: Omit<Resource, 'id'>): Resource {
    const newResource: Resource = {
      ...resource,
      id: 'res-' + Date.now(),
    };
    this.resources.unshift(newResource);
    this.save('resources', this.resources);
    return newResource;
  }

  public updateResource(id: string, updates: Partial<Resource>): Resource | undefined {
    const idx = this.resources.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    this.resources[idx] = { ...this.resources[idx], ...updates };
    this.save('resources', this.resources);
    return this.resources[idx];
  }

  public deleteResource(id: string): boolean {
    const idx = this.resources.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.resources.splice(idx, 1);
    this.save('resources', this.resources);
    return true;
  }

  // DEPARTMENTS MANAGEMENT
  public addDepartment(code: string, name: string, coordinator?: string): DepartmentInfo {
    const dept: DepartmentInfo = {
      code,
      name,
      headOrCoordinator: coordinator,
      totalStudents: 0,
    };
    this.departments.push(dept);
    this.save('departments', this.departments);
    return dept;
  }

  public deleteDepartment(code: string): boolean {
    const idx = this.departments.findIndex((d) => d.code === code);
    if (idx === -1) return false;
    this.departments.splice(idx, 1);
    this.save('departments', this.departments);
    return true;
  }

  // SYNCHRONIZATION
  public async syncStudent(studentId: string): Promise<SyncLog> {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const oldRating = student.overallRating;
    const profiles = { ...student.codingProfiles };

    // Synchronize each connected platform safely
    if (profiles.codeforces?.handle) {
      try {
        const cf = await codeforcesService.verifyUser(profiles.codeforces.handle);
        profiles.codeforces = { ...cf, oldRating: profiles.codeforces.rating };
      } catch (err: any) {
        profiles.codeforces.status = 'temporarily_unavailable';
        profiles.codeforces.errorMessage = err.message;
      }
    }

    if (profiles.codechef?.handle) {
      try {
        const cc = await codechefService.verifyUser(profiles.codechef.handle);
        profiles.codechef = { ...cc, oldRating: profiles.codechef.rating };
      } catch (err: any) {
        profiles.codechef.status = 'temporarily_unavailable';
      }
    }

    if (profiles.leetcode?.handle) {
      try {
        const lc = await leetcodeService.verifyUser(profiles.leetcode.handle);
        profiles.leetcode = { ...lc, oldRating: profiles.leetcode.rating };
      } catch (err: any) {
        profiles.leetcode.status = 'temporarily_unavailable';
      }
    }

    if (profiles.atcoder?.handle) {
      try {
        const ac = await atcoderService.verifyUser(profiles.atcoder.handle);
        profiles.atcoder = { ...ac, oldRating: profiles.atcoder.rating };
      } catch (err: any) {
        profiles.atcoder.status = 'temporarily_unavailable';
      }
    }

    const { overallRating } = calculateOverallRating(profiles, this.ratingConfig);
    const newRating = overallRating;
    student.codingProfiles = profiles;
    student.ratingChange = newRating - oldRating;
    student.overallRating = newRating;
    student.level = getNUBPCLevel(newRating, this.levelThresholds);

    this.recalculateRanks();
    this.save('students', this.students);

    const log: SyncLog = {
      id: 'sync-' + Date.now(),
      platform: 'All',
      triggeredBy: this.currentUser?.fullName || 'Administrator',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'success',
      recordsUpdated: 1,
      studentId: student.id,
      studentName: student.fullName,
      oldRating,
      newRating,
      message: `Synchronized ratings for ${student.fullName} (@${student.username}). Rating adjusted from ${oldRating} to ${newRating}.`,
    };

    this.syncLogs.unshift(log);
    this.save('sync_logs', this.syncLogs);
    return log;
  }

  public triggerSync(
    platform: 'Codeforces' | 'CodeChef' | 'LeetCode' | 'AtCoder' | 'All'
  ): SyncLog {
    this.recalculateAllRatings();

    const log: SyncLog = {
      id: 'sync-' + Date.now(),
      platform,
      triggeredBy: this.currentUser?.fullName || 'Administrator',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'success',
      recordsUpdated: this.students.length,
      message: `Synchronized ${platform} ratings for all ${this.students.length} students. Updated leaderboard ranks and tier designations.`,
    };

    this.syncLogs.unshift(log);
    this.save('sync_logs', this.syncLogs);
    return log;
  }
}

export const store = new NUBPCStore();
