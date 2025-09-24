// Global type definitions
export interface User {
  id: string;
  name: string;
  isAnonymous: boolean;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  createdBy: string;
  createdAt: Date;
}

export interface DrawingOperation {
  id: string;
  type: 'draw' | 'erase';
  points: Point[];
  color: string;
  brushSize: number;
  userId: string;
  timestamp: number;
}

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}