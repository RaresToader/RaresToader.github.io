export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  title: string;
  /** Optional expansion of an acronym, shown small above the title. */
  subtitle?: string;
  /** One sentence. What it is, in plain words. */
  summary: string;
  /** 2–4 lines on the interesting part. Skip the obvious. */
  points: string[];
  stack: string[];
  year: string;
  links?: ProjectLink[];
  /** e.g. "University project", "Hackathon", "Semester project". */
  kind: string;
}

export const now: Project | null = {
  title: 'DENIM',
  subtitle: 'Dynamic Endpoint Network Impairment Model',
  summary:
    'A hardware module that breaks your network on purpose, at line rate, on the FPGA itself so you can find out what an RDMA stack does when the network misbehaves.',
  points: [
    'RDMA bypasses the kernel. That is the entire point of it, and also the problem: no software tool can drop a packet or set an ECN bit where it would matter. The published answer, Lumina, injects those events from a programmable Tofino switch, which means dedicated hardware, sitting in the middle of your network, unable to be co-designed with the endpoint’s own transport logic.',
    'DENIM moves that job to the endpoint. You write a rule like <code>PSN 50-150 : delay 1us</code>, software parses it and programs it through Coyote’s control plane. From then on a filter classifies packets on QPN, PSN, IP address and opcode, and routes the matches through effect blocks such as an ECN marker, a drop or a FIFO that holds a packet for a configurable number of microseconds. Everything else bypasses DENIM untouched.',
    // 'Filters and effects all speak the same generic AXI4-Stream interface, so adding a new effect later is meant to be a small job rather than a rewrite. The delay block is the one I am most wary of: it is the only stateful piece, and holding a packet for exactly one microsecond at 100 Gb/s is harder than that sentence makes it sound.',
    'Semester project in the Systems Group at ETH Zürich, advised by Maximilian Heer and Benjamin Ramhorst under Prof. Gustavo Alonso.',
  ],
  stack: ['FPGA', 'RoCE v2 / RDMA', 'AXI4-Stream', 'Coyote v2', 'C++', 'Python'],
  year: 'Jul – Sep 2026',
  kind: 'Semester project · ETH Zürich',
  links: [
    { label: 'Coyote v2 on GitHub', href: 'https://github.com/fpgasystems/Coyote' },
    { label: 'Coyote v2 paper', href: 'https://arxiv.org/abs/2504.21538' },
    {
      label: 'Lumina (SIGCOMM ’23)',
      href: 'https://dl.acm.org/doi/10.1145/3603269.3604837',
    },
  ],
};

export const projects: Project[] = [
  {
    title: 'BGP looking glass',
    summary:
      'A looking glass for BGP routing data, built at an NL-ix hackathon.',
    points: [
      'Wrote an awk script to parse routing data and pushed it into ClickHouse, a column-oriented database that turns out to be very good at answering "show me every route that changed in this window".',
    ],
    stack: ['ClickHouse', 'BGP', 'awk'],
    year: '2023',
    kind: 'Hackathon',
  },
  {
    title: 'Home Owners Association Management',
    summary:
      'A microservice system for running a home owners association: boards, members, the works.',
    points: [
      'Built the authentication service: JWT issuing and verification, and the access control that hangs off it.',
      'Built the home owners microservice, where members create and manage community boards, persisted in MySQL.',
    ],
    stack: ['Java', 'Spring', 'MySQL', 'JWT'],
    year: '2023',
    kind: 'University project',
  },
  {
    title: 'Energy Quiz',
    summary:
      'A multiplayer trivia game about energy use. Kahoot! but the questions make you feel bad about your tumble dryer.',
    points: [
      'REST APIs over Spring for everything the clients needed to agree on.',
      'Long-polling to keep players in sync and JavaFX for the UI.',
      'Scores and user state in an in-memory SQL database.',
    ],
    stack: ['Java', 'Spring', 'H2'],
    year: '2022',
    kind: 'University project',
  },
];

/** Grouped for the skills block. Order matters — most confident first. */
export const skills = [
  {
    group: 'Languages',
    items: ['Java', 'Python', 'C++', 'TypeScript', 'Bash'],
  },
  {
    group: 'Infrastructure',
    items: [
      'Linux',
      'Docker',
      'Kubernetes',
      'Terraform',
      'Ansible',
      'Grafana',
      'ClickHouse',
    ],
  },
  {
    group: 'Frameworks',
    items: ['Spring', 'React', 'Django', 'FastAPI', 'Flask'],
  },
  {
    group: 'Spoken',
    items: ['Romanian (native)', 'English (C2)', 'German (B2)', 'French (B1)'],
  },
];
