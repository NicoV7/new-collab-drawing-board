// Global type definitions
export interface User {
  id: string;
  name: string;
  isAnonymous: boolean;
}

export interface RoomParticipant {
  userId: string;
  username: string;
  isAnonymous: boolean;
  joinedAt: Date;
  isActive: boolean;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  participants: RoomParticipant[];
  maxParticipants: number;
  isActive: boolean;
  isPublic: boolean;
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
  maxParticipants?: number;
  isPublic?: boolean;
}

export interface JoinRoomRequest {
  code: string;
  userId: string;
  username: string;
  isAnonymous: boolean;
}

export interface RoomState {
  currentRoom: Room | null;
  userRooms: Room[];
  recentRooms: Room[];
  isLoading: boolean;
  error: string | null;
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