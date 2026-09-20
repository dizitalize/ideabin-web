export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  media: "image" | "video";
  readTime?: string;
  hot?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "best-full-body-home-gym-machines",
    title: "Best Full-Body Home Gym Machines!",
    excerpt:
      "Compact strength stations ranked for real progressive overload — no wasted floor space, no gimmick pulleys.",
    category: "Gym",
    date: "22 Feb",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=75&w=1200&auto=format&fit=crop",
    media: "image",
    readTime: "8 Min",
  },
  {
    id: "ready-set-go-how-to-start-running",
    title: "Ready, Set, Go! How to Start Running to Stay Fit",
    excerpt:
      "Walking is recognized as a safe and effective mode of exercise when the goal is to improve fitness, health, or both. Something as simple as a daily brisk walk can help someone rebuild capacity from zero.",
    category: "Gym",
    date: "12 Feb",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=75&w=1200&auto=format&fit=crop",
    media: "image",
    hot: true,
  },
  {
    id: "overcoming-laziness-in-sports",
    title: "Overcoming Laziness in Sports",
    excerpt:
      "Motivation follows action, not the other way around. A practical protocol for starting when every cell resists.",
    category: "Gym",
    date: "12 Feb",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=75&w=1200&auto=format&fit=crop",
    media: "image",
    hot: true,
  },
  {
    id: "athletic-training-soft-and-hard-styles",
    title: "Athletic Training | Soft and Hard Styles of Training",
    excerpt:
      "Periodizing plyometric intensity with mobility work so joints survive the strength you build.",
    category: "Tutorial",
    date: "22 Feb",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=75&w=1200&auto=format&fit=crop",
    media: "video",
    readTime: "5 Min",
  },
  {
    id: "breathwork-for-endurance-athletes",
    title: "Breathwork for Endurance Athletes",
    excerpt:
      "Nasal pacing, CO2 tolerance tables, and how respiratory strength quietly caps your engine.",
    category: "Running",
    date: "18 Feb",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=75&w=1200&auto=format&fit=crop",
    media: "image",
    readTime: "6 Min",
  },
  {
    id: "mobility-flows-for-desk-workers",
    title: "Mobility Flows for Desk Workers",
    excerpt:
      "Nine minutes of loaded stretching that undoes eight hours of sitting — hips, T-spine, wrists.",
    category: "Tutorial",
    date: "15 Feb",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=75&w=1200&auto=format&fit=crop",
    media: "video",
    readTime: "9 Min",
  },
  {
    id: "fueling-strength-on-a-busy-schedule",
    title: "Fueling Strength on a Busy Schedule",
    excerpt:
      "Protein timing without meal-prep Sundays: convenience foods ranked by leucine per dollar.",
    category: "Nutrition",
    date: "10 Feb",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=75&w=1200&auto=format&fit=crop",
    media: "image",
    readTime: "7 Min",
  },
  {
    id: "the-quiet-power-of-zone-2",
    title: "The Quiet Power of Zone 2",
    excerpt:
      "Eighty percent of your cardio should feel embarrassingly easy. The physiology of the base.",
    category: "Running",
    date: "08 Feb",
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=75&w=1200&auto=format&fit=crop",
    media: "image",
    readTime: "10 Min",
  },
  {
    id: "small-space-smart-training",
    title: "How to Work Out in a Limited Space",
    excerpt:
      "Density training for studio apartments: one kettlebell, one mat, measurable progress.",
    category: "Gym",
    date: "05 Feb",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=75&w=1200&auto=format&fit=crop",
    media: "image",
    readTime: "6 Min",
  },
  {
    id: "reading-greens-like-a-pro",
    title: "How to Read Golf Green Grain Like a Pro",
    excerpt:
      "Slope, shine, and grass species — decode the break before you even crouch down.",
    category: "Tutorial",
    date: "02 Feb",
    image:
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=75&w=1200&auto=format&fit=crop",
    media: "image",
    readTime: "4 Min",
  },
];

export const blogCategories: string[] = [
  "Medical Knowledge",
  "Bodybuilding",
  "Reggie Food",
  "Sickness",
  "Life Style",
  "Diet",
  "Diseases",
  "Healthy Food",
];
