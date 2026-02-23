window.PORTFOLIO_DATA = {
  skills: [
    {
      category: "Languages",
      summary: "Primary programming languages used in coursework, co-ops, and projects.",
      items: [
        {
          name: "Python",
          detail: "Rapid scripting, automation, and API integration.",
        },
        {
          name: "C/C++",
          detail: "Embedded systems, firmware, and performance-sensitive development.",
        },
        {
          name: "HTML",
          detail: "Semantic page structure and accessible content layout.",
        },
        {
          name: "CSS",
          detail: "Responsive styling systems, design tokens, and UI polish.",
        },
        {
          name: "JavaScript",
          detail: "Vanilla browser scripting and full-stack product prototyping.",
        },
        {
          name: "TypeScript",
          detail: "Primary language for modern web applications, tooling, and backend services.",
        },
      ],
    },
    {
      category: "Frameworks + Libraries",
      summary: "Frontend and backend frameworks used for production-style apps.",
      items: [
        {
          name: "React",
          detail: "Component-driven UI development with reusable patterns.",
        },
        {
          name: "Next.js",
          detail: "Full-stack React applications with robust routing and rendering options.",
        },
        {
          name: "Vite",
          detail: "Fast local tooling and bundling for modern frontend development.",
        },
        {
          name: "Flask",
          detail: "Python web backends and service endpoints.",
        },
        {
          name: "Tailwind CSS",
          detail: "Utility-driven styling for rapid, consistent UI development.",
        },
        {
          name: "Hono",
          detail: "Minimal TypeScript server framework for lean backend routes.",
        },
      ],
    },
    {
      category: "Tools",
      summary: "Core software engineering tools and platforms used in project and team workflows.",
      items: [
        {
          name: "Git/GitHub",
          detail: "Version control, collaborative workflows, and PR-based development.",
        },
        {
          name: "Docker",
          detail: "Consistent runtime environments and reproducible setup.",
        },
        {
          name: "PostgreSQL",
          detail: "Relational database design and query optimization.",
        },
        {
          name: "Prisma ORM",
          detail: "Type-safe data modeling and query workflows.",
        },
        {
          name: "Supabase",
          detail: "Backend services, auth, and database integration.",
        },
        {
          name: "Playwright",
          detail: "End-to-end testing and reliability checks.",
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
      role: "Web Developer (Co-op)",
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
      period: "Co-op term",
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
      id: "city-of-london",
      role: "Recreation + Operations Roles",
      organization: "City of London",
      period: "Multiple terms",
      location: "London, Ontario",
      logo: "./assets/icons/city-of-london.png",
      highlights: [
        "Held public-facing roles including Skating Instructor, Theme Park Staff (Storybook Gardens), and Skate Cruiser.",
        "Built communication and operational reliability skills in high-traffic, fast-paced environments.",
      ],
      fieldNotes: [
        "Strengthened customer-facing communication and team coordination under operational pressure.",
      ],
    },
  ],
};
