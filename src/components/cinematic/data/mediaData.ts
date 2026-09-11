import { MediaItem, CarouselConfig, InteractionConfig, LayoutConfig, StyleConfig } from '../types';

export const FRAMER_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    title: 'Avant Noir',
    subtitle: 'Editorial Series',
    mediaType: 'image',
    image: 'https://framerusercontent.com/images/FoyA9guBxpmhcqDLHhVuq1MKg.jpeg?width=1792&height=2400',
    tag: 'Botanical 01',
  },
  {
    id: 'm2',
    title: 'Kinetic Drift',
    subtitle: 'Motion Synthesis',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1608248597359-25f0a8d46158?q=80&w=1792&auto=format&fit=crop',
    tag: 'Aesthetic 02',
  },
  {
    id: 'm3',
    title: 'Solar Monolith',
    subtitle: 'Brutalist Architecture',
    mediaType: 'image',
    image: 'https://framerusercontent.com/images/jFKA626JR3qumtUOVF1bcDhoKtU.jpeg?width=1792&height=2400',
    tag: 'Botanical 03',
  },
  {
    id: 'm4',
    title: 'Fluid Chroma',
    subtitle: 'Refractive Study',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1792&auto=format&fit=crop',
    tag: 'Aesthetic 04',
  },
  {
    id: 'm5',
    title: 'Silhouettes in Dusk',
    subtitle: 'Tonal Portraits',
    mediaType: 'image',
    image: 'https://framerusercontent.com/images/D6nJ6lPFbF30aB3djXQhFXXA.jpeg?width=1792&height=2400',
    tag: 'Botanical 05',
  },
  {
    id: 'm6',
    title: 'Aura Pulse',
    subtitle: 'Luminescent Flux',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1792&auto=format&fit=crop',
    tag: 'Aesthetic 06',
  },
  {
    id: 'm7',
    title: 'Structural Echo',
    subtitle: 'Geometric Horizons',
    mediaType: 'image',
    image: 'https://framerusercontent.com/images/zpSB8VO8tkc3tcRFU9zLGP3pNs.jpeg?width=1792&height=2400',
    tag: 'Architecture 07',
  },
  {
    id: 'm8',
    title: 'Vortex Sequence',
    subtitle: 'Dynamic Viscosity',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1792&auto=format&fit=crop',
    tag: 'Botanical 08',
  },
  {
    id: 'm9',
    title: 'Ceramic Shade',
    subtitle: 'Tactile Textures',
    mediaType: 'image',
    image: 'https://framerusercontent.com/images/qRdKj75WgpZO8ehkpmFb3y9R7XQ.jpeg?width=1792&height=2400',
    tag: 'Sculpture 09',
  },
  {
    id: 'm10',
    title: 'Cascade Ripple',
    subtitle: 'Surface Resonance',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1792&auto=format&fit=crop',
    tag: 'Botanical 10',
  },
  {
    id: 'm11',
    title: 'Ochre Horizon',
    subtitle: 'Atmospheric Earth',
    mediaType: 'image',
    image: 'https://framerusercontent.com/images/nx8NUhK1q27zPwcRZbhGQsp62qo.jpeg?width=1792&height=2400',
    tag: 'Ceramics 11',
  },
  {
    id: 'm12',
    title: 'Lumina Loop',
    subtitle: 'Temporal Light Flow',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1792&auto=format&fit=crop',
    tag: 'Botanical 12',
  },
  {
    id: 'm13',
    title: 'Terra Nova',
    subtitle: 'Modernist Ceramics',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1792&auto=format&fit=crop',
    tag: 'Sculpture 13',
  },
  {
    id: 'm14',
    title: 'Pure Essence',
    subtitle: 'Natural Radiance',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1792&auto=format&fit=crop',
    tag: 'Botanical 14',
  },
];

export const DEFAULT_CAROUSEL_CONFIG: CarouselConfig = {
  count: 14,
  radius: 12,
  itemWidth: 5.3,
  itemHeight: 7.6,
  initialRotation: 0,
};

export const DEFAULT_INTERACTION_CONFIG: InteractionConfig = {
  autoPlay: true,
  speed: 0.1,
  damping: 14,
};

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  cameraX: 5,
  cameraY: 0.5,
  cameraZ: 11,
  cameraPanY: 24,
  fov: 58,
};

export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  transparentBg: true,
  backgroundColor: '#000000',
  fog: true,
  fogColor: '#000000',
  fogNear: 16,
  fogFar: 38,
};
