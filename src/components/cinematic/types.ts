export interface MediaItem {
  id: string;
  title: string;
  subtitle: string;
  mediaType: 'image' | 'video';
  image?: string;
  video?: string;
  tag?: string;
}

export interface CarouselConfig {
  count: number;
  radius: number;
  itemWidth: number;
  itemHeight: number;
  initialRotation?: number;
}

export interface InteractionConfig {
  autoPlay: boolean;
  speed: number;
  damping: number;
}

export interface LayoutConfig {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  cameraPanY: number;
  fov: number;
}

export interface StyleConfig {
  transparentBg: boolean;
  backgroundColor: string;
  fog: boolean;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}
