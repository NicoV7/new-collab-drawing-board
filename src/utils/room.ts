import type { Room, RoomParticipant, CreateRoomRequest, JoinRoomRequest } from '../types';

export const roomUtils = {
  // Generate a unique 6-character room code
  generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Generate a unique room ID
  generateRoomId(): string {
    return crypto.randomUUID();
  },

  // Validate room code format
  isValidRoomCode(code: string): boolean {
    return /^[A-Z0-9]{6}$/.test(code);
  },

  // Create a new room
  createRoom(request: CreateRoomRequest, createdBy: string): Room {
    const now = new Date();
    return {
      id: this.generateRoomId(),
      code: this.generateRoomCode(),
      name: request.name.trim(),
      description: request.description?.trim(),
      createdBy,
      createdAt: now,
      participants: [],
      maxParticipants: request.maxParticipants || 10,
      isActive: true,
      isPublic: request.isPublic ?? true,
    };
  },

  // Add participant to room
  addParticipant(room: Room, request: JoinRoomRequest): Room {
    const participant: RoomParticipant = {
      userId: request.userId,
      username: request.username,
      isAnonymous: request.isAnonymous,
      joinedAt: new Date(),
      isActive: true,
    };

    return {
      ...room,
      participants: [...room.participants, participant],
    };
  },

  // Remove participant from room
  removeParticipant(room: Room, userId: string): Room {
    return {
      ...room,
      participants: room.participants.filter(p => p.userId !== userId),
    };
  },

  // Check if user is in room
  isUserInRoom(room: Room, userId: string): boolean {
    return room.participants.some(p => p.userId === userId);
  },

  // Check if room is full
  isRoomFull(room: Room): boolean {
    return room.participants.length >= room.maxParticipants;
  },

  // Check if user is room creator
  isRoomCreator(room: Room, userId: string): boolean {
    return room.createdBy === userId;
  },

  // Get active participant count
  getActiveParticipantCount(room: Room): number {
    return room.participants.filter(p => p.isActive).length;
  },

  // Format room creation date
  formatCreatedDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  // Generate shareable room URL
  generateRoomUrl(roomCode: string): string {
    return `${window.location.origin}/room/${roomCode}`;
  },

  // Validate room creation request
  validateCreateRoomRequest(request: CreateRoomRequest): string[] {
    const errors: string[] = [];

    if (!request.name?.trim()) {
      errors.push('Room name is required');
    } else if (request.name.trim().length < 3) {
      errors.push('Room name must be at least 3 characters');
    } else if (request.name.trim().length > 50) {
      errors.push('Room name must be less than 50 characters');
    }

    if (request.description && request.description.length > 200) {
      errors.push('Room description must be less than 200 characters');
    }

    if (request.maxParticipants && (request.maxParticipants < 2 || request.maxParticipants > 50)) {
      errors.push('Room capacity must be between 2 and 50 participants');
    }

    return errors;
  },

  // Mock API functions (replace with real API calls later)
  async mockCreateRoom(request: CreateRoomRequest, createdBy: string): Promise<Room> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.createRoom(request, createdBy);
  },

  async mockJoinRoom(roomCode: string, joinRequest: JoinRoomRequest): Promise<Room> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock room data - in real implementation, this would fetch from API
    const mockRoom: Room = {
      id: this.generateRoomId(),
      code: roomCode.toUpperCase(),
      name: `Room ${roomCode}`,
      description: 'A collaborative drawing room',
      createdBy: 'mock-user-id',
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      participants: [
        {
          userId: 'mock-user-1',
          username: 'Creative User',
          isAnonymous: false,
          joinedAt: new Date(Date.now() - 20 * 60 * 1000),
          isActive: true,
        },
      ],
      maxParticipants: 10,
      isActive: true,
      isPublic: true,
    };

    // Add new participant
    return this.addParticipant(mockRoom, joinRequest);
  },

  async mockGetUserRooms(userId: string): Promise<Room[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    // Mock user's created rooms
    return [
      {
        id: this.generateRoomId(),
        code: 'ABC123',
        name: 'My Art Project',
        description: 'Working on landscape sketches',
        createdBy: userId,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        participants: [
          {
            userId,
            username: 'You',
            isAnonymous: false,
            joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isActive: false,
          },
        ],
        maxParticipants: 10,
        isActive: true,
        isPublic: false,
      },
    ];
  },
};