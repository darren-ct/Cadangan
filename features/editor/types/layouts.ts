// Layout Related
export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isResizable?: boolean;
  isDraggable?: boolean;
  item?: unknown;
}

export interface DefaultLayouts {
  sm: LayoutItem[];
  xs: LayoutItem[];
}

export interface Cols {
  sm: number;
  xs: number;
}

export interface Breakpoints {
  sm: number;
  xs: number;
}
