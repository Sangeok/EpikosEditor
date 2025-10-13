import { TextElement } from "@/entities/media/types";

export interface DraggableTextProps {
  element: TextElement;
}

export interface TextStyleConfig {
  fontSize: string;
  fontFamily: string;
  color: string;
  backgroundColor: string;
}

export interface BorderConfig {
  show: boolean;
  color: string;
}

export interface CursorState {
  isPlaying: boolean;
  isEditing: boolean;
  isHovered: boolean;
  isDragging: boolean;
}

export type CursorType = "default" | "text" | "grab" | "grabbing";
