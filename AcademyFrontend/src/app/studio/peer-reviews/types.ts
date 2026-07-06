export interface ProjectSubmission {
  id: string;
  project: number;
  project_title: string;
  project_is_final: boolean;
  course_title: string;
  course_slug: string;
  student_name: string;
  student_username: string;
  repo_url: string | null;
  code_content: string | null;
  status: 'draft' | 'pending' | 'in_review' | 'graded' | 'approved' | 'rejected';
  submitted_at: string;
  reviews: any[];
  created_at: string;
  updated_at: string;
}

export interface ReviewPayload {
  scores: {
    global: number;
  };
  feedback: string;
}
