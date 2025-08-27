export interface Emotion {
  icon: string;
  text: string;
}

export interface SpecialMoment {
  id?: number;
  title: string;
  description: string;
  date: string;
  icon: string;
  message?: string;
  author?: string;
  color?: string;
}

export interface Memory {
  id: number;
  thumbnail: string;
  fullImage: string;
  description: string;
  date: Date;
  category: string;
  quote?: string;
  author?: string;
}

export interface MomentCategory {
  id?: string;
  icon: string;
  title: string;
  count: number;
}

export interface FeaturedMoment {
  image: string;
  title: string;
  description: string;
} 