
export interface Link {
  label: string;
  href: string;
  handle?: string;
}

export const site = {
  name: 'Rareș Toader',

  role: 'Graduate Student',

  description:
    'Rareș Toader — systems / software engineer. MSc at ETH Zürich, previously production reliability engineer at Jump Trading.',

  location: 'Zürich, Switzerland',

  status: {
    available: true,
    text: 'MSc at ETH Zürich, working with the Systems Group',
  },

  email: 'rarestoader02@gmail.com',

  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/RaresToader',
      handle: '@RaresToader',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/rares-toader-10b060230/',
      handle: 'rares-toader',
    },
    {
      label: 'Email',
      href: 'mailto:rarestoader02@gmail.com',
      handle: 'rarestoader02@gmail.com',
    },
  ] satisfies Link[],

  /**
   * Footer baseline. Set either side to `null` to drop it — none of it is
   * required. Copyright is automatic under the Berne Convention (the © notice
   * has had no legal effect since 1989), and Astro (MIT) plus Inter and
   * JetBrains Mono (OFL) all require their notices to travel with the
   * distributed files, not to appear on the rendered page.
   */
  footer: {
    left: 'No trackers, no cookies.',
    right: null as string | null,
  },


  nav: [
    { label: 'Now', href: '/#now' },
    { label: 'Work', href: '/#work' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Writing', href: '/writing' },
    { label: 'Contact', href: '/#contact' },
  ],
} as const;
