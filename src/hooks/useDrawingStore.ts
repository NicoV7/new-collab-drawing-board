import { create } from 'zustand';

interface DrawingState {
  selectedTool: 'pen' | 'eraser';
  selectedColor: string;
  brushSize: number;
  isDrawing: boolean;
}

interface DrawingActions {
  setTool: (tool: 'pen' | 'eraser') => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setIsDrawing: (drawing: boolean) => void;
}

type DrawingStore = DrawingState & DrawingActions;

export const useDrawingStore = create<DrawingStore>((set) => ({
  selectedTool: 'pen',
  selectedColor: '#000000',
  brushSize: 3,
  isDrawing: false,

  setTool: (tool: 'pen' | 'eraser') =>
    set({ selectedTool: tool }),

  setColor: (color: string) =>
    set({ selectedColor: color }),

  setBrushSize: (size: number) =>
    set({ brushSize: size }),

  setIsDrawing: (isDrawing: boolean) =>
    set({ isDrawing }),
}));