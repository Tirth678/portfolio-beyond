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
  email: 'tirthp244@proton.me',
  intro:
    'I design and build visual experiences for people who care about the details — art direction, identity and the web.',
  socials: [
    { label: 'Substack', href: 'https://substack.com/@tirth819319' },
    { label: 'X', href: 'https://x.com/TirthPandy57784' },
    { label: 'YouTube', href: 'https://www.youtube.com/@-Fuzion' },
    { label: 'LinkedIn — coming soon' },
    { label: 'GitHub', href: 'https://github.com/tirthpandya' },
    { label: 'Email', href: 'mailto:tirthp244@proton.me' },
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
    image: '/images/shots-hero.jpg',
    alt: 'A Gothic cathedral rising into a misty sky',
  },
  {
    id: 'space',
    eyebrow: '05 — Beyond',
    title: 'Eternity',
    description: 'Where reality fades and imagination takes flight.',
    image: '/images/eternity-sombrero.webp',
    alt: 'The Sombrero Galaxy glowing against a star-filled sky',
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
    category: 'Eternity',
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
    "I'm Tirth — a developer, builder and creative technologist working at the intersection of software, design and emerging technology. My work moves between engineering digital experiences, exploring artificial intelligence and building products from the ground up. I'm drawn to the space where technical precision meets creative possibility, where an idea becomes something people can actually interact with.",
    "This site is a collection of things I've built, explored and questioned along the way. From the web and open-source software to machine learning, neural networks and experimental projects, each piece reflects a curiosity for understanding how things work — and imagining how they could work better. I believe in building with intention, staying curious and creating things that have a reason to exist beyond simply being made.",
    "Alongside my independent work, I lead web development at CODE CLUB, GSFCU, and work on products and experiments through FlinT. My journey spans full-stack engineering, AI research, technical leadership and the occasional rabbit hole that turns into a project. I'm interested in collaborating with people who think deeply, build ambitiously and aren't afraid to explore what hasn't been done yet.",
  ],
  image: '/images/philosophy-portrait.jpg',
  imageAlt: 'Portrait of Mike Ross, a fictional character from Suits',
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
  title: 'Eternity',
  standfirst: 'Where reality fades and imagination takes flight.',
  intro: [
    'Eternity is the chapter I keep returning to when the work needs to feel bigger than its frame. These frames were made over two years, mostly after dark, mostly waiting.',
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
        'On October 24, 2026, I began capturing individual points of light that were barely distinguishable to the naked eye.',
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
      title: 'A world beyond the stars',
      summary:
        'Saturn doesn’t announce itself. From Earth, it can look like just another point of light, quietly shining among thousands of stars. But that little point is a world of its own, surrounded by rings made of ice, rock, and dust.',
      body: [
        'I found it while exploring the night sky. One bright object caught my attention, and I began narrowing down its position. What initially looked like an ordinary star turned out to be Saturn — a planet nearly 1.3 billion kilometres away.',
        'I used the sky-map application to cross-check its position. At 83× optical zoom, I could bring that distant world into the frame, transforming a tiny point of light into something I could actually observe.',
        'There is something extraordinary about realizing that the light reaching your camera began its journey across space long before you decided to look up. I wasn’t just photographing a bright object in the sky. I was observing another planet in our Solar System.',
        'For a moment, the distance between us felt a little less impossible.',
      ],
      image: '/images/space.jpg',
      imageAlt: 'Video of Saturn in the night sky',
      video: 'https://www.dropbox.com/scl/fi/skmo02qm4v9vpnwe3n77n/DSCN2170.mp4?rlkey=e1y1twmnlsi8g86ngr207iiz6&raw=1',
      caption: 'Saturn — September 2026',
      meta: [
        { label: 'Capture', value: 'Night sky, September 2026' },
        { label: 'Equipment', value: 'Nikon Coolpix P900' },
        { label: 'Process', value: 'Sky-map identification · 83× optical zoom · Digital capture' },
      ],
    },
    {
      id: 'distance',
      eyebrow: '03 — The blue giant',
      title: 'A world at the edge of darkness',
      summary:
        'Neptune is not a planet you simply stumble upon. Nearly 4.5 billion kilometres from the Sun, it is so distant and faint that finding it requires patience, the right conditions, and a little curiosity.',
      body: [
        'After locating Saturn, I continued exploring the night sky. While navigating the region around Pisces and Aquarius, I came across another faint object. Unlike Saturn, it wasn’t immediately visible to the naked eye. It was barely distinguishable, even through the camera.',
        'I used a sky-map application to narrow down its position. At 83× optical zoom, I managed to capture a faint point of light.',
        'Further investigation suggested that the object could be Neptune, the eighth planet of our Solar System. On September 24, 2026, Neptune was around magnitude 7.7, making it far too faint for ordinary naked-eye observation.',
        'What fascinated me most was the realization that this tiny point of light could belong to a planet billions of kilometres away. Unlike Saturn, its rings aren’t visible through my camera. At that distance, even an entire planet can appear as little more than a speck of light.',
        'Sometimes discovery isn’t about seeing more. It’s about learning what you’re looking at.',
      ],
      image: '/images/space.jpg',
      imageAlt: 'Video of a faint point of light in the night sky, possibly Neptune',
      video: 'https://www.dropbox.com/scl/fi/ixxeb87oada6gxd4n9kf7/DSCN2172.mp4?rlkey=efy76sdix8j5wgb66tsx700ao&raw=1',
      caption: 'Night sky — September 24, 2026',
      meta: [
        { label: 'Capture', value: 'Night sky, September 24, 2026' },
        { label: 'Equipment', value: 'Nikon Coolpix P900' },
        { label: 'Process', value: 'Sky-map identification · 83× optical zoom · Still-image capture' },
      ],
    },
    {
      id: 'return',
      eyebrow: '04 — Two worlds, one frame',
      title: 'An unexpected celestial pairing',
      summary:
        'Sometimes, the most beautiful discoveries are the ones you never planned to make.',
      body: [
        'While exploring the region of the sky where I had earlier located Neptune, I stumbled upon two distinct points of light. One appeared brighter, with a warm golden glow, while the other was significantly fainter, almost disappearing into the darkness.',
        'Capturing them was no easy task. They were so faint that I could barely keep the brighter object visible in the video. Fortunately, I managed to capture a still photograph showing both objects together.',
        'My best-case interpretation is that I may have captured Neptune alongside a nearby star, potentially the star HIP 968, which was remarkably close to Neptune in the sky that night.',
        'Although their identities cannot be conclusively established from the photograph, the possibility makes this frame particularly special.',
        'An accidental encounter, two distant points of light, and a photograph that turned into another astronomical mystery.',
      ],
      image: '/images/space-fourth-frame.jpg',
      imageAlt: 'Two distant points of light against a dark night sky',
      caption: 'Two points of light — September 24, 2026',
      meta: [
        { label: 'Capture', value: 'September 24, 2026 · Night sky' },
        { label: 'Observation', value: 'Possible Neptune–HIP 968 pairing' },
        { label: 'Process', value: '83× optical zoom · Still-image capture' },
      ],
    },
    {
      id: 'fifth-frame',
      eyebrow: '05 — The blue supergiant',
      title: 'A beacon in Orion',
      summary: 'Some stars are so enormous and luminous that even from hundreds of light-years away, they shine brilliantly in our night sky.',
      body: [
        'While exploring the constellation Orion, I came across Rigel, one of the brightest stars visible from Earth. Located approximately 860 light-years away, Rigel is a blue supergiant and one of the most prominent stars in the constellation.',
        'What makes Rigel fascinating is its sheer scale. It is far more massive and luminous than our Sun, radiating an extraordinary amount of energy across space.',
        'Unlike my earlier planetary observations, this was an opportunity to explore a distant star — a stellar giant whose light had been travelling through space for centuries before reaching my camera.',
        'Finding Rigel also gave me another reason to appreciate Orion, a constellation that has fascinated skywatchers for generations.',
        'Sometimes, the most extraordinary objects in the universe aren’t planets at all. They’re stars, burning across unimaginable distances.',
      ],
      image: '/images/space-fifth-frame.jpg',
      imageAlt: 'A bright point of light against a dark sky',
      caption: 'Rigel — Orion constellation',
      meta: [
        { label: 'Capture', value: 'Night sky · Orion constellation' },
        { label: 'Observation', value: 'Rigel (Beta Orionis) · Blue supergiant' },
        { label: 'Process', value: '83× optical zoom · Astronomical identification · Still-image capture' },
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
