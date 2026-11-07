export type Social = {
  label: string;
  href?: string;
};

export type Profile = {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  location: string;
  availability: string;
  email: string;
  intro: string;
  socials: Social[];
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  category: string;
  client: string;
  role: string;
  summary: string;
  description: string[];
  cover: string;
  coverAlt: string;
  gallery: GalleryImage[];
  tags: string[];
  featured: boolean;
};

export type About = {
  heading: string;
  body: string[];
  image: string;
  imageAlt: string;
  stats: { value: string; label: string }[];
  capabilities: string[];
};

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
};

export type Contact = {
  heading: string;
  note: string;
  cta: string;
};

export type SpaceRow = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  body: string[];
  image: string;
  imageAlt: string;
  video?: string;
  caption: string;
  meta: { label: string; value: string }[];
};

export type SpacePage = {
  eyebrow: string;
  title: string;
  standfirst: string;
  intro: string[];
  rows: SpaceRow[];
};

export type PortfolioContent = {
  profile: Profile;
  slides: HeroSlide[];
  projects: Project[];
  about: About;
  process: ProcessStep[];
  contact: Contact;
};
