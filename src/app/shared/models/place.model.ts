export interface CustomSection {
  title: string;
  content: string;
}

export interface Food {
  name: string;
  description: string;
  image?: string;
  restaurant?: string;
  where?: string;
  price?: string;
  person?: string;
  dish?: string;
  story?: string;
  feeling?: string;
}

export interface Attractions {
  historical?: Attraction[];
  religious?: Attraction[];
  entertainment?: Attraction[];
  cultural?: Attraction[];
  natural?: Attraction[];
  adventure?: Attraction[];
  shopping?: Attraction[];
  architectural?: Attraction[];
}

export interface Attraction {
  name: string;
  description: string;
  image?: string;
}

export interface NearbyAttraction {
  name: string;
  description: string;
  distance: string;
  travelTime: string;
  image?: string;
}

export interface RecommendedFood {
  name: string;
  description: string;
  restaurant: string;
  where?: string;
  price: string;
  image?: string;
}
