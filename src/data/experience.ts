/** Work history, newest first. `end: null` renders as "Present". */

export interface Role {
  company: string;
  title: string;
  location: string;
  /** ISO yyyy-mm. Parsed as a date only for formatting. */
  start: string;
  end: string | null;
  /** 1–4 lines. Lead with the thing you actually did. */
  points: string[];
  /** Short tech list shown as mono tags. Keep to ~7. */
  // stack: string[];
  // tags still present in Work.astro
  href?: string;
}

export const experience: Role[] = [
  {
    company: 'Jump Trading',
    title: 'Technical Operations Systems Engineer / Production Reliability Engineer',
    location: 'Amsterdam, NL',
    start: '2024-10',
    end: '2026-05',
    points: [
      'Kept low-latency trading systems healthy while they were live, which mostly meant diagnosing Linux, network and application problems on a clock, with traders, developers, clearing and risk all wanting an answer at the same time.',
      'Handled day-to-day configuration on network devices across global data centres, including standing up new BGP sessions whenever we needed new connectivity.',
      'Automated manual production workflows with Python / Ansible. Also built a real-time market data event listener to satisfy a compliance requirement.',
      'Advocated for applications emitting metrics into ClickHouse and built the Grafana dashboards on top, to help with observability during oncall shifts.',
    ],
    // stack: ['Linux', 'BGP', 'Python', 'Go', 'Bash', 'ClickHouse', 'Grafana'],
    href: 'https://www.jumptrading.com/',
  },
  {
    company: 'Jump Trading',
    title: 'TechOps Intern',
    location: 'Amsterdam, NL',
    start: '2024-07',
    end: '2024-09',
    points: [
      'A summer building a Python project that tidied up several internal business processes.',
      'My team owned application deployment, so it was my first proper go at Ansible: playbooks, roles, and learning to trust a run that reports no changes.',
    ],
    // stack: ['Python'],
    href: 'https://www.jumptrading.com/',
  },
  {
    company: 'TNG Technology Consulting',
    title: 'Junior Consultant',
    location: 'Munich, DE',
    start: '2023-07',
    end: '2023-09',
    points: [
      'Built a ticket management system for a Bundesliga football club, React and TypeScript for the frontend, Python and Flask for the backend.',
      'Provisioned the Google Cloud side as code with Terraform. My first proper encounter with infrastructure you describe rather than click, and I have not gone back.',
    ],
    // stack: ['React', 'TypeScript', 'Python', 'Flask', 'Terraform', 'GCP'],
    href: 'https://www.tngtech.com/',
  },
  {
    company: 'Sourcer',
    title: 'Software Engineering Intern',
    location: 'Delft, NL',
    start: '2023-04',
    end: '2023-06',
    points: [
      'Built NewsCop, which detects overlap between news articles.',
      'Django API endpoints and document fingerprinting that decides whether two articles are extremely similar.',
      'Deployed the application as containerised services to AWS.',
    ],
    // stack: ['Python', 'Django', 'React', 'PostgreSQL', 'AWS', 'Docker'],
  },
  {
    company: 'TU Delft',
    title: 'Head Teaching Assistant & Student Mentor',
    location: 'Delft, NL',
    start: '2022-09',
    end: '2024-06',
    points: [
      'Coordinated labs for several courses, gave students feedback on assignments and helped organise exams.',
      'Weekly meetings with freshmen students on how to study at university.',
    ],
    // stack: ['Teaching', 'Java'],
  },
];

export const education = [
  {
    school: 'ETH Zürich',
    degree: 'MSc Computer Science',
    location: 'Zürich, CH',
    start: '2026-06',
    end: null as string | null,
    note: 'In progress — expected Feb 2028',
  },
  {
    school: 'Delft University of Technology',
    degree: 'BSc Computer Science and Engineering',
    location: 'Delft, NL',
    start: '2021-09',
    end: '2024-06',
    note: 'GPA 9.04/10, graduated cum laude · Honours Programme, competitive programming track',
  },
  {
    school: '"Emil Racovita" National College',
    degree: 'Computer Science & Mathematics',
    location: 'Cluj-Napoca, RO',
    start: '2017-09',
    end: '2021-06',
    note: 'GPA 9.96/10',
  },
];


/** Short one-liners. Rendered as a plain list under Education. */
/** In Work.astro component  */
// export const honours: string[] = [
/** 'Completed the Honours Programme (competitive programming track) at TU Delft.', */ 
  // 'Qualified for the national stage of the Mathematics Olympiads several times at school.',
  // 'Attended Google IO Connect Amsterdam, mostly for the web and mobile sessions.',
// ];
