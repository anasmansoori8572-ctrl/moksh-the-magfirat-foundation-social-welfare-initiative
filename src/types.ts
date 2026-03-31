import { Timestamp } from 'firebase/firestore';

export interface Initiative {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  createdAt: Timestamp;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  role?: string;
  photoUrl?: string;
  approved: boolean;
  createdAt: Timestamp;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: string;
  title?: string;
  createdAt: Timestamp;
}

export interface Suggestion {
  id: string;
  name: string;
  email: string;
  content: string;
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}

export interface PlaybookEntry {
  id: string;
  title: string;
  imageUrl: string;
  steps: string[];
  createdAt: Timestamp;
}
