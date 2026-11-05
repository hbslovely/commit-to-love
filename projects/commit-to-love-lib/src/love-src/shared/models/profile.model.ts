export interface Profile {
  name: string;
  title: string;
  avatar: string;
  tags?: string[];
  headerImage?: string;
  description: string;
  loveMessage: string;
  gender: 'male' | 'female';
  basicInfo: {
    label: string;
    value: string;
    icon: string;
  }[];
  hobbies: {
    name: string;
    description: string;
    icon: string;
  }[];
  lifeGoals: string[];
  loveStory: string[];
  sweetMoments: {
    imageUrl: string;
    title: string;
    description: string;
    date: string;
  }[];
}

export interface BasicInfo {
  label: string;
  value: string;
  icon: string;
}

export interface Hobby {
  name: string;
  icon: string;
  description?: string;
}

export interface ProfileData {
  basicInfo: {
    name: string;
    title: string;
    description: string;
    loveMessage: string;
    avatar: string;
    tags: string[];
    stats: {
      icon: string;
      label: string;
      value: string;
    }[];
  };
  traits: {
    icon: string;
    title: string;
    description: string;
  }[];
  hobbies: {
    icon: string;
    name: string;
    description: string;
  }[];
  photos: {
    url: string;
    caption: string;
    description: string;
  }[];
  funFacts: FunFact[];
}


export interface FunFact {
  icon: string;
  title: string;
  description: string;
}

export interface SweetMoment {
  imageUrl: string;
  title: string;
  description: string;
  date?: string;
}
