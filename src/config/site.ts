export interface SiteConfig {
  siteTitle: string;
  siteDescription: string;
  author: {
    name: string;
    handle: string;
    bio: string;
    avatarSrc: string;
  };
  socialLinks: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export const siteConfig: SiteConfig = {
  siteTitle: 'tk3fftk',
  siteDescription: 'Activities, External Articles & Slides by Hiroki Takatsuka',
  author: {
    name: 'Hiroki Takatsuka',
    handle: 'tk3fftk',
    bio: 'SRE / Platform Engineer',
    avatarSrc: '/avatar.jpg',
  },
  socialLinks: {
    twitter: 'https://x.com/tk3fftk',
    github: 'https://github.com/tk3fftk',
  },
};
