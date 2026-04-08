window.PORTFOLIO_DATA = {
  skills: [
    {
      category: "Languages",
      summary: "Core programming languages used across product work, coursework, and engineering projects.",
      items: [
        {
          name: "Python",
          detail: "Automation, data work, and backend scripting.",
          icon: "https://cdn.simpleicons.org/python/3776AB",
        },
        {
          name: "C++",
          detail: "Embedded systems and performance-sensitive engineering work.",
          icon: "https://cdn.simpleicons.org/cplusplus/00599C",
        },
        {
          name: "TypeScript",
          detail: "Primary language for modern web apps and services.",
          icon: "https://cdn.simpleicons.org/typescript/3178C6",
        },
        {
          name: "JavaScript",
          detail: "Browser logic and full-stack product prototyping.",
          icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
        },
        {
          name: "HTML5",
          detail: "Semantic structure and accessible UI foundations.",
          icon: "https://cdn.simpleicons.org/html5/E34F26",
        },
        {
          name: "CSS3",
          detail: "Responsive layouts, theming, and interface polish.",
          icon: "https://cdn.simpleicons.org/css/1572B6",
        },
        {
          name: "SQL",
          detail: "Relational queries, schema design, and data workflows.",
          icon: "./assets/icons/sql-icon.png",
          iconScale: 1.18,
        },
        {
          name: "Bash",
          detail: "CLI workflows, scripts, and local tooling.",
          icon: "https://cdn.simpleicons.org/gnubash/4EAA25",
        },
      ],
    },
    {
      category: "Frameworks & Libraries",
      summary: "Frontend, backend, and data libraries used for production-style applications.",
      items: [
        {
          name: "React",
          detail: "Component-driven UI development with reusable patterns.",
          icon: "https://cdn.simpleicons.org/react/61DAFB",
        },
        {
          name: "Next.js",
          detail: "Full-stack React applications with robust routing and rendering options.",
          icon: "https://cdn.simpleicons.org/nextdotjs/111111",
        },
        {
          name: "Tailwind CSS",
          detail: "Utility-driven styling for rapid, consistent UI development.",
          icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
        },
        {
          name: "Node.js",
          detail: "Backend services, tooling, and server-side JavaScript.",
          icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
        },
        {
          name: "Hono",
          detail: "Lean TypeScript routing for lightweight APIs and services.",
          icon: "https://cdn.simpleicons.org/hono/E36002",
        },
        {
          name: "Fastify",
          detail: "High-performance Node.js APIs and backend services.",
          icon: "https://cdn.simpleicons.org/fastify/111111",
        },
        {
          name: "Flask",
          detail: "Python web backends and service endpoints.",
          icon: "https://cdn.simpleicons.org/flask/111111",
        },
        {
          name: "FastAPI",
          detail: "Typed Python APIs and service development.",
          icon: "https://cdn.simpleicons.org/fastapi/009688",
        },
        {
          name: "Pydantic",
          detail: "Data validation and typed model handling in Python services.",
          icon: "https://cdn.simpleicons.org/pydantic/E92063",
        },
        {
          name: "NumPy",
          detail: "Numerical computing and array-based workflows.",
          icon: "https://cdn.simpleicons.org/numpy/013243",
        },
        {
          name: "Pandas",
          detail: "Data wrangling, analysis, and tabular processing.",
          icon: "https://cdn.simpleicons.org/pandas/150458",
        },
        {
          name: "Prisma",
          detail: "Type-safe database access and schema modeling.",
          icon: "https://cdn.simpleicons.org/prisma/2D3748",
        },
      ],
    },
    {
      category: "Tools",
      summary: "Core engineering tools, infrastructure, and platforms used in daily development workflows.",
      items: [
        {
          name: "Git",
          detail: "Version control and branching workflows.",
          icon: "https://cdn.simpleicons.org/git/F05032",
        },
        {
          name: "GitHub",
          detail: "Repository hosting, pull requests, and collaboration.",
          icon: "https://cdn.simpleicons.org/github/181717",
        },
        {
          name: "GitHub Actions",
          detail: "Automated CI workflows and deployment tasks.",
          icon: "https://cdn.simpleicons.org/githubactions/2088FF",
        },
        {
          name: "Docker",
          detail: "Consistent runtime environments and reproducible setup.",
          icon: "https://cdn.simpleicons.org/docker/2496ED",
        },
        {
          name: "PostgreSQL",
          detail: "Relational database design and query optimization.",
          icon: "https://cdn.simpleicons.org/postgresql/4169E1",
        },
        {
          name: "Supabase",
          detail: "Backend services, auth, and database integration.",
          icon: "https://cdn.simpleicons.org/supabase/3ECF8E",
        },
        {
          name: "Playwright",
          detail: "End-to-end testing and reliability checks.",
          icon: "./assets/icons/playwright-icon.png",
          iconScale: 1.18,
        },
        {
          name: "Pytest",
          detail: "Python test suites and developer tooling.",
          icon: "https://cdn.simpleicons.org/pytest/0A9EDC",
        },
        {
          name: "Vite",
          detail: "Fast frontend development server and build tooling.",
          icon: "https://cdn.simpleicons.org/vite/646CFF",
        },
        {
          name: "Notion",
          detail: "Planning, documentation, and personal workflow organization.",
          icon: "https://cdn.simpleicons.org/notion/111111",
        },
        {
          name: "Canva",
          detail: "Lightweight visual design and presentation assets.",
          icon: "./assets/icons/canva-icon.png",
          iconScale: 1.32,
        },
        {
          name: "Excel",
          detail: "Spreadsheets, analysis, and structured data organization.",
          icon: "./assets/icons/excel-icon.png",
        },
      ],
    },
    {
      category: "Other",
      summary: "Cross-functional technical concepts and practices that shape how I build software.",
      items: [
        {
          name: "REST APIs",
          detail: "Designing and integrating clear service boundaries and endpoints.",
        },
        {
          name: "WCAG",
          detail: "Accessibility-aware design and implementation standards.",
        },
        {
          name: "ARIA",
          detail: "Semantic accessibility patterns for interactive interfaces.",
        },
        {
          name: "CI/CD",
          detail: "Automated build, validation, and delivery workflows.",
        },
        {
          name: "LLMs",
          detail: "Building with and around large language model workflows.",
        },
      ],
    },
  ],

  projects: [
    {
      slug: "waterlooworks-plus",
      title: "WaterlooWorks+",
      projectGroup: "personal",
      category: "Web",
      status: "Concept + Development",
      summary:
        "Local-first Chrome extension that adds resume-aware ranking, job analysis, and lightweight application tracking on top of WaterlooWorks without sending student data to a backend.",
      impact:
        "Built a WaterlooWorks-specific decision layer that helps students prioritize postings faster, inspect role fit more clearly, and keep private job-search data inside the browser.",
      stack: [
        "JavaScript",
        "HTML5",
        "CSS3",
        "Chrome Extensions",
        "Manifest V3",
        "Chrome Storage API",
      ],
      palette: { a: "#7b6e56", b: "#4f5358" },
      icon: "./assets/icons/logo.png",
      approach: [
        "Built page-specific content scripts for listings, postings, ratings, and application flows so the extension enhances WaterlooWorks directly in context.",
        "Implemented local resume parsing, posting analysis, and scoring logic to surface fit signals without relying on a hosted backend or external analytics.",
        "Designed the extension around privacy-first local storage, keeping profiles, settings, cached analysis, and tracking data inside chrome.storage.local.",
      ],
      outcomes: [
        "Turned WaterlooWorks into a more decision-friendly workflow with ranking, structured analysis, and local tracking in one layer.",
        "Established a maintainable extension architecture with content scripts, popup controls, a full-page app surface, and a constrained background service worker.",
        "Kept the product tightly scoped to WaterlooWorks domains and local-only processing, which is one of the project’s main differentiators.",
      ],
    },
    {
      slug: "clarus",
      title: "Clarus",
      projectGroup: "personal",
      category: "Web",
      status: "In Active Development",
      summary:
        "Full-stack academic productivity app that connects to D2L/Brightspace, syncs course and timeline data, and turns scattered LMS information into a clearer planning workspace.",
      impact:
        "Contributed across backend integration, auth and session flows, planning logic, and post-hackathon product polish to move the project from demo-stage idea toward a usable MVP.",
      stack: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "Fastify",
        "Prisma",
        "PostgreSQL",
        "Playwright",
        "Docker",
      ],
      palette: { a: "#6b7d92", b: "#40576c" },
      icon: "./assets/icons/icon.svg",
      approach: [
        "Integrated a Playwright-based Brightspace connector that handles login, session capture, and course/timeline sync without relying on a browser extension model.",
        "Worked on planning and workload flows that help students move from raw LMS data toward clearer next actions and priorities.",
        "Refined login, landing, and dashboard experiences so the product feels more like a focused academic tool and less like a hackathon prototype.",
      ],
      outcomes: [
        "Helped turn the original hackathon concept into a more structured full-stack product with cleaner sync, planning, and usability foundations.",
        "Established a practical architecture split between frontend, public API, and connector service for future iteration.",
        "Positioned the product around real student workflow pain points: LMS friction, fragmented information, and unclear prioritization.",
      ],
    },
    {
      slug: "pantry-pal",
      title: "Pantry Pal",
      projectGroup: "personal",
      category: "Web",
      status: "Shipped",
      summary:
        "AI-assisted meal planning app that helps users cook with what they already have, reduce food waste, and move from pantry ingredients to recipes, meal plans, and shopping lists.",
      impact:
        "Built a practical pantry-to-recipe workflow with AI ingredient scanning, recipe matching, meal planning, and grocery support, and won 1st place at the FIDE x Lovable Hackathon.",
      stack: [
        "TypeScript",
        "React",
        "Tailwind CSS",
        "Vite",
        "Supabase",
        "Edamam API",
        "Google Places API",
        "React DnD",
      ],
      palette: { a: "#567f75", b: "#395b65" },
      icon: "./assets/icons/carrot.png",
      iconFit: "contain",
      iconScale: 0.82,
      demoUrl: "https://yourpantrypal.lovable.app/",
      media: {
        type: "video",
        src: "./assets/videos/pantrypal-video.mov",
        fallbackLabel: "Open video in new tab",
      },
      approach: [
        "Built an image-to-ingredient pipeline through Supabase Edge Functions, using a vision-capable model to extract generic ingredient names and normalize them for recipe search.",
        "Improved recipe discovery by detecting likely protein ingredients first, running parallel Edamam searches, and ranking results by ingredient match quality.",
        "Connected recipe discovery to a drag-and-drop meal planner, categorized shopping list generation, PDF export, and nearby grocery store search.",
      ],
      outcomes: [
        "Delivered a complete end-to-end flow from pantry input to recipe discovery, meal planning, and shopping support.",
        "Made the product more useful for everyday decision-making by separating recipes into Ready to Cook and Almost There states.",
        "Kept external credentials off the client by routing API orchestration through edge functions instead of exposing keys in the frontend.",
      ],
    },
    {
      slug: "pathfinding-api",
      title: "Pathfinding API",
      projectGroup: "personal",
      category: "Backend",
      status: "Shipped",
      summary:
        "Backend-only FastAPI service for grid-based pathfinding and route analysis, with BFS, Dijkstra, and A* implemented from scratch and exposed through a validated API.",
      impact:
        "Combined algorithms work with clean backend design by separating routes, services, schemas, map generation, and benchmarking into a structure that feels like a real service instead of a demo script.",
      stack: ["Python", "FastAPI", "Pydantic", "NumPy", "Pandas", "Uvicorn", "Pytest"],
      palette: { a: "#64806e", b: "#3a4f63" },
      icon: "./assets/icons/pathfinding-api.svg",
      iconFit: "contain",
      iconScale: 0.98,
      approach: [
        "Implemented BFS, Dijkstra, and A* manually on NumPy-backed grids, with deterministic traversal behavior and clear separation from the HTTP layer.",
        "Added seeded random map generation and predefined sample maps so algorithm behavior can be reproduced instead of tested on one-off inputs.",
        "Built a Pandas-based benchmarking flow that compares algorithms across multiple maps and repeated runs, then exports raw results to CSV with summary highlights.",
      ],
      outcomes: [
        "Delivered an API that returns the path plus cost, length, visited-node count, and runtime metrics for every request.",
        "Turned the project into both a solver and an analysis tool by pairing pathfinding endpoints with reproducible benchmark reporting.",
        "Backed the service with strong automated coverage across algorithms, validation, services, and API behavior.",
      ],
    },
    {
      slug: "queueme",
      title: "QueueMe",
      projectGroup: "personal",
      category: "Backend",
      status: "Building",
      summary:
        "Cross-platform virtual queue app that lets businesses create live queues and lets customers join, track, and manage their place remotely instead of waiting in a physical line.",
      impact:
        "Contributed backend integration work that helped evolve the original hackathon idea into a more complete realtime product with auth, persistence, and role-based queue management.",
      stack: [
        "TypeScript",
        "React Native",
        "Expo",
        "Supabase",
        "PostgreSQL",
        "Supabase Auth",
        "Supabase Realtime",
      ],
      palette: { a: "#6f856d", b: "#6a5e4e" },
      icon: "./assets/icons/QueueMe.png",
      iconFit: "contain",
      approach: [
        "Built around a role-based model where customers and businesses see different queue actions, account states, and app flows.",
        "Used Supabase for auth, persistent storage, and realtime sync so queue status updates propagate across devices without custom infrastructure.",
        "Handled product constraints around duplicate joins, wait-time estimates, queue lifecycle states, and one-active-queue business workflows.",
      ],
      outcomes: [
        "Extended the original JAMHacks concept into a more production-shaped mobile-first app with persistent profiles, searchable queues, and realtime state.",
        "Created a clearer business/customer experience for remote queue participation, queue hosting, and queue management.",
        "Established backend and data-flow patterns that support future improvements like notifications and better queue analytics.",
      ],
    },
    {
      slug: "escapade",
      title: "Escapade",
      projectGroup: "personal",
      category: "Game",
      status: "Archived Build",
      summary:
        "Retro Windows console adventure game built in C++ that combines bitmap-driven map rendering, ASCII-style exploration, turn-based battles, inventory management, and FMOD-powered audio.",
      impact:
        "Built a surprisingly complete school-era RPG loop with exploration, combat, town/shop systems, sound design, and a packaged runnable build that still works as a playable archive.",
      stack: ["C++", "Win32 API", "Bitmap Rendering", "FMOD", "Visual Studio"],
      palette: { a: "#7b6a52", b: "#252f3f" },
      icon: "./assets/icons/escapade.svg",
      iconFit: "contain",
      iconScale: 1.02,
      approach: [
        "Used a 100x100 bitmap image as the source of truth for world layout, translating pixel colors into terrain, collision rules, and console rendering behavior.",
        "Built the core gameplay loop around roaming monsters, turn-based combat, consumables, weapon upgrades, and a safe-town economy with shop and hotel systems.",
        "Layered in colored console rendering, immediate keyboard input, and FMOD sound playback so the project feels closer to a small game than a basic text demo.",
      ],
      outcomes: [
        "Delivered a complete playable loop with map exploration, combat progression, economy mechanics, and multiple monster tiers.",
        "Preserved both the original Visual Studio source and a packaged runnable build so the project is still easy to inspect and run.",
        "Showcases early systems thinking across gameplay logic, rendering, assets, and audio integration.",
      ],
    },
    {
      slug: "uw-assignment-planner",
      title: "Assignment Planner",
      projectGroup: "work",
      category: "Backend",
      status: "Internal Project",
      summary:
        "University of Waterloo student support web app that turns a start date, due date, and assignment type into a structured academic work plan backed by curated templates and Waterloo resources.",
      impact:
        "Rebuilt the planner as a lightweight server-rendered TypeScript application, strengthened accessibility and responsive behavior, and maintained a student-facing tool used in the Waterloo Libraries ecosystem.",
      stack: [
        "TypeScript",
        "JavaScript",
        "HTML5",
        "CSS3",
        "Node.js",
        "Hono",
        "Docker",
        "GitHub Actions",
      ],
      palette: { a: "#6a857f", b: "#4d5f69" },
      icon: "./assets/icons/uw-libraries.png",
      approach: [
        "Built the app around assignment-specific templates and deterministic planning logic instead of generic task management or AI-generated output.",
        "Exposed lightweight API endpoints for step retrieval and plan generation while keeping the main experience server-rendered and easy to maintain.",
        "Improved accessibility and UX with better heading structure, consent-managed analytics, modal focus behavior, and a responsive navigation fallback at narrower widths.",
      ],
      outcomes: [
        "Delivered a focused planning tool that helps students break common assignment types into manageable steps across a real date range.",
        "Improved maintainability by keeping the architecture lightweight, testable, and decoupled from unnecessary SPA complexity.",
        "Fit the product into an institutional deployment workflow using GitHub Actions, GHCR, and Docker-based environment promotion.",
      ],
    },
    {
      slug: "food-printer",
      title: "3D Food Printer",
      projectGroup: "work",
      category: "Research",
      status: "Research + Hardware",
      summary:
        "Open-source research project focused on converting a Creality Ender 3 Pro into a multi-material peristaltic-pump food printer during my high school co-op with Western University's FAST Research Group.",
      impact:
        "Supported the mechanical build by researching, designing, printing, and assembling custom hardware that helped turn a low-cost FDM printer into a functional food-printing platform.",
      stack: ["Fusion 360", "Cura", "PrusaSlicer", "3D Printing", "Mechanical Design", "Hardware Prototyping"],
      palette: { a: "#8a7753", b: "#4f5f52" },
      icon: "./assets/icons/fast-research-group.png",
      iconScale: 0.88,
      approach: [
        "Designed and iterated custom CAD parts including a four-syringe holder, material cup holder, and heat-lamp mount for the modified printer assembly.",
        "Used Fusion 360 for modeling and Cura/PrusaSlicer for print preparation, adjusting parts around fit, rigidity, mounting constraints, and printability.",
        "Helped assemble the broader system by integrating printed components with motors, wiring, the heated build surface, and the lamp setup used to support food preparation.",
      ],
      outcomes: [
        "Contributed to a working multi-material research platform built on top of an inexpensive consumer printer.",
        "Translated research ideas into manufacturable hardware through iterative CAD and fabrication work.",
        "Gained hands-on experience working across design, prototyping, assembly, and interdisciplinary research execution.",
      ],
    },
  ],

  experience: [
    {
      id: "uw-libraries",
      role: "Software Developer",
      organization: "University of Waterloo Libraries",
      period: "Jan 2026 - Present",
      location: "Waterloo, Ontario",
      logo: "./assets/icons/uw-libraries.png",
      highlights: [
        "Rebuilt a legacy Drupal 8 Assignment Planner into a standalone TypeScript, HTML, CSS, and Hono app supporting ~3,000 daily active users (GA4).",
        "Re-architected CMS-coupled logic into an independent application, reducing upgrade-related breakage and improving maintainability.",
        "Applied WCAG/ARIA accessibility standards and used Docker + Git/GitHub for consistent development workflows.",
      ],
      fieldNotes: [
        "Worked in a production context where maintainability and reliability were equally important to feature delivery.",
        "Prioritized incremental migration to minimize operational risk while modernizing core functionality.",
      ],
    },
    {
      id: "uw-formula-electric",
      role: "Firmware Developer",
      organization: "UW Formula Electric",
      period: "Sep 2025 - Dec 2025",
      location: "Waterloo, Ontario",
      logo: "./assets/icons/uw-formula-electric.png",
      highlights: [
        "Developed embedded C/C++ firmware for ECUs handling vehicle communication via CAN/LIN and multiple sensor interfaces.",
        "Implemented HIL testing, signal simulation, and diagnostics, reducing per-board validation time by 35%.",
        "Collaborated with electrical and controls teams to debug hardware and improve real-time signal timing.",
      ],
      fieldNotes: [
        "Balanced fast iteration with reliability constraints for race-system hardware.",
        "Used diagnostics and simulation to de-risk hardware integration milestones.",
      ],
    },
    {
      id: "fast-research",
      role: "Engineering Research Assistant",
      organization: "FAST Research Group, Western University",
      period: "Feb 2024 - Jun 2024",
      location: "London, Ontario",
      logo: "./assets/icons/fast-research-group.png",
      highlights: [
        "Designed 15+ CAD components in Fusion 360 and produced 10+ FDM prints with Cura for a multi-material 3D food printer.",
        "Performed testing, calibration, and iterative refinements, improving print consistency by 25%.",
        "Conducted experimental data collection and analysis across crop and photovoltaic performance conditions.",
      ],
      fieldNotes: [
        "Combined experimental rigor with practical prototyping constraints in a cross-disciplinary research setting.",
      ],
    },
    {
      id: "city-of-london-skating",
      role: "Skating Instructor",
      organization: "City of London",
      period: "Sep 2023 - Apr 2024",
      location: "London, Ontario",
      logo: "./assets/icons/city-of-london.png",
      highlights: [
        "Delivered one-on-one and group skating instruction to beginner youth skaters across mixed skill levels, improving confidence, balance, and foundational technique.",
        "Adjusted drills and coaching cues in real time to match skater progression and keep lessons inclusive, structured, and engaging.",
        "Maintained a safety-first rink environment by enforcing protocols, monitoring risk, and providing clear corrective feedback to skaters and guardians.",
      ],
      fieldNotes: [
        "Strengthened coaching communication and situational judgment in fast-paced public recreation settings.",
      ],
    },
    {
      id: "storybook-gardens",
      role: "Operations Team Member",
      headingOnlyOrganization: true,
      organization: "Storybook Gardens",
      period: "Nov 2023 - Aug 2025",
      location: "London, Ontario",
      logo: "./assets/icons/Storybook-gardens-icon.png",
      positions: [
        {
          title: "Skate Cruiser",
          period: "Nov 2023 - Mar 2025",
          highlights: [
            "Managed skate rentals and monitored trail conditions throughout operating hours to maintain safe flow and reduce service delays during peak periods.",
            "Enforced rink and trail safety rules, performed proactive floor scans, and provided first-aid response support when incidents occurred.",
          ],
        },
        {
          title: "Attractions Staff",
          period: "Apr 2024 - Aug 2025",
          highlights: [
            "Operated amusement rides and supervised assigned attractions using standardized safety checks and operating procedures before and during guest use.",
            "Maintained guest-facing facilities and coordinated with team members to resolve site issues quickly, supporting a clean, safe, and positive visitor experience.",
          ],
        },
      ],
      fieldNotes: [
        "Built frontline operations discipline across safety, customer service, and incident response in high-volume environments.",
      ],
    },
  ],
};
