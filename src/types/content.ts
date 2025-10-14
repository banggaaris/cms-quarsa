export interface TeamMember {
  id: string;
  name: string;
  position: string;
  expertise: string;
  experience: string;
  education: string;
  image: string;
  bio: string;
  specializations: string[];
  achievements: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  year: string;
  type: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  description: string;
  years: string;
  logo_url?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  trustedText: string;
  status: 'draft' | 'published';
  colors: {
    titleColor: string;
    subtitleColor: string;
    descriptionColor: string;
    trustedBadgeTextColor: string;
    trustedBadgeBgColor: string;
  };
  stats: {
    assets: string;
    clients: string;
    experience: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  title: string;
  description1: string;
  description2: string;
  mission: string;
  vision: string;
  gradientFromColor: string;
  gradientToColor: string;
  stats: {
    years: string;
    deals: string;
    value: string;
    team: string;
  };
}

export interface ContactContent {
  address: string;
  phone: string;
  email: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface WebsiteContent {
  hero: HeroContent;
  allHeroes: HeroContent[];
  about: AboutContent;
  services: Service[];
  team: TeamMember[];
  credentials: Credential[];
  clients: Client[];
  gallery: GalleryItem[];
  contact: ContactContent;
}