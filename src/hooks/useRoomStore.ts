import { create } from 'zustand';
import type { Room, DrawingOperation } from '../types';

interface RoomState {
  currentRoom: Room | null;
  connectedUsers: string[];
  drawingOperations: DrawingOperation[];
  isConnected: boolean;
  isLoading: boolean;
}

interface RoomActions {
  joinRoom: (room: Room) => void;
  leaveRoom: () => void;
  addDrawingOperation: (operation: DrawingOperation) => void;
  clearCanvas: () => void;
  setConnectedUsers: (users: string[]) => void;
  setConnectionStatus: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
}

type RoomStore = RoomState & RoomActions;

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoom: null,
  connectedUsers: [],
  drawingOperations: [],
  isConnected: false,
  isLoading: false,

  joinRoom: (room: Room) =>
    set({
      currentRoom: room,
      isConnected: true,
      isLoading: false,
      drawingOperations: [] // Clear previous drawings when joining new room
    }),

  leaveRoom: () =>
    set({
      currentRoom: null,
      isConnected: false,
      connectedUsers: [],
      drawingOperations: []
    }),

  addDrawingOperation: (operation: DrawingOperation) =>
    set((state) => ({
      drawingOperations: [...state.drawingOperations, operation]
    })),

  clearCanvas: () =>
    set({ drawingOperations: [] }),

  setConnectedUsers: (users: string[]) =>
    set({ connectedUsers: users }),

  setConnectionStatus: (connected: boolean) =>
    set({ isConnected: connected }),

  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),
}));