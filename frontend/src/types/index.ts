export type UserRole = 'student' | 'instructor' | 'admin';
export type CourseLevel = 'debutant' | 'intermediaire' | 'avance';
export type LessonType = 'video' | 'notebook' | 'quiz' | 'project' | 'lecture';
export type SubscriptionPlan = 'free' | 'premium' | 'pro';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  plan: SubscriptionPlan;
  xpPoints: number;
  createdAt: Date;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: CourseLevel;
  durationHours: number;
  thumbnail?: string;
  instructorId: string;
  published: boolean;
  price: number;
  modules: Module[];
  createdAt: Date;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  videoAssetId?: string;
  content?: string;
  order: number;
  isFree: boolean;
}

export interface Progress {
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  quizScore?: number;
}
