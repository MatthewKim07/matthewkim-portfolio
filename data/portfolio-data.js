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
          name: "SQL",
          detail: "Relational queries, schema design, and data workflows.",
        },
        {
          name: "C++",
          detail: "Embedded systems and performance-sensitive engineering work.",
          icon: "https://cdn.simpleicons.org/cplusplus/00599C",
        },
        {
          name: "Bash",
          detail: "CLI workflows, scripts, and local tooling.",
          icon: "https://cdn.simpleicons.org/gnubash/4EAA25",
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
        {
          name: "Tailwind CSS",
          detail: "Utility-driven styling for rapid, consistent UI development.",
          icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
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
          name: "Docker",
          detail: "Consistent runtime environments and reproducible setup.",
          icon: "https://cdn.simpleicons.org/docker/2496ED",
        },
        {
          name: "GitHub Actions",
          detail: "Automated CI workflows and deployment tasks.",
          icon: "https://cdn.simpleicons.org/githubactions/2088FF",
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
          icon: "https://cdn.simpleicons.org/playwright/2EAD33",
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
          icon: "https://cdn.simpleicons.org/canva/00C4CC",
        },
        {
          name: "Excel",
          detail: "Spreadsheets, analysis, and structured data organization.",
          icon: "https://cdn.simpleicons.org/microsoftexcel/217346",
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
      slug: "pantry-pal",
      title: "Pantry Pal",
      category: "Web",
      status: "Shipped",
      summary:
        "PantryPal scans pantry photos, identifies ingredients, and recommends recipes by ingredient match percentage while also supporting meal planning and shopping lists.",
      impact:
        "Implemented AI ingredient scanning, improved ingredient-to-recipe matching behavior, and shipped UI/UX refinements.",
      stack: ["TypeScript", "React", "Vite", "Tailwind CSS", "Supabase", "Edamam API"],
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
        "Designed an image-to-ingredient pipeline that converts pantry photos into structured ingredient data.",
        "Connected ingredient confidence scoring to recipe ranking logic to improve suggestion quality.",
        "Refined interaction flow for meal planning and shopping list continuity.",
      ],
      outcomes: [
        "Delivered a functional end-to-end demo with AI-driven ingredient extraction.",
        "Improved user trust by making recipe relevance behavior more transparent.",
        "Shipped cleaner interface details for faster task completion.",
      ],
    },
    {
      slug: "queueme",
      title: "QueueMe",
      category: "Backend",
      status: "Building",
      summary:
        "Virtual queue management platform where companies create queues and customers join remotely to reduce physical lineups and wait friction.",
      impact:
        "Focused on backend integration, connecting frontend and backend services, and enabling synced queue interactions across multiple devices.",
      stack: ["TypeScript", "Python", "React", "Flask", "REST APIs", "Supabase"],
      palette: { a: "#6f856d", b: "#6a5e4e" },
      icon: "./assets/icons/QueueMe.png",
      iconFit: "contain",
      approach: [
        "Defined service contracts for queue creation, join, status updates, and notification behavior.",
        "Integrated frontend queue views with backend queue state to support live synchronization.",
        "Validated edge cases around concurrent joins and update consistency.",
      ],
      outcomes: [
        "Established core API and data flow patterns for multi-device queue participation.",
        "Reduced integration friction by clarifying interface boundaries between frontend and backend.",
      ],
    },
    {
      slug: "clarus",
      title: "Clarus",
      category: "Web",
      status: "In Active Development",
      summary:
        "AI-powered academic optimization tool that extends D2L/Brightspace with workload planning, deadline tracking, and productivity insights.",
      impact:
        "Built the Work Plan Optimizer flow and led interface design direction, including information structure, visual identity, and dashboard layout.",
      stack: [
        "TypeScript",
        "Node.js",
        "Next.js",
        "React",
        "Tailwind CSS",
        "Fastify",
        "Prisma",
        "PostgreSQL",
        "Playwright",
        "Zod",
        "CryptoJS",
        "Recharts",
      ],
      palette: { a: "#6b7d92", b: "#40576c" },
      icon: "./assets/icons/icon.svg",
      approach: [
        "Mapped assignment workloads into a prioritized planning model with recommendation logic.",
        "Designed dashboard structures to emphasize deadlines, workload, and completion momentum.",
        "Aligned visual system decisions with readability and high-density academic information.",
      ],
      outcomes: [
        "Shipped core optimizer workflow and interaction prototype.",
        "Established a scalable design direction for subsequent feature modules.",
      ],
    },
    {
      slug: "waterlooworks-plus",
      title: "WaterlooWorks+",
      category: "Web",
      status: "Concept + Development",
      summary:
        "Browser extension concept that improves WaterlooWorks with resume-aware job matching, work-term signals, and application support insights.",
      impact: "Ongoing build; details will be expanded as milestones are completed.",
      stack: ["Tech stack details coming soon"],
      palette: { a: "#7b6e56", b: "#4f5358" },
      icon: "./assets/icons/logo.png",
      approach: [
        "Framed extension opportunities around speed, signal clarity, and workflow ergonomics.",
        "Explored matching logic ideas linking resume context to posting relevance.",
      ],
      outcomes: [
        "Defined high-priority feature path for MVP validation.",
      ],
    },
    {
      slug: "uw-assignment-planner",
      title: "UW Assignment Planner",
      category: "Backend",
      status: "Internal Project",
      summary:
        "University of Waterloo assignment planning web app that generates structured, date-based workflows and timelines.",
      impact: "Developed the full application end-to-end independently.",
      stack: [
        "TypeScript",
        "Node.js",
        "Hono",
        "Server-rendered HTML/CSS",
        "Vanilla JavaScript",
        "tsx",
        "node:test",
      ],
      palette: { a: "#6a857f", b: "#4d5f69" },
      icon: "./assets/icons/uw-libraries.png",
      approach: [
        "Rebuilt planning features into an independent app architecture decoupled from legacy constraints.",
        "Focused on predictable date logic and practical student workflow output.",
      ],
      outcomes: [
        "Delivered stable assignment planning behavior for daily usage.",
        "Improved maintainability by simplifying architecture and testability.",
      ],
    },
    {
      slug: "food-printer",
      title: "Peristaltic Multi-Material 3D Food Printer",
      category: "Research",
      status: "Research + Hardware",
      summary:
        "Converted a Creality Ender 3 Pro into a multi-material food printer through mechanical redesign, printed components, and multi-syringe integration.",
      impact:
        "Designed and fabricated key CAD components including a four-material syringe holder and heat lamp mount for the conversion assembly.",
      stack: ["Fusion 360", "Cura", "PrusaSlicer"],
      palette: { a: "#8a7753", b: "#4f5f52" },
      icon: "./assets/icons/fast-research-group.png",
      iconScale: 0.88,
      approach: [
        "Designed conversion hardware for synchronized multi-material dispensing.",
        "Iterated printed parts for tolerances, mounting rigidity, and maintainability.",
      ],
      outcomes: [
        "Produced a functioning conversion platform for multi-material experimentation.",
        "Improved assembly consistency through iterative CAD refinement.",
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
