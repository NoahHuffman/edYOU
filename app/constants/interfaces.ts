export interface Assignment {
  course_id: string;
  name: string;
  description: string;
  time: string;
  due_at: string;
  html_url?: string;
}

export interface Course {
  course_id: number;
  id: number;
  name: string;
}

export interface CourseAssignment {
  [courseName: string]: {
    name: string;
    description: string;
    dueDate: string;
    html_url?: string;
  }[];
}

export interface Items {
  [date: string]: Assignment[];
}
