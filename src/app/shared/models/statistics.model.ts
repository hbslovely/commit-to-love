export interface LoveStatistics {
  daysTogether: number;
  photosTaken: number;
  placesVisited: number;
  specialDates?: number;
  memoriesCount?: number;
}

export interface Milestone {
  icon: string;
  count: number | string;
  label: string;
}

export interface Category {
  title: string;
  icon: string;
  count: number;
} 