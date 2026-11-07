import type {
  HeroSlide,
  PortfolioContent,
  ProcessStep,
  Project,
  SpacePage,
} from './types';

/**
 * The content store for the whole site.
 *
 * This is the "backend": the API routes in `app/api/*` and the server
 * components both read from here. Edit text and image paths in this file,
 * drop new images into `public/images`, and every page updates.
 */

const profile = {
  name: 'Tirth S Pandya',
  shortName: 'Tirth',
  role: 'Visual designer & creative developer',
  tagline: 'where curiosity begins',
  location: 'India — working worldwide',
  availability: 'Available for select projects',
  email: 'hello@tirthpandya.com',
  intro:
    'I design and build visual experiences for people who care about the details — art direction, identity and the web.',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/tirthpandya' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/tirthpandya' },
    { label: 'GitHub', href: 'https://github.com/tirthpandya' },
    { label: 'Email', href: 'mailto:hello@tirthpandya.com' },
  ],
};

const slides: HeroSlide[] = [
  {
    id: 'notes',
    eyebrow: '01 — Observations',
    title: 'Notes',
    description: 'A soft, radiant light that illuminates the soul.',
    image: 'portfolio/notes.jpg',
    alt: 'A candlelit portrait in the manner of a classical oil painting',
  },
  {
    id: 'philosophy',
    eyebrow: '02 — Beliefs',
    title: 'Philosophy',
    description: 'Lost in a desert of blooming dreams and endless horizons.',
    image: 'portfolio/philosophy.jpg',
    alt: 'Baroque painting of a figure shielding their face with an arm',
  },
  {
    id: 'thoughts',
    eyebrow: '03 — After dark',
    title: 'Thoughts',
    description: 'Wrapped in the deep, luxurious embrace of the night.',
    image: 'portfolio/thoughts.jpg',
    alt: 'A caped figure watching a rain-soaked city at night',
  },
  {
    id: 'shots',
    eyebrow: '04 — Through a lens',
    title: 'Shots',
    description: 'That fleeting moment when the world is dipped in gold.',
    image: 'portfolio/shots.jpg',
    alt: 'Pink pencil sketch of a pair of eyes looking directly ahead',
  },
  {
    id: 'space',
    eyebrow: '05 — Beyond',
    title: 'Space',
    description: 'Where reality fades and imagination takes flight.',
    image: 'portfolio/space.jpg',
    alt: 'A black hole bending light into a bright ring around its horizon',
  },
];

const projects: Project[] = [
  {
    slug: 'nocturne',
    title: 'Nocturne',
    year: '2026',
    category: 'Thoughts',
    client: 'Self-initiated',
    role: 'Art direction · Design · Build',
    summary:
      'A visual journal for the hours after midnight — part photo essay, part interactive film.',
    description: [
      'Nocturne began as a folder of photographs taken on walks home after midnight: wet asphalt, empty intersections, windows still lit. The question was how to make a website feel like that walk instead of simply documenting it.',
      'The answer was a single continuous surface. Images dissolve into one another with a slow, liquid reveal, and the type follows the same curve, so browsing feels less like navigation and more like looking up at a city that keeps rearranging itself.',
      'Built with a custom WebGL shader, a restrained monochrome palette, and no interface chrome beyond the chapter titles. It holds sixty frames a second on a five-year-old laptop.',
    ],
    cover: 'portfolio/thoughts.jpg',
    coverAlt: 'A caped figure watching a rain-soaked city at night',
    gallery: [
      { src: 'portfolio/space.jpg', alt: 'A black hole bending light into a bright ring' },
      { src: 'portfolio/notes.jpg', alt: 'A candlelit portrait in the manner of a classical oil painting' },
    ],
    tags: ['Art direction', 'WebGL', 'Motion'],
    featured: true,
  },
  {
    slug: 'the-quiet-hours',
    title: 'The Quiet Hours',
    year: '2025',
    category: 'Notes',
    client: 'Studio Mutable',
    role: 'Photography · Art direction',
    summary:
      'A photographic study of domestic light — candles, dust, and the last hour of the day.',
    description: [
      'Forty homes, photographed at dusk over one winter, using only the light that was already in the room. No strobes, no styling, no second takes that mattered more than the first.',
      'The series was commissioned by Studio Mutable for an exhibition about slowness, and later became a small book. The edit favours the frames where nothing is happening: a chair, a curtain, a hand resting on a table.',
      'It is the project I return to when I need to remember why I like looking at things.',
    ],
    cover: 'portfolio/notes.jpg',
    coverAlt: 'A candlelit portrait in the manner of a classical oil painting',
    gallery: [
      { src: 'portfolio/philosophy.jpg', alt: 'Baroque painting of a figure shielding their face' },
      { src: 'portfolio/shots.jpg', alt: 'Pink pencil sketch of a pair of eyes' },
    ],
    tags: ['Photography', 'Editorial', 'Print'],
    featured: true,
  },
  {
    slug: 'bloom',
    title: 'Bloom',
    year: '2025',
    category: 'Shots',
    client: 'Bloom Atelier',
    role: 'Brand identity · Motion · Web',
    summary:
      'An identity for a florist that behaves like a sketchbook — pink pencil, soft edges and room to breathe.',
    description: [
      'Bloom arranges flowers for restaurants and galleries, and wanted a brand that felt made by hand rather than designed by committee. We built the system around a single gesture: a pencil line that never quite closes.',
      'The mark, the type and the motion all come from that line. Stationery is printed on uncoated stock; the site lets the drawings breathe with long pauses between movements.',
      'The result is a brand that looks unfinished on purpose — because the work, the flowers, are always in progress.',
    ],
    cover: 'portfolio/shots.jpg',
    coverAlt: 'Pink pencil sketch of a pair of eyes',
    gallery: [
      { src: 'portfolio/space.jpg', alt: 'A black hole bending light into a bright ring' },
      { src: 'portfolio/notes.jpg', alt: 'A candlelit portrait in the manner of a classical oil painting' },
    ],
    tags: ['Identity', 'Motion', 'Web'],
    featured: true,
  },
  {
    slug: 'event-horizon',
    title: 'Event Horizon',
    year: '2024',
    category: 'Space',
    client: 'Nomad Gallery',
    role: 'Creative development · WebGL',
    summary:
      'An interactive installation about scale, where a visitor becomes a point of light falling into a black hole.',
    description: [
      'Nomad Gallery asked for a piece about scale for their autumn programme. We settled on the least human scale there is: the edge of a black hole.',
      'Visitors stand in front of a projection and move; the piece reads their silhouette and stretches it into a streak of light that spirals inward. The closer they stand, the slower time appears to move.',
      'Everything runs in the browser with a depth pass and a custom lensing shader. It has since travelled to two other galleries and a planetarium.',
    ],
    cover: 'portfolio/space.jpg',
    coverAlt: 'A black hole bending light into a bright ring',
    gallery: [
      { src: 'portfolio/thoughts.jpg', alt: 'A caped figure watching a rain-soaked city at night' },
      { src: 'portfolio/philosophy.jpg', alt: 'Baroque painting of a figure shielding their face' },
    ],
    tags: ['WebGL', 'Installation', 'Creative code'],
    featured: true,
  },
  {
    slug: 'fall',
    title: 'Fall',
    year: '2024',
    category: 'Philosophy',
    client: 'Personal',
    role: 'Photography · Direction',
    summary:
      'A series on falling — baroque bodies, borrowed light, and the moment before impact.',
    description: [
      'A personal series made across two winters, borrowing the language of baroque painting and the lighting of a single north-facing window.',
      'The photographs are not really about falling. They are about the half-second of not knowing yet — the pause that paintings have always known how to hold.',
      'Printed as a set of five archival pigment prints. Two remain available.',
    ],
    cover: 'portfolio/philosophy.jpg',
    coverAlt: 'Baroque painting of a figure shielding their face with an arm',
    gallery: [
      { src: 'portfolio/notes.jpg', alt: 'A candlelit portrait in the manner of a classical oil painting' },
      { src: 'portfolio/shots.jpg', alt: 'Pink pencil sketch of a pair of eyes' },
    ],
    tags: ['Photography', 'Print', 'Direction'],
    featured: false,
  },
];

const about = {
  heading: 'Quiet work, made to be looked at twice.',
  body: [
    "I'm Tirth — a visual designer and creative developer working where image, type and motion meet. My practice moves between art direction, identity and the web, always in service of a feeling rather than a trend.",
    'This site is part portfolio, part journal. The chapters in the hero are the things I keep returning to: light, philosophy, the city after dark, small observations, and the scale of everything. Commissions tend to grow out of the same curiosity — slowly, deliberately, and built to outlast the season.',
    'Before going independent I designed interfaces for studios in India and Europe. These days I work with a small circle of photographers, founders and cultural institutions who care about the details.',
  ],
  image: 'portfolio/notes.jpg',
  imageAlt: 'A candlelit portrait in the manner of a classical oil painting',
  stats: [
    { value: '6', label: 'Years of practice' },
    { value: '28', label: 'Projects shipped' },
    { value: '11', label: 'Countries' },
    { value: '∞', label: 'References saved' },
  ],
  capabilities: [
    'Art direction',
    'Web design',
    'Creative development',
    'Brand identity',
    'Motion & interaction',
    'Photography',
  ],
};

const process: ProcessStep[] = [
  {
    number: '01',
    title: 'Observe',
    body: 'It starts with listening and looking. Reference films, long walks, and questions about what the work should feel like before what it should say.',
  },
  {
    number: '02',
    title: 'Compose',
    body: 'Type tests, moodboards and rough layouts — always in the browser, never in a vacuum. We agree on the feeling early so the details have somewhere to land.',
  },
  {
    number: '03',
    title: 'Build',
    body: 'Design and code grow together. Custom motion, careful accessibility and performance budgets that keep the work quick on real devices.',
  },
  {
    number: '04',
    title: 'Refine',
    body: 'The last ten percent is the work: tightening rhythm, checking every breakpoint, and handing over a system you can keep using.',
  },
];

const contact = {
  heading: "Let's make something worth keeping.",
  note: 'Open to brand, editorial and digital projects for 2026. Tell me what you are making — I usually reply within two working days.',
  cta: 'Start a conversation',
};

/**
 * The Space chapter page (/space).
 *
 * Layout pairs each capture with its own text block, mirrored row by row
 * (image left → image right → …). To use your own captures, replace the
 * `image` value on each row with a hosted URL (https://…) or a file under
 * /public — the layout does not care where the bytes come from.
 * Alt text and captions live beside it and should be updated together.
 */
const PLACEHOLDER_IMAGE = '/images/space.jpg';

const spacePage: SpacePage = {
  eyebrow: '05 — Beyond',
  title: 'Space',
  standfirst: 'Where reality fades and imagination takes flight.',
  intro: [
    'Space is the chapter I keep returning to when the work needs to feel bigger than its frame. These frames were made over two years, mostly after dark, mostly waiting.',
    'Each pair below sets an image beside the thought it arrived with. Read them in order, or start with whichever one holds your eye.',
  ],
  rows: [
    {
      id: 'the-edge',
      eyebrow: '01 — Night sky',
      title: 'Where the stars come into focus',
      summary:
        'Some things in the night sky look like nothing more than distant points of light. But bring them closer, and curiosity takes over.',
      body: [
        'On October 24, 2026, I took my Nikon Coolpix P900 and pointed it toward the night sky. Using its powerful optical zoom, I began capturing individual points of light that were barely distinguishable to the naked eye.',
        'The process wasn’t as simple as pressing the shutter. I moved the camera, searched for the same points again, adjusted my framing, and captured multiple shots. Each image became another small piece of an astronomical puzzle.',
        'I then compared the approximate region I had photographed with a sky map, which showed the Orion and Taurus constellations, along with Uranus and the Taurid meteor-shower radiants.',
        'The brightest points brought several possibilities to mind — Rigel, Bellatrix, and other stars in Orion. Their exact identities remain unconfirmed, but the process of locating and investigating them was fascinating in itself.',
        'What began as an experiment with a camera turned into an exploration of the night sky — a reminder that even a tiny point of light can have an extraordinary story behind it.',
      ],
      image: '/images/space-first-frame.jpg',
      imageAlt: 'A few faint stars scattered across a dark night sky',
      caption: 'Night sky — October 24, 2026',
      meta: [
        { label: 'Capture', value: 'Nikon Coolpix P900, October 2026' },
        { label: 'Process', value: 'Night Landscape mode · Approx. 50× optical zoom · Multiple exposures · Sky-map comparison' },
      ],
    },
    {
      id: 'orbit',
      eyebrow: '02 — Orbit',
      title: 'Weight without gravity',
      summary:
        'Orbital mechanics is mostly patience: things fall toward each other for years and call it a circle.',
      body: [
        'The night sky rewards waiting. You set the camera, open the shutter, and then you stand in the cold doing nothing for twenty minutes while the earth turns under the frame.',
        'I wanted the type on this page to behave the same way — held at a distance, never quite touching the image, always circling it. The gap between the columns is the point; it is where the looking happens.',
        'The moon in this frame moved four pixels during the exposure. You cannot see it, but the whole image is leaning that way.',
      ],
      image: '/images/space.jpg',
      imageAlt: 'A pale moon suspended in a dark field of stars',
      caption: 'A body in orbit — study 02',
      meta: [
        { label: 'Capture', value: 'Night sky, 2025' },
        { label: 'Process', value: 'Long exposure' },
      ],
    },
    {
      id: 'distance',
      eyebrow: '03 — Distance',
      title: 'Light that left before us',
      summary:
        'Every image of space is a letter written a long time ago, arriving after the thing that wrote it may be gone.',
      body: [
        'That delay is the feeling I chase. Not nostalgia exactly — more the awareness of standing at the end of a very long line, holding something that left before you existed.',
        'For this plate I worked from a scan of an old contact sheet and let the grain stay. Cleaning it up made the image feel contemporary, which was exactly the wrong direction.',
        'The colours are not accurate. They are what the dust looked like after three passes of grading in a dark room, which is the only kind of accurate that matters here.',
      ],
      image: '/images/space.jpg',
      imageAlt: 'A nebula of pale dust and stars across a wide night sky',
      caption: 'Light years — contact sheet',
      meta: [
        { label: 'Capture', value: 'Archive, 2024' },
        { label: 'Process', value: 'Scan and grade' },
      ],
    },
    {
      id: 'return',
      eyebrow: '04 — Return',
      title: 'The way back in',
      summary:
        'After enough time looking outward, the ordinary comes back strange — a window, a lamp, the edge of a roof.',
      body: [
        'The last frame is the landing. Same curiosity, pointed at something you could reach out and touch: a lit window, a rooftop edge, the sky doing very little.',
        'It was made on 35mm, pushed two stops, because the light was worse than the meter wanted to admit. The grain is doing most of the atmosphere.',
        'I keep it last because the chapter should not end in deep space. It should end with you back on the ground, looking up.',
      ],
      image: '/images/space.jpg',
      imageAlt: 'A rooftop edge and lit window against a deep night sky',
      caption: 'Re-entry — first frame',
      meta: [
        { label: 'Capture', value: 'Rooftop, 2026' },
        { label: 'Process', value: '35mm, pushed' },
      ],
    },
  ],
};

export function getSpacePage(): SpacePage {
  return spacePage;
}

export function getPortfolio(): PortfolioContent {
  return { profile, slides, projects, about, process, contact };
}

export function getProfile() {
  return profile;
}

export function getSlides(): HeroSlide[] {
  return slides;
}

export function getCategories(): string[] {
  return Array.from(new Set(projects.map((project) => project.category)));
}

export function getProjects(category?: string | null): Project[] {
  if (!category || category.toLowerCase() === 'all') return projects;
  return projects.filter(
    (project) => project.category.toLowerCase() === category.toLowerCase(),
  );
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { next: undefined, previous: undefined };
  return {
    next: projects[(index + 1) % projects.length],
    previous: projects[(index - 1 + projects.length) % projects.length],
  };
}
