export interface Resource {
  resourceId: number;
  title: string;
  author: string | null;
  resourceImage: string | null;
  category: string | null;
  format: string | null;
  location: string | null;
  status: string | null;
  publicationDate: Date | null;
}

export interface ResourceListItem {
  loanId: number;
  resourceId: number;
  title: string | null;
  author: string | null;
  category: string | null;
  fullName: string | null;
  borrowDate: Date;
  dueDate: Date;
  status: string | null;
  resourceImage: string | null;
}

export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  registrationDate: Date | null;
  isActive: boolean;
  borrowedBookCount: number
}

export interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  role: ROLE;
}

export type ROLE = "admin" | "student" | "staff" | "faculty";