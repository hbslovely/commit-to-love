import { Attractions, CustomSection, Food, NearbyAttraction, RecommendedFood } from './place.model';

export interface Song {
  id: number;
  title: string;
  artist: string;
  url?: string;
  coverImage?: string;
  description?: string;
  date?: string;
}

export interface Place {
  id: number;
  name: string;
  location: string;
  image: string;
  date: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Quote {
  id?: number;
  text: string;
  author: string;
  date?: string;
  context?: string;
  icon?: string;
}

export interface Gift {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  occasion?: string;
  from?: string;
  to?: string;
}

export interface Promise {
  id: number;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface Goal {
  id: number;
  title: string;
  timeframe: string;
  icon: string;
}

export interface MemoryPlace {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  detailedDescription: string;
  region: string;
  features: string[];
  bestTimeToVisit?: string;
  seasonalTips?: string[];
  howToGet?: string;
  localFood?: Food[];
  attractions?: Attractions;
  nearbyAttractions?: NearbyAttraction[];
  recommendedFood?: RecommendedFood[];
  customSection?: CustomSection | CustomSection[];
}

export interface LoveTimelineEvent {
  date: string;
  icon: string;
  title: string;
  description: string;
}

export interface LoveTimelineData {
  sectionTitle: string;
  quote: {
    content: string;
    author: string;
  };
  events: LoveTimelineEvent[];
}
