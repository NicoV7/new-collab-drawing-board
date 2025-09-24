import { create } from 'zustand';
import type { Room, DrawingOperation, CreateRoomRequest, JoinRoomRequest } from '../types';
import { roomUtils } from '../utils/room';

interface RoomState {
  // Current room and connection state (for drawing)
  currentRoom: Room | null;
  connectedUsers: string[];
  drawingOperations: DrawingOperation[];
  isConnected: boolean;

  // Room management state
  userRooms: Room[];
  recentRooms: Room[];
  isLoading: boolean;
  error: string | null;
}

interface RoomActions {
  // Room creation and joining
  createRoom: (request: CreateRoomRequest, createdBy: string) => Promise<Room>;
  joinRoomByCode: (roomCode: string, joinRequest: JoinRoomRequest) => Promise<Room>;

  // Drawing room actions
  joinRoom: (room: Room) => void;
  leaveRoom: () => void;

  // Drawing operations
  addDrawingOperation: (operation: DrawingOperation) => void;
  clearCanvas: () => void;

  // Connection management
  setConnectedUsers: (users: string[]) => void;
  setConnectionStatus: (connected: boolean) => void;

  // Room management
  loadUserRooms: (userId: string) => Promise<void>;
  loadRecentRooms: (userId: string) => Promise<void>;
  deleteRoom: (roomId: string, userId: string) => Promise<void>;

  // Participant management
  updateParticipantStatus: (roomId: string, userId: string, isActive: boolean) => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearRoomState: () => void;
}

type RoomStore = RoomState & RoomActions;

export const useRoomStore = create<RoomStore>((set, get) => ({
  // Initial state
  currentRoom: null,
  connectedUsers: [],
  drawingOperations: [],
  isConnected: false,
  userRooms: [],
  recentRooms: [],
  isLoading: false,
  error: null,

  // Room creation
  createRoom: async (request: CreateRoomRequest, createdBy: string) => {
    set({ isLoading: true, error: null });

    try {
      const room = await roomUtils.mockCreateRoom(request, createdBy);

      // Add to user's rooms
      const { userRooms } = get();
      set({
        userRooms: [room, ...userRooms],
        currentRoom: room,
        isLoading: false,
        isConnected: true,
      });

      return room;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create room',
        isLoading: false,
      });
      throw error;
    }
  },

  // Join room by code
  joinRoomByCode: async (roomCode: string, joinRequest: JoinRoomRequest) => {
    set({ isLoading: true, error: null });

    try {
      const room = await roomUtils.mockJoinRoom(roomCode, joinRequest);

      // Add to recent rooms if not already there
      const { recentRooms } = get();
      const isAlreadyRecent = recentRooms.some(r => r.id === room.id);
      const updatedRecentRooms = isAlreadyRecent
        ? recentRooms
        : [room, ...recentRooms.slice(0, 4)]; // Keep max 5 recent rooms

      set({
        currentRoom: room,
        recentRooms: updatedRecentRooms,
        isLoading: false,
        isConnected: true,
        drawingOperations: [], // Clear previous drawings
      });

      return room;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to join room',
        isLoading: false,
      });
      throw error;
    }
  },

  // Join room directly (for navigation)
  joinRoom: (room: Room) =>
    set({
      currentRoom: room,
      isConnected: true,
      isLoading: false,
      drawingOperations: [], // Clear previous drawings when joining new room
    }),

  // Leave current room
  leaveRoom: () =>
    set({
      currentRoom: null,
      isConnected: false,
      connectedUsers: [],
      drawingOperations: [],
    }),

  // Drawing operations
  addDrawingOperation: (operation: DrawingOperation) =>
    set((state) => ({
      drawingOperations: [...state.drawingOperations, operation],
    })),

  clearCanvas: () =>
    set({ drawingOperations: [] }),

  // Connection management
  setConnectedUsers: (users: string[]) =>
    set({ connectedUsers: users }),

  setConnectionStatus: (connected: boolean) =>
    set({ isConnected: connected }),

  // Load user's created rooms
  loadUserRooms: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const rooms = await roomUtils.mockGetUserRooms(userId);
      set({ userRooms: rooms, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load rooms',
        isLoading: false,
      });
    }
  },

  // Load recent rooms
  loadRecentRooms: async (_userId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Mock implementation - in real app, this would fetch from API
      const recentRooms: Room[] = [];
      set({ recentRooms, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load recent rooms',
        isLoading: false,
      });
    }
  },

  // Delete room (creator only)
  deleteRoom: async (roomId: string, _userId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const { userRooms, currentRoom } = get();

      // Remove from user rooms
      const updatedUserRooms = userRooms.filter(room => room.id !== roomId);

      // Clear current room if it's the deleted room
      const updatedCurrentRoom = currentRoom?.id === roomId ? null : currentRoom;

      set({
        userRooms: updatedUserRooms,
        currentRoom: updatedCurrentRoom,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete room',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update participant status
  updateParticipantStatus: (roomId: string, userId: string, isActive: boolean) => {
    const { currentRoom, userRooms } = get();

    // Update current room if it matches
    if (currentRoom?.id === roomId) {
      const updatedParticipants = currentRoom.participants.map(p =>
        p.userId === userId ? { ...p, isActive } : p
      );
      set({ currentRoom: { ...currentRoom, participants: updatedParticipants } });
    }

    // Update user rooms if any match
    const updatedUserRooms = userRooms.map(room => {
      if (room.id === roomId) {
        const updatedParticipants = room.participants.map(p =>
          p.userId === userId ? { ...p, isActive } : p
        );
        return { ...room, participants: updatedParticipants };
      }
      return room;
    });

    set({ userRooms: updatedUserRooms });
  },

  // State management
  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),

  setError: (error: string | null) =>
    set({ error }),

  clearRoomState: () =>
    set({
      currentRoom: null,
      connectedUsers: [],
      drawingOperations: [],
      isConnected: false,
      userRooms: [],
      recentRooms: [],
      isLoading: false,
      error: null,
    }),
}));