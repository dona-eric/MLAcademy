export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Lesson {
  id: number;
  title: string;
  lesson_type: 'video' | 'text' | 'notebook' | 'quiz' | 'exercise';
  content: string;
  video_url: string;
  duration_minutes: number;
  order: number;
  is_free_preview: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  instructions: string;
  starter_code: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  project?: Project;
}

export interface CourseReview {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CourseSummary {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  category: Category;
  instructor_name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  thumbnail: string | null;
  avg_rating: string;
  enrolled_count: number;
  is_free: boolean;
}

export interface CourseDetail extends CourseSummary {
  description: string;
  preview_url: string;
  prerequisites: string;
  syllabus: string;
  modules: Module[];
  reviews: CourseReview[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
