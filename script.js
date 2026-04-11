const data = window.PORTFOLIO_DATA || { skills: [], projects: [], experience: [] };
const mapMeta = window.EXPEDITION_MAP_META || { width: 1536, height: 1024 };
const mapLocationSource = Array.isArray(window.EXPEDITION_MAP_PINS) ? window.EXPEDITION_MAP_PINS : [];
const mapLocations = mapLocationSource.map((location) => {
  const id = location.id || location.sectionId;
  return {
    id,
    sectionId: id,
    label:
      location.label ||
      String(id)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    x: Number(location.x) || 0,
    y: Number(location.y) || 0,
    zoomLevel: Number(location.zoomLevel || location.focusScale || 1.4),
    color: location.color || "#cba36d",
    hiddenPin: Boolean(location.hiddenPin),
  };
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DEBUG_TRANSITION = false;
const ENABLE_FALL_TRANSITION = true;
const CONTACT_FORM_CONFIG = {
  endpoint:
    (window.CONTACT_FORM_CONFIG && typeof window.CONTACT_FORM_CONFIG.endpoint === "string"
      ? window.CONTACT_FORM_CONFIG.endpoint
      : "") || "https://formspree.io/f/mwvwwney",
  subject: "Portfolio inquiry from matthewkim.com",
};
const CURSOR_TRAIL_STORAGE_KEY = "portfolio-map-cursor-trail-enabled";

const VIEW = {
  INTRO: "intro",
  TRANSITIONING: "transitioning",
  MAP: "map",
  CONTENT: "content",
};

const SECTION_PAGE_CONTENT = {
  about: {
    eyebrow: "Software Engineering Portfolio",
    title: "Matthew Kim",
    headline: "Mechatronics Engineering student at the University of Waterloo.",
    subline:
      "Focused on software development and robotics with a strong programming and systems engineering foundation.",
    tags: ["Software Engineering", "Full-Stack Development", "Robotics + AI", "Embedded Systems"],
    actions: [
      { label: "Download Resume", variant: "ghost", href: "./assets/Matthew_Kim_Resume.pdf", download: true },
      { label: "Email Matthew", variant: "primary", href: "mailto:m398kim@uwaterloo.ca" },
    ],
  },
  education: {
    eyebrow: "Education",
    title: "University of Waterloo",
    headline: "Mechatronics Engineering with a software-first, systems-minded focus.",
    subline:
      "This page covers academic foundation, technical training, and the coursework context behind the projects and experience shown across the portfolio.",
    tags: ["BASc Mechatronics", "Expected 2030", "Systems Thinking", "Engineering Fundamentals"],
    actions: [{ label: "Download Resume", variant: "ghost", href: "./assets/Matthew_Kim_Resume.pdf", download: true }],
  },
  skills: {
    eyebrow: "Skills",
    title: "Technical Toolkit",
    headline: "Languages, frameworks, and engineering tools used to ship practical software.",
    subline:
      "This page groups the stack I use most often across product builds, backend work, frontend implementation, and interdisciplinary engineering projects.",
    tags: ["TypeScript", "Python", "React", "Systems Engineering"],
    actions: [],
  },
  projects: {
    eyebrow: "Projects",
    title: "Selected Builds",
    headline: "A focused view of shipped work, active builds, and technical experiments.",
    subline:
      "Open any project card for its dedicated detail state with approach, stack, outcomes, and media where available.",
    tags: ["Frontend", "Backend", "Product Thinking", "Interactive Systems"],
    actions: [],
  },
  experience: {
    eyebrow: "Experience",
    title: "Work Experience",
    headline: "Co-op, research, and team-based work across software and engineering contexts.",
    subline:
      "This page highlights the environments where I have built, collaborated, and grown through real delivery work.",
    tags: ["Co-op", "Research", "Team Collaboration", "Execution"],
    actions: [],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let’s Connect",
    headline: "Best for software engineering opportunities, project collaboration, and product conversations.",
    subline:
      "Use the contact options on this page to reach out directly, connect professionally, or download my current resume.",
    tags: ["Email", "GitHub", "LinkedIn", "Resume"],
    actions: [
      { label: "Email Matthew", variant: "primary", href: "mailto:m398kim@uwaterloo.ca" },
      { label: "Download Resume", variant: "ghost", href: "./assets/Matthew_Kim_Resume.pdf", download: true },
    ],
  },
  "waterfall-secret": {
    eyebrow: "Hidden Find",
    title: "???",
    headline: "Hi",
    subline: "You found my dog hiding in the waterfall.",
    tags: ["Easter Egg", "Waterfall", "Dog"],
    actions: [],
  },
};

const state = {
  activeProjectSlug: null,
  activeSectionId: "about",
  activeSectionCamera: null,
  defaultMapCamera: null,
  previousProjectFocus: null,
  lockedNavId: null,
  lockedNavAt: 0,
  view: VIEW.INTRO,
  activeTimelineEntry: null,
  introTransitioning: false,
  mapInteracted: false,
  camera: {
    x: 0,
    y: 0,
    scale: 1,
    targetX: 0,
    targetY: 0,
    targetScale: 1,
    minScale: 0.7,
    maxScale: 2.45,
    rafId: 0,
    lastFrameAt: 0,
    manualAnimation: false,
    viewportWidth: 1,
    viewportHeight: 1,
  },
  drag: {
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startCamX: 0,
    startCamY: 0,
  },
  transition: {
    active: false,
    rafId: 0,
    startAt: 0,
    duration: 2000,
  },
  mapWarmup: {
    ready: false,
    promise: null,
    consumed: false,
    revealPreparedCamera: false,
    freezeUntil: 0,
    primed: false,
  },
  projectMedia: {
    autoplayId: 0,
  },
  cursorTrail: {
    enabled: true,
    lastX: null,
    lastY: null,
    lastAngle: 0,
    lastSpawnAt: 0,
    distanceCarry: 0,
    suppressedUntil: 0,
  },
};

const els = {
  body: document.body,
  expeditionShell: document.getElementById("expedition-shell"),
  introGate: document.getElementById("intro-gate"),
  introIllustration: document.getElementById("intro-illustration"),
  introContinue: document.getElementById("intro-continue"),
  mapGate: document.getElementById("map-gate"),
  mapViewport: document.getElementById("map-viewport"),
  mapWorld: document.getElementById("map-world"),
  mapImageShell: document.getElementById("map-image-shell"),
  mapBaseImage: document.getElementById("map-base-image"),
  mapPinsLayer: document.getElementById("map-pins-layer"),
  mapWaterfallSecret: document.getElementById("map-waterfall-secret"),
  mapReset: document.getElementById("map-reset"),
  mapIntro: document.getElementById("map-intro"),
  mapTrailToggle: document.getElementById("map-trail-toggle"),
  returnToMap: document.getElementById("return-to-map"),

  siteShell: document.querySelector(".site-shell"),
  brand: document.querySelector(".brand"),
  header: document.getElementById("site-header"),
  navToggle: document.getElementById("nav-toggle"),
  navLinks: Array.from(document.querySelectorAll(".main-nav a")),
  sections: Array.from(document.querySelectorAll("main section[id]")),
  heroSection: document.querySelector(".hero"),
  heroScene: document.querySelector(".hero-scene"),
  heroEyebrow: document.getElementById("page-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroHeadline: document.getElementById("page-headline"),
  heroSubline: document.getElementById("page-subline"),
  heroTags: document.getElementById("page-tags"),
  heroActions: document.getElementById("page-actions"),
  cursorTrailLayer: document.getElementById("cursor-trail-layer"),
  skillsGrid: document.getElementById("skills-grid"),
  projectsBrowser: document.getElementById("projects-browser"),
  projectsGrid: document.getElementById("projects-grid"),
  projectDetail: document.getElementById("project-detail"),
  experienceTimeline: document.getElementById("experience-timeline"),
  contactForm: document.getElementById("contact-form"),
  formStatus: document.getElementById("form-status"),
  contactSubmit: document.querySelector('#contact-form button[type="submit"]'),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clearProjectMediaAutoplay() {
  if (!state.projectMedia.autoplayId) return;
  window.clearInterval(state.projectMedia.autoplayId);
  state.projectMedia.autoplayId = 0;
}

function updateProjectSlideshow(root, nextIndex) {
  if (!root) return;

  const slideCount = Math.max(1, Number(root.getAttribute("data-slide-count")) || 1);
  const slideIndex = ((Number(nextIndex) || 0) % slideCount + slideCount) % slideCount;
  const track = root.querySelector("[data-project-slides-track]");
  const slideLabel = root.querySelector("[data-project-slide-label]");
  const dots = Array.from(root.querySelectorAll("[data-project-slide-dot]"));

  root.setAttribute("data-current-slide", String(slideIndex));

  if (track) {
    track.style.transform = `translate3d(${-slideIndex * 100}%, 0, 0)`;
  }

  if (slideLabel) {
    slideLabel.textContent = String(slideIndex + 1);
  }

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === slideIndex);
    dot.setAttribute("aria-pressed", index === slideIndex ? "true" : "false");
  });
}

function bindProjectMedia(project) {
  clearProjectMediaAutoplay();
  if (!project || !project.media) return;

  if (project.media.type === "slideshow") {
    const root = document.querySelector("[data-project-slideshow]");
    if (!root) return;

    const slideCount = Math.max(1, Number(root.getAttribute("data-slide-count")) || 1);
    const autoplayMs = Math.max(0, Number(root.getAttribute("data-autoplay-ms")) || 0);
    const prevButton = root.querySelector("[data-project-slide-prev]");
    const nextButton = root.querySelector("[data-project-slide-next]");
    const dots = Array.from(root.querySelectorAll("[data-project-slide-dot]"));

    const step = (delta) => {
      const current = Number(root.getAttribute("data-current-slide")) || 0;
      updateProjectSlideshow(root, current + delta);
    };

    if (prevButton) {
      prevButton.addEventListener("click", () => step(-1));
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => step(1));
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const targetIndex = Number(dot.getAttribute("data-project-slide-dot")) || 0;
        updateProjectSlideshow(root, targetIndex);
      });
    });

    if (slideCount > 1 && autoplayMs > 0) {
      const stop = () => clearProjectMediaAutoplay();
      const start = () => {
        clearProjectMediaAutoplay();
        state.projectMedia.autoplayId = window.setInterval(() => step(1), autoplayMs);
      };

      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);
      root.addEventListener("focusin", stop);
      root.addEventListener("focusout", start);
      start();
    }
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

function getTimelineLineInsetPx() {
  return parseFloat(getComputedStyle(document.documentElement).fontSize || "16") * 0.4;
}

function updateTimelineTrackBounds() {
  if (!els.experienceTimeline) return;

  const entries = getTimelineEntries();
  const firstMarker = entries[0] ? entries[0].querySelector(".timeline-marker") : null;
  const lastMarker = entries[entries.length - 1] ? entries[entries.length - 1].querySelector(".timeline-marker") : null;

  if (!firstMarker || !lastMarker) return;

  const timelineRect = els.experienceTimeline.getBoundingClientRect();
  const firstMarkerRect = firstMarker.getBoundingClientRect();
  const lastMarkerRect = lastMarker.getBoundingClientRect();

  const lineTop = firstMarkerRect.top + firstMarkerRect.height / 2 - timelineRect.top;
  const lineBottom = timelineRect.bottom - (lastMarkerRect.top + lastMarkerRect.height / 2);

  els.experienceTimeline.style.setProperty("--timeline-line-top", `${Math.max(lineTop, 0).toFixed(2)}px`);
  els.experienceTimeline.style.setProperty("--timeline-line-bottom", `${Math.max(lineBottom, 0).toFixed(2)}px`);
}

function setTimelineFillHeight(heightPx) {
  if (!els.experienceTimeline) return;

  updateTimelineTrackBounds();

  const maxHeight = getTimelineMaxHeight();
  const clampedHeight = clamp(heightPx, 0, maxHeight);

  els.experienceTimeline.style.setProperty("--timeline-fill-height", `${clampedHeight.toFixed(2)}px`);
}

function getTimelineFillHeightForEntry(entry) {
  if (!els.experienceTimeline || !entry) return 0;

  const marker = entry.querySelector(".timeline-marker");
  if (!marker) return 0;

  const timelineRect = els.experienceTimeline.getBoundingClientRect();
  const markerRect = marker.getBoundingClientRect();
  const lineTop = parseFloat(getComputedStyle(els.experienceTimeline).getPropertyValue("--timeline-line-top")) || getTimelineLineInsetPx();

  return markerRect.top + markerRect.height / 2 - timelineRect.top - lineTop;
}

function getTimelineEntries() {
  return els.experienceTimeline ? Array.from(els.experienceTimeline.querySelectorAll(".timeline-entry")) : [];
}

function getTimelineEntryIndex(entry) {
  if (!entry) return -1;

  const rawIndex = Number(entry.getAttribute("data-timeline-index"));
  return Number.isFinite(rawIndex) ? rawIndex : -1;
}

function getTimelineMaxHeight() {
  if (!els.experienceTimeline) return 0;

  const styles = getComputedStyle(els.experienceTimeline);
  const lineTop = parseFloat(styles.getPropertyValue("--timeline-line-top")) || getTimelineLineInsetPx();
  const lineBottom = parseFloat(styles.getPropertyValue("--timeline-line-bottom")) || getTimelineLineInsetPx();

  return Math.max(els.experienceTimeline.offsetHeight - lineTop - lineBottom, 0);
}

function activateTimelineEntry(entry) {
  const entryIndex = getTimelineEntryIndex(entry);
  if (entryIndex < 0) return;

  state.activeTimelineEntry = entry;
  updateTimelineProgress();
}

function getInteractiveTimelineEntry(target) {
  if (!(target instanceof Element)) return null;

  const interactiveArea = target.closest(".timeline-marker, .timeline-card");
  return interactiveArea ? interactiveArea.closest(".timeline-entry") : null;
}

function isContactFormConfigured() {
  return (
    typeof CONTACT_FORM_CONFIG.endpoint === "string" &&
    CONTACT_FORM_CONFIG.endpoint.startsWith("https://formspree.io/f/") &&
    !CONTACT_FORM_CONFIG.endpoint.includes("YOUR_FORM_ID")
  );
}

function setFormStatus(message, tone = "") {
  if (!els.formStatus) return;

  els.formStatus.textContent = message;
  els.formStatus.classList.toggle("is-error", tone === "error");
  els.formStatus.classList.toggle("is-success", tone === "success");
}

function setReady() {
  requestAnimationFrame(() => {
    els.body.classList.add("is-ready");
  });
}

function waitForAnimationFrames(count = 1) {
  return new Promise((resolve) => {
    const step = () => {
      if (count <= 0) {
        resolve();
        return;
      }
      count -= 1;
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
}

function clearCursorTrail() {
  state.cursorTrail.lastX = null;
  state.cursorTrail.lastY = null;
  state.cursorTrail.lastAngle = 0;
  state.cursorTrail.lastSpawnAt = 0;
  state.cursorTrail.distanceCarry = 0;

  if (els.cursorTrailLayer) {
    els.cursorTrailLayer.replaceChildren();
  }
}

function suppressCursorTrail(duration = 960) {
  clearCursorTrail();
  state.cursorTrail.suppressedUntil = performance.now() + duration;
}

function setCursorTrailEnabled(enabled, options = {}) {
  const { persist = true } = options;
  state.cursorTrail.enabled = enabled;

  if (!enabled) {
    clearCursorTrail();
  }

  if (els.mapTrailToggle) {
    els.mapTrailToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
    els.mapTrailToggle.setAttribute("aria-label", enabled ? "Turn cursor trail off" : "Turn cursor trail on");
    els.mapTrailToggle.setAttribute("data-tooltip", enabled ? "Trail on" : "Trail off");
    els.mapTrailToggle.classList.toggle("is-active", enabled);
  }

  if (persist) {
    try {
      window.localStorage.setItem(CURSOR_TRAIL_STORAGE_KEY, enabled ? "true" : "false");
    } catch {}
  }
}

function restoreCursorTrailPreference() {
  try {
    const stored = window.localStorage.getItem(CURSOR_TRAIL_STORAGE_KEY);
    if (stored === "false") {
      setCursorTrailEnabled(false, { persist: false });
      return;
    }
  } catch {}

  setCursorTrailEnabled(true, { persist: false });
}

function setViewMode(view) {
  state.view = view;
  if (els.body) {
    els.body.setAttribute("data-view", view);
    els.body.classList.toggle("expedition-mode", view !== VIEW.CONTENT);
  }

  if (view !== VIEW.MAP) {
    clearCursorTrail();
  }

  const introVisible = view === VIEW.INTRO || view === VIEW.TRANSITIONING;
  const mapVisible = view !== VIEW.CONTENT;
  const contentVisible = view === VIEW.CONTENT;

  if (els.introGate) {
    els.introGate.classList.toggle("is-visible", introVisible);
    els.introGate.style.display = introVisible ? "block" : "none";
    // During transition, CSS drives the gate opacity via --fall-progress; only
    // lock it in stable states so the inline style doesn't override the animation.
    if (view !== VIEW.TRANSITIONING) {
      els.introGate.style.opacity = introVisible ? "1" : "0";
    } else {
      els.introGate.style.opacity = "";
    }
    els.introGate.style.pointerEvents = view === VIEW.INTRO ? "auto" : "none";
  }

  if (els.mapGate) {
    els.mapGate.classList.toggle("is-visible", mapVisible);
    els.mapGate.style.display = mapVisible ? "block" : "none";
    if (view === VIEW.INTRO) {
      els.mapGate.style.opacity = "0.001";
      els.mapGate.style.pointerEvents = "none";
    } else if (view === VIEW.TRANSITIONING) {
      els.mapGate.style.opacity = "";
      els.mapGate.style.pointerEvents = "none";
    } else if (view === VIEW.MAP) {
      els.mapGate.style.opacity = "1";
      els.mapGate.style.pointerEvents = "auto";
    } else {
      els.mapGate.style.opacity = "";
      els.mapGate.style.pointerEvents = "none";
    }
    els.mapGate.style.position = "absolute";
    els.mapGate.style.inset = "0";
    els.mapGate.style.width = "100%";
    els.mapGate.style.height = "100%";
    els.mapGate.style.minHeight = "100vh";
  }

  if (els.siteShell) {
    els.siteShell.classList.toggle("shell-hidden", !contentVisible);
    els.siteShell.style.display = contentVisible ? "block" : "none";
  }

  if (els.expeditionShell) {
    const expeditionVisible = introVisible || mapVisible;
    els.expeditionShell.style.display = expeditionVisible ? "block" : "none";
    if (view === VIEW.MAP) {
      els.expeditionShell.classList.remove("is-transitioning");
      applyTransitionVisuals(1, 1, 0, 0);
    }
  }

  if (els.returnToMap) {
    els.returnToMap.hidden = !contentVisible;
  }

  if (els.body) {
    els.body.style.overflow = contentVisible ? "auto" : "hidden";
  }
}

function applyTransitionVisuals(progress, motion, shakeX, shakeY) {
  if (!els.expeditionShell) return;
  els.expeditionShell.style.setProperty("--fall-progress", progress.toFixed(4));
  els.expeditionShell.style.setProperty("--fall-motion", motion.toFixed(4));
  els.expeditionShell.style.setProperty("--fall-shake-x", `${shakeX.toFixed(3)}px`);
  els.expeditionShell.style.setProperty("--fall-shake-y", `${shakeY.toFixed(3)}px`);
}

function resetTransitionVisuals() {
  if (!els.expeditionShell) return;
  els.expeditionShell.classList.remove("is-transitioning");
  applyTransitionVisuals(0, 0, 0, 0);
}

function computeFallMotion(progress) {
  if (progress <= 0.2) {
    const t = progress / 0.2;
    return 0.18 * (t ** 2.2);
  }

  if (progress <= 0.75) {
    const t = (progress - 0.2) / 0.55;
    return 0.18 + 0.62 * t;
  }

  const t = (progress - 0.75) / 0.25;
  const eased = 1 - (1 - t) ** 3;
  return 0.8 + 0.2 * eased;
}

function computeLandingShake(progress, elapsedMs) {
  if (progress < 0.82 || progress > 0.95) return { x: 0, y: 0 };
  const span = 0.13;
  const center = 0.885;
  const normalized = 1 - Math.min(1, Math.abs(progress - center) / (span / 2));
  const amplitude = normalized * 1.15;
  const wave = elapsedMs / 14;
  return {
    x: Math.sin(wave) * amplitude,
    y: Math.cos(wave * 1.25) * amplitude * 0.72,
  };
}

function finishTransitionToMap() {
  state.transition.active = false;
  state.introTransitioning = false;

  if (state.transition.rafId) {
    cancelAnimationFrame(state.transition.rafId);
    state.transition.rafId = 0;
  }

  if (state.mapWarmup.revealPreparedCamera) {
    state.mapWarmup.revealPreparedCamera = false;
    revealPreparedMapView();
  } else {
    showMapView({ focusPins: true });
  }
  resetTransitionVisuals();
}

function revealPreparedMapView() {
  setViewMode(VIEW.MAP);
  if (window.history && typeof window.history.replaceState === "function") {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, behavior: "auto" });
  syncMapImageDimensions();
  cacheViewportSize();
  stopCameraLoop();
  applyCameraTransform();
  state.mapWarmup.freezeUntil = performance.now() + 1400;

  if (els.mapViewport) {
    els.mapViewport.style.width = "100%";
    els.mapViewport.style.height = "100%";
    els.mapViewport.style.minHeight = "100vh";
  }

  const firstPin = document.querySelector(".map-pin");
  if (firstPin) {
    requestAnimationFrame(() => firstPin.focus());
  }
}

function forceMapReveal() {
  state.transition.active = false;
  state.introTransitioning = false;

  if (state.transition.rafId) {
    cancelAnimationFrame(state.transition.rafId);
    state.transition.rafId = 0;
  }

  resetTransitionVisuals();
  if (state.mapWarmup.revealPreparedCamera) {
    state.mapWarmup.revealPreparedCamera = false;
    revealPreparedMapView();
    return;
  }

  setViewMode(VIEW.MAP);
  syncMapImageDimensions();
  cacheViewportSize();

  if (!state.mapInteracted) {
    fitMapToViewport();
  } else {
    setCameraTarget(state.camera.targetX, state.camera.targetY, state.camera.targetScale);
  }
}

function runTransitionTimeline() {
  if (state.transition.active) return;
  state.transition.active = true;
  state.transition.startAt = performance.now();
  if (els.expeditionShell) {
    els.expeditionShell.classList.add("is-transitioning");
  }

  const step = (now) => {
    const elapsed = now - state.transition.startAt;
    const progress = clamp(elapsed / state.transition.duration, 0, 1);
    const motion = computeFallMotion(progress);

    // No shake — cinematic cloud-reveal calls for calm, continuous motion
    applyTransitionVisuals(progress, motion, 0, 0);
    if (DEBUG_TRANSITION) {
      console.debug("[transition]", {
        state: state.view,
        progress: Number(progress.toFixed(3)),
        mapMounted: Boolean(els.mapGate && !els.mapGate.hidden),
      });
    }

    if (progress >= 1) {
      finishTransitionToMap();
      return;
    }

    state.transition.rafId = requestAnimationFrame(step);
  };

  state.transition.rafId = requestAnimationFrame(step);
}

function runReducedMotionTransition() {
  if (state.transition.active) return;
  state.transition.active = true;
  state.transition.startAt = performance.now();
  state.transition.duration = 260;

  if (els.expeditionShell) {
    els.expeditionShell.classList.add("is-transitioning");
  }

  const step = (now) => {
    const elapsed = now - state.transition.startAt;
    const progress = clamp(elapsed / state.transition.duration, 0, 1);
    applyTransitionVisuals(progress, progress, 0, 0);

    if (progress >= 1) {
      state.transition.duration = 2000;
      finishTransitionToMap();
      return;
    }

    state.transition.rafId = requestAnimationFrame(step);
  };

  state.transition.rafId = requestAnimationFrame(step);
}

function setMapWorldSize(width = mapMeta.width, height = mapMeta.height) {
  const nextWidth = Math.max(1, Math.round(Number(width) || mapMeta.width || 1));
  const nextHeight = Math.max(1, Math.round(Number(height) || mapMeta.height || 1));
  mapMeta.width = nextWidth;
  mapMeta.height = nextHeight;

  if (els.mapWorld) {
    els.mapWorld.style.width = `${nextWidth}px`;
    els.mapWorld.style.height = `${nextHeight}px`;
  }

  if (els.mapImageShell) {
    els.mapImageShell.style.width = `${nextWidth}px`;
    els.mapImageShell.style.height = `${nextHeight}px`;
  }

  if (els.mapPinsLayer) {
    els.mapPinsLayer.style.width = `${nextWidth}px`;
    els.mapPinsLayer.style.height = `${nextHeight}px`;
  }
}

function cacheViewportSize() {
  if (!els.mapViewport) return { width: 1, height: 1 };

  // Fit calculations should use layout size, not transformed visual size.
  // During the intro/replay states `.map-gate` is scaled slightly, which makes
  // getBoundingClientRect() over-report the viewport and causes the reveal to
  // start too zoomed in. clientWidth/clientHeight ignore that transform.
  const layoutWidth = els.mapViewport.clientWidth || els.mapViewport.offsetWidth;
  const layoutHeight = els.mapViewport.clientHeight || els.mapViewport.offsetHeight;
  const rect = els.mapViewport.getBoundingClientRect();

  state.camera.viewportWidth = Math.max(1, layoutWidth || rect.width);
  state.camera.viewportHeight = Math.max(1, layoutHeight || rect.height);
  return { width: state.camera.viewportWidth, height: state.camera.viewportHeight };
}

function getViewportSize() {
  if (!els.mapViewport) return { width: 1, height: 1 };
  if (state.camera.viewportWidth <= 1 || state.camera.viewportHeight <= 1) {
    return cacheViewportSize();
  }
  return {
    width: state.camera.viewportWidth,
    height: state.camera.viewportHeight,
  };
}

function canDragMap(scale = state.camera.targetScale) {
  return scale > state.camera.minScale + 0.01;
}

function clampCamera(x, y, scale) {
  const { width: viewportWidth, height: viewportHeight } = getViewportSize();
  const safeScale = clamp(scale, state.camera.minScale, state.camera.maxScale);
  const worldWidth = mapMeta.width * safeScale;
  const worldHeight = mapMeta.height * safeScale;
  const padding = 0;

  let nextX = x;
  let nextY = y;

  if (worldWidth <= viewportWidth) {
    nextX = (viewportWidth - worldWidth) / 2;
  } else {
    nextX = clamp(nextX, viewportWidth - worldWidth - padding, padding);
  }

  if (worldHeight <= viewportHeight) {
    nextY = (viewportHeight - worldHeight) / 2;
  } else {
    nextY = clamp(nextY, viewportHeight - worldHeight - padding, padding);
  }

  return { x: nextX, y: nextY, scale: safeScale };
}

function applyCameraTransform() {
  if (!els.mapWorld) return;
  if (
    !Number.isFinite(state.camera.x) ||
    !Number.isFinite(state.camera.y) ||
    !Number.isFinite(state.camera.scale) ||
    state.camera.scale <= 0
  ) {
    state.camera.x = 0;
    state.camera.y = 0;
    state.camera.scale = Math.max(1, state.camera.minScale || 1);
    state.camera.targetX = state.camera.x;
    state.camera.targetY = state.camera.y;
    state.camera.targetScale = state.camera.scale;
  }
  els.mapWorld.style.transform = `translate3d(${state.camera.x}px, ${state.camera.y}px, 0) scale(${state.camera.scale})`;
}

function stopCameraLoop() {
  if (!state.camera.rafId) return;
  cancelAnimationFrame(state.camera.rafId);
  state.camera.rafId = 0;
  state.camera.lastFrameAt = 0;
}

function stepCamera(now) {
  state.camera.rafId = 0;
  if (state.camera.manualAnimation) return;

  const dt = state.camera.lastFrameAt ? Math.min(48, now - state.camera.lastFrameAt) : 16;
  state.camera.lastFrameAt = now;
  const target = clampCamera(state.camera.targetX, state.camera.targetY, state.camera.targetScale);
  state.camera.targetX = target.x;
  state.camera.targetY = target.y;
  state.camera.targetScale = target.scale;

  const smoothing = state.drag.active ? 0.82 : 1 - Math.exp(-dt * 0.018);

  state.camera.x += (target.x - state.camera.x) * smoothing;
  state.camera.y += (target.y - state.camera.y) * smoothing;
  state.camera.scale += (target.scale - state.camera.scale) * smoothing;
  applyCameraTransform();

  const done =
    Math.abs(target.x - state.camera.x) < 0.06 &&
    Math.abs(target.y - state.camera.y) < 0.06 &&
    Math.abs(target.scale - state.camera.scale) < 0.0008 &&
    !state.drag.active;

  if (done) {
    state.camera.x = target.x;
    state.camera.y = target.y;
    state.camera.scale = target.scale;
    applyCameraTransform();
    state.camera.lastFrameAt = 0;
    return;
  }

  state.camera.rafId = requestAnimationFrame(stepCamera);
}

function ensureCameraLoop() {
  if (state.camera.manualAnimation) return;
  if (state.camera.rafId) return;
  state.camera.rafId = requestAnimationFrame(stepCamera);
}

function setCameraInstant(x, y, scale) {
  stopCameraLoop();
  const clamped = clampCamera(x, y, scale);
  state.camera.x = clamped.x;
  state.camera.y = clamped.y;
  state.camera.scale = clamped.scale;
  state.camera.targetX = clamped.x;
  state.camera.targetY = clamped.y;
  state.camera.targetScale = clamped.scale;
  applyCameraTransform();
}

function setCameraTarget(x, y, scale) {
  const clamped = clampCamera(x, y, scale);
  state.camera.targetX = clamped.x;
  state.camera.targetY = clamped.y;
  state.camera.targetScale = clamped.scale;
  ensureCameraLoop();
}

function getFitMapCameraTarget() {
  const { width, height } = cacheViewportSize();
  const fitScale = Math.max(width / mapMeta.width, height / mapMeta.height);
  const minDynamic = clamp(fitScale, 0.05, 2.1);
  state.camera.minScale = minDynamic;
  const scale = clamp(fitScale, state.camera.minScale, state.camera.maxScale);
  const x = (width - mapMeta.width * scale) / 2;
  const y = (height - mapMeta.height * scale) / 2;
  const target = clampCamera(x, y, scale);
  state.defaultMapCamera = { ...target };
  return target;
}

function fitMapToViewport(options = {}) {
  const { animate = false, duration = 740 } = options;
  const target = getFitMapCameraTarget();

  if (animate) {
    return animateCameraTo(target.x, target.y, target.scale, duration);
  }

  setCameraInstant(target.x, target.y, target.scale);
  return Promise.resolve();
}

function zoomAt(clientX, clientY, nextScale) {
  if (!els.mapViewport) return;
  const rect = els.mapViewport.getBoundingClientRect();
  const px = clientX - rect.left;
  const py = clientY - rect.top;

  const startScale = state.camera.targetScale;
  const targetScale = clamp(nextScale, state.camera.minScale, state.camera.maxScale);
  const worldX = (px - state.camera.targetX) / startScale;
  const worldY = (py - state.camera.targetY) / startScale;
  const x = px - worldX * targetScale;
  const y = py - worldY * targetScale;
  setCameraTarget(x, y, targetScale);
}

function animateCameraTo(x, y, scale, duration = 780) {
  if (prefersReducedMotion) {
    setCameraInstant(x, y, scale);
    return Promise.resolve();
  }

  stopCameraLoop();
  state.camera.manualAnimation = true;
  const startX = state.camera.x;
  const startY = state.camera.y;
  const startScale = state.camera.scale;
  const target = clampCamera(x, y, scale);

  return new Promise((resolve) => {
    const startAt = performance.now();

    const tick = (now) => {
      const t = clamp((now - startAt) / duration, 0, 1);
      const eased = easeInOutCubic(t);

      state.camera.x = startX + (target.x - startX) * eased;
      state.camera.y = startY + (target.y - startY) * eased;
      state.camera.scale = startScale + (target.scale - startScale) * eased;
      state.camera.targetX = state.camera.x;
      state.camera.targetY = state.camera.y;
      state.camera.targetScale = state.camera.scale;
      applyCameraTransform();

      if (t < 1) {
        state.camera.rafId = requestAnimationFrame(tick);
        return;
      }

      state.camera.manualAnimation = false;
      state.camera.rafId = 0;
      state.camera.lastFrameAt = 0;
      setCameraTarget(target.x, target.y, target.scale);
      resolve();
    };

    state.camera.rafId = requestAnimationFrame(tick);
  });
}

function setActiveMapPin(sectionId) {
  const pins = Array.from(document.querySelectorAll(".map-pin"));
  pins.forEach((pin) => {
    pin.classList.toggle("is-active", pin.dataset.section === sectionId);
  });
}

function triggerMapPinPing(pin) {
  if (!pin) return;
  pin.classList.remove("is-pinged");
  requestAnimationFrame(() => {
    pin.classList.add("is-pinged");
    window.setTimeout(() => pin.classList.remove("is-pinged"), 560);
  });
}

function renderMapPins() {
  if (!els.mapPinsLayer) return;

  els.mapPinsLayer.innerHTML = mapLocations
    .filter((location) => !location.hiddenPin)
    .map((location) => {
      return `
        <button
          class="map-pin"
          type="button"
          data-section="${escapeHtml(location.sectionId)}"
          style="left:${location.x}px;top:${location.y}px;--pin-color:${escapeHtml(location.color || "#cba36d")};"
          aria-label="Explore ${escapeHtml(location.label)}"
        >
          <span class="map-pin-head" aria-hidden="true">
            <span class="map-pin-ring"></span>
            <span class="map-pin-dot"></span>
          </span>
          <span class="map-pin-stem" aria-hidden="true"></span>
          <span class="map-pin-label">${escapeHtml(location.label)}</span>
        </button>
      `;
    })
    .join("");
}

function findMapLocation(sectionId) {
  return mapLocations.find((location) => location.sectionId === sectionId);
}

function syncMapImageDimensions() {
  if (!els.mapBaseImage) return;
  const width = Number(els.mapBaseImage.naturalWidth) || mapMeta.width;
  const height = Number(els.mapBaseImage.naturalHeight) || mapMeta.height;
  if (width && height) {
    setMapWorldSize(width, height);
  }
}

function stabilizeMapForTransition() {
  syncMapImageDimensions();
  cacheViewportSize();

  const target = getFitMapCameraTarget();
  setCameraInstant(target.x, target.y, target.scale);

  if (els.mapWorld) {
    els.mapWorld.getBoundingClientRect();
  }
}

function warmMapForTransition() {
  if (state.mapWarmup.ready) return Promise.resolve();
  if (state.mapWarmup.promise) return state.mapWarmup.promise;

  const imageReady = new Promise((resolve) => {
    if (!els.mapBaseImage) {
      resolve();
      return;
    }

    const finalize = () => {
      if (typeof els.mapBaseImage.decode === "function") {
        els.mapBaseImage.decode().catch(() => {}).finally(resolve);
        return;
      }

      resolve();
    };

    if (els.mapBaseImage.complete && els.mapBaseImage.naturalWidth > 0) {
      finalize();
      return;
    }

    els.mapBaseImage.addEventListener("load", finalize, { once: true });
    els.mapBaseImage.addEventListener("error", resolve, { once: true });
  });

  state.mapWarmup.promise = imageReady
    .then(() => waitForAnimationFrames(2))
    .then(() => {
      stabilizeMapForTransition();
      state.mapWarmup.ready = true;
    })
    .finally(() => {
      state.mapWarmup.promise = null;
    });

  return state.mapWarmup.promise;
}

function primeInitialMapState() {
  if (state.mapWarmup.primed || state.view !== VIEW.INTRO) return Promise.resolve();

  state.mapWarmup.primed = true;
  setViewMode(VIEW.MAP);
  stopCameraLoop();
  applyCameraTransform();

  if (els.mapGate) {
    els.mapGate.getBoundingClientRect();
  }

  if (els.mapWorld) {
    els.mapWorld.getBoundingClientRect();
  }

  return waitForAnimationFrames(2).then(() => {
    if (state.view === VIEW.MAP) {
      setViewMode(VIEW.INTRO);
    }
  });
}

function showMapView(options = {}) {
  const { focusPins = false, resetCamera = false, animateReset = false } = options;
  setViewMode(VIEW.MAP);
  if (window.history && typeof window.history.replaceState === "function") {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, behavior: "auto" });
  syncMapImageDimensions();
  cacheViewportSize();

  if (els.mapViewport) {
    els.mapViewport.style.width = "100%";
    els.mapViewport.style.height = "100%";
    els.mapViewport.style.minHeight = "100vh";
  }

  const hasValidCamera =
    Number.isFinite(state.camera.targetX) &&
    Number.isFinite(state.camera.targetY) &&
    Number.isFinite(state.camera.targetScale) &&
    state.camera.targetScale > 0;

  if (resetCamera || !state.mapInteracted || !hasValidCamera) {
    fitMapToViewport({ animate: animateReset });
  } else {
    setCameraTarget(state.camera.targetX, state.camera.targetY, state.camera.targetScale);
  }

  requestAnimationFrame(() => {
    const { width, height } = getViewportSize();
    if (width < 8 || height < 8) {
      cacheViewportSize();
      fitMapToViewport();
      return;
    }
    if (!Number.isFinite(state.camera.scale) || state.camera.scale <= 0) {
      fitMapToViewport();
    }
  });

  if (focusPins) {
    const firstPin = document.querySelector(".map-pin");
    if (firstPin) {
      requestAnimationFrame(() => firstPin.focus());
    }
  }
}

function showContentView(sectionId) {
  const nextId = els.sections.some((section) => section.id === sectionId) ? sectionId : "about";
  setViewMode(VIEW.CONTENT);
  const targetId = `#${nextId}`;

  if (window.history && typeof window.history.replaceState === "function") {
    window.history.replaceState(null, "", targetId);
  }

  state.lockedNavId = null;
  state.lockedNavAt = 0;
  updateContentMapBackdrop(nextId);
  setActiveNavLink(nextId);
  setActiveContentSection(nextId);
  closeMobileNav();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function getSectionCameraTarget(sectionId) {
  const location = findMapLocation(sectionId);
  if (!location) return null;

  const { width, height } = getViewportSize();
  const scale = clamp(location.zoomLevel || 1.36, state.camera.minScale, state.camera.maxScale);
  const x = width * 0.5 - location.x * scale;
  const y = height * 0.44 - location.y * scale;

  return { x, y, scale };
}

function updateContentMapBackdrop(sectionId = state.activeSectionId) {
  if (!els.body) return;

  const location = findMapLocation(sectionId);
  const rawTarget =
    (state.activeSectionId === sectionId && state.activeSectionCamera) ||
    getSectionCameraTarget(sectionId) ||
    getFitMapCameraTarget();
  const target = clampCamera(rawTarget.x, rawTarget.y, rawTarget.scale);
  const mapWidth = mapMeta.width * target.scale;
  const mapHeight = mapMeta.height * target.scale;
  const focusX = location ? (location.x / mapMeta.width) * 100 : 50;
  const focusY = location ? (location.y / mapMeta.height) * 100 : 50;

  els.body.style.setProperty("--content-map-x", `${target.x}px`);
  els.body.style.setProperty("--content-map-y", `${target.y}px`);
  els.body.style.setProperty("--content-map-width", `${mapWidth}px`);
  els.body.style.setProperty("--content-map-height", `${mapHeight}px`);
  els.body.style.setProperty("--content-map-focus-x", `${focusX.toFixed(2)}%`);
  els.body.style.setProperty("--content-map-focus-y", `${focusY.toFixed(2)}%`);
}

function flyToSection(sectionId) {
  suppressCursorTrail(980);
  const rawTarget = getSectionCameraTarget(sectionId);

  if (!rawTarget) {
    showContentView(sectionId);
    return;
  }

  const target = clampCamera(rawTarget.x, rawTarget.y, rawTarget.scale);
  state.activeSectionCamera = target;
  setActiveMapPin(sectionId);
  animateCameraTo(target.x, target.y, target.scale, 860).then(() => {
    showContentView(sectionId);
  });
}

function bindIntroExperience() {
  if (!els.introGate) return;

  const startMapTransition = () => {
    if (!ENABLE_FALL_TRANSITION) {
      showMapView({ focusPins: true });
      state.introTransitioning = false;
      return;
    }

    setViewMode(VIEW.TRANSITIONING);
    window.setTimeout(() => {
      if (state.view !== VIEW.MAP && state.view !== VIEW.CONTENT) {
        forceMapReveal();
      }
    }, state.transition.duration + 220);

    if (prefersReducedMotion) {
      runReducedMotionTransition();
      return;
    }

    runTransitionTimeline();
  };

  const continueToMap = () => {
    if (state.view !== VIEW.INTRO || state.introTransitioning) return;
    state.introTransitioning = true;

    const isInitialEntry = !state.mapWarmup.consumed;
    state.mapWarmup.consumed = true;

    if (!isInitialEntry) {
      state.mapWarmup.revealPreparedCamera = true;
      stabilizeMapForTransition();
      startMapTransition();
      return;
    }

    state.mapWarmup.revealPreparedCamera = true;

    const warmupTask = state.mapWarmup.ready ? Promise.resolve() : state.mapWarmup.promise || warmMapForTransition();

    warmupTask
      .catch(() => {})
      .then(() => {
        if (state.view !== VIEW.INTRO) {
          state.introTransitioning = false;
          return;
        }

        stabilizeMapForTransition();
        startMapTransition();
      });
  };

  if (els.introContinue) {
    els.introContinue.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      continueToMap();
    });
  }

  if (!els.introIllustration) return;
  const layers = Array.from(els.introIllustration.querySelectorAll(".intro-parallax"));
  layers.forEach((layer) => {
    const depth = clamp(Number(layer.getAttribute("data-depth") || 0.1), 0.04, 0.42);
    layer.style.setProperty("--depth", depth.toFixed(3));
  });
}

function bindMapInteractions() {
  if (!els.mapViewport || !els.mapWorld) return;

  syncMapImageDimensions();
  renderMapPins();

  if (els.mapBaseImage && !els.mapBaseImage.complete) {
    els.mapBaseImage.addEventListener(
      "load",
      () => {
        syncMapImageDimensions();
        cacheViewportSize();
        if (state.mapWarmup.ready || performance.now() < state.mapWarmup.freezeUntil) {
          applyCameraTransform();
          return;
        }
        if (!state.mapInteracted) {
          fitMapToViewport();
        } else {
          setCameraTarget(state.camera.targetX, state.camera.targetY, state.camera.targetScale);
        }
      },
      { once: true }
    );
  }

  if (els.mapReset) {
    els.mapReset.addEventListener("click", () => {
      if (state.view !== VIEW.MAP) return;
      state.mapInteracted = false;
      fitMapToViewport({ animate: true, duration: 780 });
      setActiveMapPin("");
    });
  }

  if (els.mapIntro) {
    els.mapIntro.addEventListener("click", () => {
      if (state.view !== VIEW.MAP) return;
      state.introTransitioning = false;
      state.transition.active = false;
      if (state.transition.rafId) {
        cancelAnimationFrame(state.transition.rafId);
        state.transition.rafId = 0;
      }
      resetTransitionVisuals();
      setActiveMapPin("");
      setViewMode(VIEW.INTRO);
      window.scrollTo({ top: 0, behavior: "auto" });
      if (els.introContinue) {
        requestAnimationFrame(() => els.introContinue.focus());
      }
    });
  }

  if (els.mapTrailToggle) {
    els.mapTrailToggle.addEventListener("click", () => {
      setCursorTrailEnabled(!state.cursorTrail.enabled);
    });
  }

  if (els.returnToMap) {
    els.returnToMap.addEventListener("click", () => {
      const sectionTarget = state.activeSectionCamera || getSectionCameraTarget(state.activeSectionId);

      setViewMode(VIEW.MAP);
      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, behavior: "auto" });
      state.mapInteracted = false;
      setActiveMapPin("");
      if (els.mapViewport) {
        els.mapViewport.style.width = "100%";
        els.mapViewport.style.height = "100%";
        els.mapViewport.style.minHeight = "100vh";
      }

      requestAnimationFrame(() => {
        syncMapImageDimensions();
        const defaultTarget = getFitMapCameraTarget();

        if (sectionTarget) {
          setCameraInstant(sectionTarget.x, sectionTarget.y, sectionTarget.scale);
        } else {
          setCameraInstant(defaultTarget.x, defaultTarget.y, defaultTarget.scale);
        }

        animateCameraTo(defaultTarget.x, defaultTarget.y, defaultTarget.scale, 860).then(() => {
          setCameraInstant(defaultTarget.x, defaultTarget.y, defaultTarget.scale);
          const firstPin = document.querySelector(".map-pin");
          if (firstPin) {
            requestAnimationFrame(() => firstPin.focus());
          }
        });
      });
    });
  }

  if (els.mapPinsLayer) {
    els.mapPinsLayer.addEventListener("click", (event) => {
      if (state.view !== VIEW.MAP) return;
      const pin = event.target.closest(".map-pin");
      if (!pin) return;
      const sectionId = pin.getAttribute("data-section");
      if (!sectionId) return;
      triggerMapPinPing(pin);
      state.mapInteracted = true;
      flyToSection(sectionId);
    });

    els.mapPinsLayer.addEventListener("keydown", (event) => {
      if (state.view !== VIEW.MAP) return;
      const pin = event.target.closest(".map-pin");
      if (!pin) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const sectionId = pin.getAttribute("data-section");
      if (!sectionId) return;
      triggerMapPinPing(pin);
      state.mapInteracted = true;
      flyToSection(sectionId);
    });
  }

  if (els.mapWaterfallSecret) {
    els.mapWaterfallSecret.addEventListener("click", (event) => {
      if (state.view !== VIEW.MAP) return;
      event.preventDefault();
      event.stopPropagation();
      state.mapInteracted = true;
      flyToSection("waterfall-secret");
    });
  }

  els.mapViewport.addEventListener(
    "wheel",
    (event) => {
      if (state.view !== VIEW.MAP) return;
      event.preventDefault();
      state.mapInteracted = true;
      const factor = event.deltaY < 0 ? 1.16 : 0.86;
      zoomAt(event.clientX, event.clientY, state.camera.targetScale * factor);
    },
    { passive: false }
  );

  els.mapViewport.addEventListener("pointerdown", (event) => {
    if (state.view !== VIEW.MAP) return;
    if (event.button !== 0) return;
    if (event.target.closest(".map-pin")) return;
    if (event.target.closest(".map-easter-egg")) return;
    if (!canDragMap()) return;

    state.drag.active = true;
    state.drag.pointerId = event.pointerId;
    state.drag.startX = event.clientX;
    state.drag.startY = event.clientY;
    state.drag.startCamX = state.camera.targetX;
    state.drag.startCamY = state.camera.targetY;
    state.mapInteracted = true;

    els.mapViewport.classList.add("is-dragging");
    els.mapViewport.setPointerCapture(event.pointerId);
  });

  els.mapViewport.addEventListener("pointermove", (event) => {
    if (!state.drag.active) return;
    if (event.pointerId !== state.drag.pointerId) return;

    const dx = event.clientX - state.drag.startX;
    const dy = event.clientY - state.drag.startY;

    setCameraTarget(state.drag.startCamX + dx, state.drag.startCamY + dy, state.camera.targetScale);
  });

  const endDrag = (event) => {
    if (!state.drag.active) return;
    if (event.pointerId !== state.drag.pointerId) return;

    state.drag.active = false;
    state.drag.pointerId = null;
    els.mapViewport.classList.remove("is-dragging");
    if (els.mapViewport.hasPointerCapture(event.pointerId)) {
      els.mapViewport.releasePointerCapture(event.pointerId);
    }
  };

  els.mapViewport.addEventListener("pointerup", endDrag);
  els.mapViewport.addEventListener("pointercancel", endDrag);

  window.addEventListener("keydown", (event) => {
    if (state.view !== VIEW.MAP) return;

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      const { width, height } = getViewportSize();
      zoomAt(width / 2, height / 2, state.camera.targetScale * 1.08);
      return;
    }

    if (event.key === "-") {
      event.preventDefault();
      const { width, height } = getViewportSize();
      zoomAt(width / 2, height / 2, state.camera.targetScale * 0.92);
    }
  });
}

function renderSkills() {
  if (!els.skillsGrid) return;

  els.skillsGrid.innerHTML = data.skills
    .map((group, index) => {
      const chips = group.items
        .map((item) => {
          const icon = renderSkillIcon(item);

          const titleAttr = item.detail ? ` title="${escapeHtml(item.detail)}"` : "";
          const className = icon ? "skill-chip skill-chip--with-icon" : "skill-chip";

          return `<li><span class="${className}"${titleAttr}>${icon}<span class="skill-chip-label">${escapeHtml(
            item.name
          )}</span></span></li>`;
        })
        .join("");

      return `
        <article class="card toolkit-card reveal" style="--stagger-index:${index}">
          <h3>${escapeHtml(group.category)}</h3>
          <p class="toolkit-summary">${escapeHtml(group.summary)}</p>
          <ul class="skill-list">${chips}</ul>
        </article>
      `;
    })
    .join("");
}

function renderSkillIcon(item) {
  return renderSkillLikeIcon(item);
}

function renderSkillLikeIcon(item, fallbackMode = "mark") {
  if (item.icon) {
    const styleVars = [];

    if (item.iconScale) {
      styleVars.push(`--skill-icon-scale:${escapeHtml(String(item.iconScale))}`);
    }

    if (item.iconOffsetX) {
      styleVars.push(`--skill-icon-offset-x:${escapeHtml(String(item.iconOffsetX))}`);
    }

    if (item.iconOffsetY) {
      styleVars.push(`--skill-icon-offset-y:${escapeHtml(String(item.iconOffsetY))}`);
    }

    const styleAttr = styleVars.length ? ` style="${styleVars.join(";")}"` : "";

    return `<span class="skill-chip-icon-wrap" aria-hidden="true">
      <img
        class="skill-chip-icon"
        src="${escapeHtml(item.icon)}"
        alt=""
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        ${styleAttr}
        onerror="this.hidden=true;this.nextElementSibling.hidden=false;"
      />
      <span class="skill-chip-fallback" hidden>${escapeHtml(getSkillMark(item.name))}</span>
    </span>`;
  }

  const customIcon = getSkillSymbol(item.name);
  if (customIcon) {
    return `<span class="skill-chip-icon-wrap skill-chip-icon-wrap--symbol" aria-hidden="true">${customIcon}</span>`;
  }

  if (fallbackMode === "generic") {
    return `<span class="skill-chip-icon-wrap skill-chip-icon-wrap--symbol" aria-hidden="true">${getGenericTechSymbol()}</span>`;
  }

  return "";
}

function getSkillSymbol(name) {
  const skillName = String(name).trim().toLowerCase();
  const skillSymbols = {
    sql: `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="5" rx="7" ry="3"></ellipse>
        <path d="M5 5v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5"></path>
        <path d="M5 11v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"></path>
      </svg>
    `,
    "rest apis": `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="5" width="8" height="6" rx="2"></rect>
        <rect x="13" y="13" width="8" height="6" rx="2"></rect>
        <path d="M11 8h2a4 4 0 0 1 4 4v1"></path>
        <path d="M13 16h-2a4 4 0 0 1-4-4v-1"></path>
      </svg>
    `,
    wcag: `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="4.5" r="1.5"></circle>
        <path d="M6 8h12"></path>
        <path d="M12 8v5"></path>
        <path d="M9 21l3-8 3 8"></path>
        <path d="M8 13h8"></path>
      </svg>
    `,
    aria: `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a4 4 0 0 1 4 4v3"></path>
        <path d="M12 3a4 4 0 0 0-4 4v3"></path>
        <path d="M17 11v2a5 5 0 0 1-10 0v-2"></path>
        <path d="M12 18v3"></path>
        <path d="M9 21h6"></path>
      </svg>
    `,
    "ci/cd": `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 3l4 4-4 4"></path>
        <path d="M3 11V9a2 2 0 0 1 2-2h16"></path>
        <path d="M7 21l-4-4 4-4"></path>
        <path d="M21 13v2a2 2 0 0 1-2 2H3"></path>
      </svg>
    `,
    "chrome extensions": `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 4h4a2 2 0 0 1 2 2v1.2a2 2 0 0 0 1.1 1.8l.8.4a2 2 0 0 1 1.1 1.8V14a2 2 0 0 1-2 2h-1.2a2 2 0 0 0-1.8 1.1l-.4.8a2 2 0 0 1-1.8 1.1H10a2 2 0 0 1-2-2v-1.2a2 2 0 0 0-1.1-1.8l-.8-.4A2 2 0 0 1 5 11.8V10a2 2 0 0 1 2-2h1.2A2 2 0 0 0 10 6.9l.4-.8A2 2 0 0 1 12.2 5H14"></path>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    `,
    "manifest v3": `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="8"></circle>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 4a8 8 0 0 1 6.9 4H12"></path>
        <path d="M5.1 8A8 8 0 0 0 8 18l4-6"></path>
        <path d="M15 18a8 8 0 0 0 3.9-6H12"></path>
      </svg>
    `,
    "chrome storage api": `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="5" width="16" height="14" rx="2"></rect>
        <path d="M4 9h16"></path>
        <path d="M8 13h3"></path>
        <path d="M13 13h3"></path>
        <path d="M8 16h8"></path>
      </svg>
    `,
    llms: `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="8" width="12" height="9" rx="3"></rect>
        <path d="M12 8V5"></path>
        <circle cx="9.5" cy="12" r="0.8" fill="currentColor" stroke="none"></circle>
        <circle cx="14.5" cy="12" r="0.8" fill="currentColor" stroke="none"></circle>
        <path d="M10 15h4"></path>
        <path d="M8 5h8"></path>
        <path d="M4 11v3"></path>
        <path d="M20 11v3"></path>
      </svg>
    `,
    "3d printing": `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 7V4h10v3"></path>
        <rect x="5" y="7" width="14" height="6" rx="2"></rect>
        <path d="M12 13v3"></path>
        <path d="M9 20h6"></path>
        <path d="M8 16h8"></path>
        <path d="M8 20v-2a4 4 0 0 1 8 0v2"></path>
      </svg>
    `,
    "mechanical design": `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 18l7-7"></path>
        <path d="M14 4l6 6"></path>
        <path d="M13 5l6 6"></path>
        <path d="M8 21H4v-4"></path>
        <path d="M9 8l2-2"></path>
        <path d="M15 14l2-2"></path>
      </svg>
    `,
    "hardware prototyping": `
      <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="7" y="7" width="10" height="10" rx="2"></rect>
        <path d="M9 1v3"></path>
        <path d="M15 1v3"></path>
        <path d="M9 20v3"></path>
        <path d="M15 20v3"></path>
        <path d="M1 9h3"></path>
        <path d="M1 15h3"></path>
        <path d="M20 9h3"></path>
        <path d="M20 15h3"></path>
        <path d="M10 10h4v4h-4z"></path>
      </svg>
    `,
  };

  return skillSymbols[skillName] || "";
}

function getSkillMark(name) {
  const tokens = String(name)
    .replace(/[+.]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) return "SK";

  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }

  return tokens
    .slice(0, 2)
    .map((token) => token[0])
    .join("")
    .toUpperCase();
}

function getProjectBySlug(slug) {
  return data.projects.find((project) => project.slug === slug);
}

function getProjectMark(title) {
  const chars = String(title)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return chars || "PR";
}

function findProjectStackMeta(name) {
  const target = String(name).trim().toLowerCase();
  const projectStackIcons = {
    "chrome extensions": {
      icon: "./assets/icons/chrome-extensions-icon.png",
      iconScale: 3.35,
      iconOffsetX: "-0.04rem",
      iconOffsetY: "0.06rem",
    },
    "manifest v3": { icon: "./assets/icons/manifest-v3-icon.png", iconScale: 3.35 },
    "3d printing": { icon: "./assets/icons/3d-printing-icon.png" },
    "mechanical design": { icon: "./assets/icons/mechanical-design-icon.png", iconScale: 1.8 },
    "edamam api": { icon: "./assets/icons/edamam-icon.png" },
    expo: { icon: "./assets/icons/expo-icon.png", iconScale: 1.18 },
    "google places api": { icon: "./assets/icons/google-places-api-icon.png", iconScale: 1.16 },
    "fusion 360": { icon: "./assets/icons/fusion-360-icon.png" },
    "bitmap_image.hpp": { icon: "./assets/icons/bitmap-image-icon.png" },
    fmod: { icon: "./assets/icons/fmod-icon.webp" },
    "visual studio": { icon: "./assets/icons/visual-studio-icon.png" },
    cura: { icon: "./assets/icons/cura-icon.png" },
    prusaslicer: { icon: "./assets/icons/prusa-slicer-icon.png" },
    uvicorn: { icon: "./assets/icons/uvicorn-icon.png" },
    "win32 api": { icon: "./assets/icons/win32-api-icon.png", iconScale: 1.4 },
  };

  if (projectStackIcons[target]) {
    return { name, ...projectStackIcons[target] };
  }

  return findSkillMetaByName(name);
}

function findSkillMetaByName(name) {
  const target = String(name).trim().toLowerCase();
  const aliases = {
    "vanilla javascript": "javascript",
    "server-rendered html": "html5",
    css3: "css3",
    "docker compose": "docker",
    "react native": "react",
    "supabase edge functions": "supabase",
    "react dnd": "react",
    jspdf: "javascript",
    "supabase auth": "supabase",
    "supabase realtime": "supabase",
    "node test runner": "node.js",
    cad: "fusion 360",
  };
  const resolvedTarget = aliases[target] || target;

  for (const group of data.skills || []) {
    for (const item of group.items || []) {
      if (String(item.name).trim().toLowerCase() === resolvedTarget) {
        return item;
      }
    }
  }

  return null;
}

function getGenericTechSymbol() {
  return `
    <svg class="skill-chip-icon skill-chip-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="2"></rect>
      <path d="M8 9h8"></path>
      <path d="M8 13h5"></path>
      <path d="M15.5 13l1.5 1.5-1.5 1.5"></path>
    </svg>
  `;
}

function renderProjectStackChip(item) {
  const skillMeta = findProjectStackMeta(item);
  const icon = renderSkillLikeIcon(skillMeta || { name: item }, "generic");

  return `<span class="tag project-stack-chip project-stack-chip--with-icon">${icon}<span class="project-stack-chip-label">${escapeHtml(
    item
  )}</span></span>`;
}

function renderProjectIconBadge(project, variant = "tile") {
  const baseClass =
    variant === "detail" ? "project-logo-badge project-logo-badge--detail" : "project-logo-badge";

  if (project.icon) {
    const shouldContain = project.iconFit === "contain";
    const fitClass = shouldContain ? "project-logo-image project-logo-image--contain" : "project-logo-image";
    const logoScale = Number.isFinite(project.iconScale) ? project.iconScale : null;
    const styleAttr = logoScale ? ` style="--logo-scale:${logoScale}"` : "";
    const badgeVars = [];

    if (project.iconBadgeBg) {
      badgeVars.push(`--project-badge-bg:${project.iconBadgeBg}`);
    }

    const badgeStyleAttr = badgeVars.length ? ` style="${badgeVars.join(";")}"` : "";

    return `
      <span class="${baseClass}" aria-hidden="true"${badgeStyleAttr}>
        <img class="${fitClass}" src="${escapeHtml(project.icon)}" alt="" loading="lazy"${styleAttr} />
      </span>
    `;
  }

  return `
    <span class="${baseClass} project-logo-badge--fallback" aria-hidden="true">
      <span class="project-logo-fallback">${escapeHtml(getProjectMark(project.title))}</span>
    </span>
  `;
}

function renderProjectTiles() {
  if (!els.projectsGrid) return;

  const groupOrder = [
    { key: "work", label: "Work" },
    { key: "personal", label: "Personal" },
  ];

  let tileIndex = 0;

  els.projectsGrid.innerHTML = groupOrder
    .map((group) => {
      const projects = data.projects.filter((project) => (project.projectGroup || "personal") === group.key);

      if (!projects.length) return "";

      const tiles = projects
        .map((project) => {
          const iconBadge = renderProjectIconBadge(project, "tile");
          const currentIndex = tileIndex++;

          return `
            <button class="card project-tile reveal" style="--stagger-index:${currentIndex}" type="button" data-open-project="${escapeHtml(
              project.slug
            )}" aria-label="Open ${escapeHtml(project.title)} project details">
              <div class="project-art" style="--art-a:${escapeHtml(project.palette.a)};--art-b:${escapeHtml(
                project.palette.b
              )};" aria-hidden="true">
                ${iconBadge}
                <span class="project-tile-title">${escapeHtml(project.title)}</span>
              </div>
            </button>
          `;
        })
        .join("");

      return `
        <section class="project-group" aria-labelledby="projects-group-${escapeHtml(group.key)}">
          <div class="project-group-head">
            <h3 class="project-group-title" id="projects-group-${escapeHtml(group.key)}">${escapeHtml(group.label)}</h3>
          </div>
          <div class="projects-grid-cluster projects-grid--compact">
            ${tiles}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderProjectDetail(project) {
  if (!els.projectDetail || !project) return;

  const iconBadge = renderProjectIconBadge(project, "detail");
  const stackChips = project.stack
    .map((item) => renderProjectStackChip(item))
    .join("");

  const approachItems = project.approach.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const outcomeItems = project.outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const media =
    project.media && project.media.type === "video"
      ? `
        <section class="project-detail-panel project-detail-panel--media">
          <h4>Preview</h4>
          <div class="project-detail-media">
            <video class="project-video" controls preload="metadata" playsinline>
              <source src="${escapeHtml(project.media.src)}" />
              Your browser does not support embedded videos.
            </video>
            <a class="project-video-link" href="${escapeHtml(
              project.media.src
            )}" target="_blank" rel="noreferrer">${escapeHtml(
              project.media.fallbackLabel || "Open media"
            )}</a>
          </div>
        </section>
      `
      : project.media && project.media.type === "slideshow"
        ? `
        <section class="project-detail-panel project-detail-panel--media">
          <h4>Preview</h4>
          <div
            class="project-detail-media project-detail-media--slideshow"
            data-project-slideshow
            data-slide-count="${escapeHtml(String((project.media.slides || []).length || 1))}"
            data-current-slide="0"
            data-autoplay-ms="${escapeHtml(String(project.media.autoplayMs || 0))}"
          >
            <div class="project-slideshow-viewport">
              <div class="project-slideshow-dots" aria-label="Slideshow navigation">
                ${(project.media.slides || [])
                  .map(
                    (_, index) => `
                    <button
                      class="project-slideshow-dot${index === 0 ? " is-active" : ""}"
                      type="button"
                      data-project-slide-dot="${index}"
                      aria-label="Go to slide ${index + 1}"
                      aria-pressed="${index === 0 ? "true" : "false"}"
                    ></button>
                  `
                  )
                  .join("")}
              </div>
              <button
                class="project-slideshow-nav project-slideshow-nav--prev"
                type="button"
                data-project-slide-prev="true"
                aria-label="Previous slide"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M14.5 5.5L8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </button>
              <div class="project-slideshow-track" data-project-slides-track>
                ${(project.media.slides || [])
                  .map(
                    (slide, index) => `
                      <figure class="project-slide">
                        <img
                          class="project-slide-image"
                          src="${escapeHtml(slide.src)}"
                          alt="${escapeHtml(slide.alt || `${project.title} slide ${index + 1}`)}"
                          loading="lazy"
                        />
                      </figure>
                    `
                  )
                  .join("")}
              </div>
              <button
                class="project-slideshow-nav project-slideshow-nav--next"
                type="button"
                data-project-slide-next="true"
                aria-label="Next slide"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M9.5 5.5L16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </button>
            </div>
          </div>
        </section>
      `
      : "";

  const demoLink = project.demoUrl
    ? `<a class="btn btn-primary project-detail-demo-btn" href="${escapeHtml(
        project.demoUrl
      )}" target="_blank" rel="noreferrer">
        <span>Live Demo</span>
        <svg class="project-detail-demo-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M14 5h5v5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.85"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M10 14L19 5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.85"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.85"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </a>`
    : "";

  els.projectDetail.innerHTML = `
    <div class="project-detail-top">
      <button class="btn btn-ghost project-back-btn" type="button" data-project-back="true" id="project-back-button">
        <span class="project-back-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M19 12H6"
              fill="none"
              stroke="currentColor"
              stroke-width="2.1"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M11.5 6.5L6 12l5.5 5.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.1"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
        <span>Back to all projects</span>
      </button>
    </div>

    <section class="project-detail-panel project-detail-panel--overview">
      <div class="project-detail-head">
        <div class="project-detail-head-main">
          ${iconBadge}
          <h3 class="project-detail-title">${escapeHtml(project.title)}</h3>
        </div>
        ${demoLink}
      </div>
      <div class="project-detail-copy-grid">
        <div class="project-detail-copy-block">
          <h4>Overview</h4>
          <p class="project-detail-summary">${escapeHtml(project.summary)}</p>
        </div>
        <div class="project-detail-copy-block">
          <h4>Impact</h4>
          <p class="project-detail-impact">${escapeHtml(project.impact)}</p>
        </div>
      </div>
    </section>

    ${media}

    <div class="project-detail-columns">
      <div class="project-detail-block project-detail-panel">
        <h4>Approach</h4>
        <ul>${approachItems}</ul>
      </div>
      <div class="project-detail-block project-detail-panel">
        <h4>Outcomes</h4>
        <ul>${outcomeItems}</ul>
      </div>
    </div>

    <section class="project-detail-panel">
      <h4>Tech Stack</h4>
      <div class="project-detail-stack">${stackChips}</div>
    </section>
  `;
}

function openProjectDetail(slug) {
  const project = getProjectBySlug(slug);
  if (!project || !els.projectsBrowser || !els.projectDetail) return;

  state.previousProjectFocus = document.activeElement;
  state.activeProjectSlug = slug;

  renderProjectDetail(project);
  bindProjectMedia(project);
  els.projectDetail.hidden = false;
  els.projectsBrowser.classList.add("is-detail-open");

  const backButton = document.getElementById("project-back-button");
  if (backButton) {
    requestAnimationFrame(() => backButton.focus());
  }
}

function closeProjectDetail() {
  if (!els.projectsBrowser || !els.projectDetail) return;

  clearProjectMediaAutoplay();
  state.activeProjectSlug = null;
  els.projectDetail.hidden = true;
  els.projectDetail.innerHTML = "";
  els.projectsBrowser.classList.remove("is-detail-open");

  if (state.previousProjectFocus && typeof state.previousProjectFocus.focus === "function") {
    state.previousProjectFocus.focus();
  }
}

function bindProjectBrowser() {
  document.addEventListener("click", (event) => {
    const openTarget = event.target.closest("[data-open-project]");
    if (openTarget) {
      const slug = openTarget.getAttribute("data-open-project");
      if (slug) openProjectDetail(slug);
      return;
    }

    const backTarget = event.target.closest("[data-project-back='true']");
    if (backTarget) {
      closeProjectDetail();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.activeProjectSlug) {
      closeProjectDetail();
    }
  });
}

function renderExperience() {
  if (!els.experienceTimeline) return;

  els.experienceTimeline.innerHTML = data.experience
    .map((item, index) => {
      const hasPositions = Array.isArray(item.positions) && item.positions.length > 0;
      const positionBlocks = hasPositions
        ? item.positions
            .map((position) => {
              return `
                <article class="timeline-role-card">
                  <div class="timeline-role-head">
                    <h4>${escapeHtml(position.title)}</h4>
                    <p class="timeline-role-period">${escapeHtml(position.period)}</p>
                  </div>
                </article>
              `;
            })
            .join("")
        : "";
      const nestedRoles = positionBlocks.length
        ? `<div class="timeline-role-group" aria-label="Roles at ${escapeHtml(item.organization)}">${positionBlocks}</div>`
        : "";
      const companySummary = item.companySummary
        ? `<p class="timeline-company-summary">${escapeHtml(item.companySummary)}</p>`
        : "";
      const timelineTitle =
        item.headingOnlyOrganization || !item.role ? item.organization : `${item.role} · ${item.organization}`;

      return `
        <article class="timeline-entry reveal" style="--stagger-index:${index}" data-timeline-index="${index}">
          <div class="timeline-marker">
            <img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.organization)} logo" loading="lazy" />
          </div>

          <div class="card section-panel timeline-card">
            <div class="timeline-head">
              <h3>${escapeHtml(timelineTitle)}</h3>
              <p class="timeline-period">${escapeHtml(item.period)}</p>
            </div>

            <p class="timeline-location">${escapeHtml(item.location)}</p>
            ${companySummary}
            ${nestedRoles}
          </div>
        </article>
      `;
    })
    .join("");
}

function observeRevealElements() {
  const revealElements = Array.from(document.querySelectorAll(".reveal"));

  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealElements.forEach((element) => {
    if (!element.classList.contains("visible")) {
      revealObserver.observe(element);
    }
  });
}

function setActiveNavLink(id) {
  els.navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${id}`);
  });

  if (els.body) {
    els.body.setAttribute("data-active-section", id || "");
  }
}

function renderSectionHero(sectionId) {
  const page = SECTION_PAGE_CONTENT[sectionId] || SECTION_PAGE_CONTENT.about;

  if (els.heroEyebrow) {
    els.heroEyebrow.textContent = page.eyebrow;
  }

  if (els.heroTitle) {
    els.heroTitle.textContent = page.title;
  }

  if (els.heroHeadline) {
    els.heroHeadline.textContent = page.headline;
  }

  if (els.heroSubline) {
    els.heroSubline.textContent = page.subline;
  }

  if (els.heroTags) {
    els.heroTags.setAttribute("aria-label", `${page.title} focus areas`);
    els.heroTags.innerHTML = page.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  }

  if (els.heroActions) {
    els.heroActions.hidden = page.actions.length === 0;
    els.heroActions.innerHTML = page.actions
      .map((action) => {
        const className = action.variant === "primary" ? "btn btn-primary" : "btn btn-ghost";

        if (action.target) {
          return `<a class="${className}" href="#${escapeHtml(action.target)}" data-content-target="${escapeHtml(
            action.target
          )}">${escapeHtml(action.label)}</a>`;
        }

        const downloadAttr = action.download ? " download" : "";
        return `<a class="${className}" href="${escapeHtml(action.href)}"${downloadAttr}>${escapeHtml(
          action.label
        )}</a>`;
      })
      .join("");
  }
}

function setActiveContentSection(sectionId) {
  const nextId = els.sections.some((section) => section.id === sectionId) ? sectionId : "about";
  state.activeSectionId = nextId;
  renderSectionHero(nextId);

  els.sections.forEach((section) => {
    const isActive = section.id === nextId;
    section.hidden = !isActive;
    section.classList.toggle("content-section--active", isActive);
    if (isActive) {
      section.classList.add("visible");
    }
  });

  if (els.heroSection) {
    els.heroSection.classList.add("visible");
  }

  if (nextId !== "projects" && state.activeProjectSlug) {
    closeProjectDetail();
  }

  updateTimelineProgress();
}

function observeActiveSection() {
  if (!els.sections.length) return;

  let rafPending = false;

  const updateActiveSection = () => {
    if (state.view !== VIEW.CONTENT) {
      rafPending = false;
      return;
    }

    const headerHeight = els.header ? els.header.offsetHeight : 0;
    const probeLine = headerHeight + 18;

    if (state.lockedNavId) {
      const lockedSection = document.getElementById(state.lockedNavId);
      const lockElapsed = performance.now() - state.lockedNavAt;

      if (lockedSection) {
        const lockedTop = lockedSection.getBoundingClientRect().top;
        const isNearTarget = Math.abs(lockedTop - probeLine) <= 28;
        const lockExpired = lockElapsed > 1200;

        if (!isNearTarget && !lockExpired) {
          setActiveNavLink(state.lockedNavId);
          rafPending = false;
          return;
        }
      }

      state.lockedNavId = null;
      state.lockedNavAt = 0;
    }

    let activeId = els.sections[0].id;

    els.sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= probeLine) {
        activeId = section.id;
      }
    });

    setActiveNavLink(activeId);
    rafPending = false;
  };

  const onViewportChange = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(updateActiveSection);
  };

  updateActiveSection();
  window.addEventListener("scroll", onViewportChange, { passive: true });
  window.addEventListener("resize", onViewportChange);
}

function scrollToSection(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;

  const headerHeight = els.header ? els.header.offsetHeight : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 14;

  window.scrollTo({
    top,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

function bindNavigation() {
  els.navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      event.preventDefault();
      const sectionId = href.slice(1);
      showContentView(sectionId);
    });
  });

  if (els.brand) {
    els.brand.addEventListener("click", (event) => {
      if (state.view !== VIEW.CONTENT) return;
      event.preventDefault();
      showContentView("about");
    });
  }
}

function bindContentRouteLinks() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-content-target]");
    if (!link) return;

    const sectionId = link.getAttribute("data-content-target");
    if (!sectionId) return;

    event.preventDefault();
    showContentView(sectionId);
  });
}

function updateHeaderState() {
  if (!els.header) return;
  if (state.view !== VIEW.CONTENT) {
    els.header.classList.remove("is-scrolled");
    return;
  }
  els.header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function openMobileNav() {
  if (!els.header || !els.navToggle) return;
  els.header.classList.add("nav-open");
  els.navToggle.setAttribute("aria-expanded", "true");
}

function closeMobileNav() {
  if (!els.header || !els.navToggle) return;
  els.header.classList.remove("nav-open");
  els.navToggle.setAttribute("aria-expanded", "false");
}

function bindMobileNav() {
  if (!els.navToggle) return;

  els.navToggle.addEventListener("click", () => {
    const isOpen = els.header.classList.contains("nav-open");
    if (isOpen) closeMobileNav();
    else openMobileNav();
  });

  document.addEventListener("click", (event) => {
    if (!els.header.classList.contains("nav-open")) return;
    if (els.header.contains(event.target)) return;
    closeMobileNav();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });
}

function updateTimelineProgress() {
  if (!els.experienceTimeline || state.view !== VIEW.CONTENT) return;

  if (!state.activeTimelineEntry) {
    setTimelineFillHeight(0);
    return;
  }

  setTimelineFillHeight(getTimelineFillHeightForEntry(state.activeTimelineEntry));
}

function bindTimelineHoverProgress() {
  if (!els.experienceTimeline) return;

  els.experienceTimeline.addEventListener("mousemove", (event) => {
    const entry = getInteractiveTimelineEntry(event.target);

    if (!entry) {
      if (!state.activeTimelineEntry) return;

      state.activeTimelineEntry = null;
      updateTimelineProgress();
      return;
    }

    if (state.activeTimelineEntry === entry) return;
    activateTimelineEntry(entry);
  });

  els.experienceTimeline.addEventListener("focusin", (event) => {
    const entry = getInteractiveTimelineEntry(event.target) || event.target.closest(".timeline-entry");
    if (!entry) return;

    activateTimelineEntry(entry);
  });

  els.experienceTimeline.addEventListener("click", (event) => {
    const entry = getInteractiveTimelineEntry(event.target);
    if (!entry) return;

    activateTimelineEntry(entry);
  });

  els.experienceTimeline.addEventListener("mouseleave", () => {
    if (!state.activeTimelineEntry) return;

    state.activeTimelineEntry = null;
    updateTimelineProgress();
  });

  els.experienceTimeline.addEventListener("focusout", (event) => {
    if (event.relatedTarget && els.experienceTimeline.contains(event.relatedTarget)) return;

    state.activeTimelineEntry = null;
    updateTimelineProgress();
  });
}

function bindHeroParallax() {
  if (!els.heroScene || prefersReducedMotion) return;

  const updateByPointer = (clientX, clientY, rect) => {
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;

    els.heroScene.style.setProperty("--pointer-x", x.toFixed(3));
    els.heroScene.style.setProperty("--pointer-y", y.toFixed(3));
  };

  const heroSection = els.heroSection;
  if (!heroSection) return;

  heroSection.addEventListener("pointermove", (event) => {
    const rect = heroSection.getBoundingClientRect();
    updateByPointer(event.clientX, event.clientY, rect);
  });

  heroSection.addEventListener("pointerleave", () => {
    els.heroScene.style.setProperty("--pointer-x", "0");
    els.heroScene.style.setProperty("--pointer-y", "0");
  });

  const updateScrollParallax = () => {
    const rect = heroSection.getBoundingClientRect();
    const offset = Math.max(-32, Math.min(32, rect.top * -0.04));
    els.heroScene.style.setProperty("--scroll-shift", `${offset.toFixed(2)}px`);
  };

  window.addEventListener("scroll", updateScrollParallax, { passive: true });
  updateScrollParallax();
}

function bindContactForm() {
  if (!els.contactForm || !els.formStatus) return;

  els.contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!els.contactForm.reportValidity()) {
      setFormStatus("Please complete all required fields.", "error");
      return;
    }

    if (!isContactFormConfigured()) {
      setFormStatus("Contact form is not configured yet. Add your Formspree endpoint before deploying.", "error");
      return;
    }

    const formData = new FormData(els.contactForm);
    formData.set("_subject", CONTACT_FORM_CONFIG.subject);

    if (els.contactSubmit) {
      els.contactSubmit.disabled = true;
      els.contactSubmit.textContent = "Sending...";
    }

    setFormStatus("Sending your message...");

    try {
      const response = await fetch(CONTACT_FORM_CONFIG.endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          Array.isArray(result && result.errors) && result.errors.length
            ? result.errors.map((error) => error.message).join(", ")
            : "There was a problem sending your message. Please try again.";
        throw new Error(errorMessage);
      }

      els.contactForm.reset();
      setFormStatus("Message sent successfully. I’ll get back to you soon.", "success");
    } catch (error) {
      setFormStatus(error instanceof Error ? error.message : "Unable to send your message right now.", "error");
    } finally {
      if (els.contactSubmit) {
        els.contactSubmit.disabled = false;
        els.contactSubmit.textContent = "Send Message";
      }
    }
  });
}

function bindCursorAura() {
  if (!els.body || !els.cursorTrailLayer || prefersReducedMotion) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let rafPending = false;
  let pointerX = 50;
  let pointerY = 50;
  const trailSpacing = 26;
  const trailMinDistance = 0.8;
  const trailPauseReset = 160;
  const maxSegments = 90;

  const commit = () => {
    els.body.style.setProperty("--cursor-x", `${pointerX.toFixed(2)}%`);
    els.body.style.setProperty("--cursor-y", `${pointerY.toFixed(2)}%`);
    rafPending = false;
  };

  const appendTrailSegment = (x, y, angle) => {
    const segment = document.createElement("span");
    segment.className = "cursor-trail-segment";
    segment.style.setProperty("--trail-x", `${x.toFixed(2)}px`);
    segment.style.setProperty("--trail-y", `${y.toFixed(2)}px`);
    segment.style.setProperty("--trail-angle", `${angle.toFixed(2)}deg`);
    els.cursorTrailLayer.append(segment);
    segment.addEventListener("animationend", () => segment.remove(), { once: true });

    if (els.cursorTrailLayer.childElementCount > maxSegments) {
      els.cursorTrailLayer.firstElementChild?.remove();
    }
  };

  const updateTrail = (clientX, clientY) => {
    const now = performance.now();
    const lastX = state.cursorTrail.lastX;
    const lastY = state.cursorTrail.lastY;

    if (!state.cursorTrail.enabled) {
      return;
    }

    if (now < state.cursorTrail.suppressedUntil) {
      return;
    }

    if (lastX === null || lastY === null || now - state.cursorTrail.lastSpawnAt > trailPauseReset) {
      state.cursorTrail.lastX = clientX;
      state.cursorTrail.lastY = clientY;
      state.cursorTrail.lastSpawnAt = now;
      state.cursorTrail.distanceCarry = 0;
      return;
    }

    const dx = clientX - lastX;
    const dy = clientY - lastY;
    const distance = Math.hypot(dx, dy);

    if (distance < trailMinDistance) {
      return;
    }

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    let carry = state.cursorTrail.distanceCarry;
    let distanceUntilNext = trailSpacing - carry;

    if (distanceUntilNext <= 0) {
      distanceUntilNext = trailSpacing;
      carry = 0;
    }

    if (distance >= distanceUntilNext) {
      let traveled = distanceUntilNext;

      while (traveled <= distance) {
        const progress = traveled / distance;
        appendTrailSegment(lastX + dx * progress, lastY + dy * progress, angle);
        traveled += trailSpacing;
      }

      carry = distance - (traveled - trailSpacing);
    } else {
      carry += distance;
    }

    state.cursorTrail.lastX = clientX;
    state.cursorTrail.lastY = clientY;
    state.cursorTrail.lastAngle = angle;
    state.cursorTrail.lastSpawnAt = now;
    state.cursorTrail.distanceCarry = carry;
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      if (state.view !== VIEW.MAP) {
        clearCursorTrail();
        return;
      }

      pointerX = (event.clientX / window.innerWidth) * 100;
      pointerY = (event.clientY / window.innerHeight) * 100;
      updateTrail(event.clientX, event.clientY);
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(commit);
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", clearCursorTrail);
  window.addEventListener("blur", clearCursorTrail);
}

function bindSurfaceEffects() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const selector = ".card, .project-tile, .connect-link, .timeline-role-card";

  const attach = () => {
    const surfaces = Array.from(document.querySelectorAll(selector));

    surfaces.forEach((surface) => {
      if (surface.dataset.surfaceBound === "true") return;
      surface.dataset.surfaceBound = "true";

      surface.addEventListener("pointermove", (event) => {
        const rect = surface.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const tiltX = (0.5 - y) * 5.6;
        const tiltY = (x - 0.5) * 5.6;

        surface.style.setProperty("--surface-tilt-x", `${tiltX.toFixed(2)}deg`);
        surface.style.setProperty("--surface-tilt-y", `${tiltY.toFixed(2)}deg`);
        surface.style.setProperty("--surface-glow-x", `${(x * 100).toFixed(2)}%`);
        surface.style.setProperty("--surface-glow-y", `${(y * 100).toFixed(2)}%`);
      });

      surface.addEventListener("pointerleave", () => {
        surface.style.removeProperty("--surface-tilt-x");
        surface.style.removeProperty("--surface-tilt-y");
        surface.style.removeProperty("--surface-glow-x");
        surface.style.removeProperty("--surface-glow-y");
      });
    });
  };

  attach();
  const observer = new MutationObserver(attach);
  observer.observe(document.body, { childList: true, subtree: true });
}

function bindGsapMotion() {
  if (prefersReducedMotion) return;
  if (!window.gsap) return;

  try {
    const gsap = window.gsap;
    const scrollTrigger = window.ScrollTrigger;
    if (scrollTrigger) gsap.registerPlugin(scrollTrigger);

    const heroItems = Array.from(document.querySelectorAll(".hero-content > *"));
    if (heroItems.length) {
      gsap.from(heroItems, {
        y: 24,
        autoAlpha: 0,
        duration: 0.72,
        ease: "power2.out",
        stagger: 0.08,
        clearProps: "all",
      });
    }

    if (!scrollTrigger) return;

    const sections = Array.from(document.querySelectorAll(".content-section"));
    sections.forEach((section) => {
      gsap.from(section, {
        y: 28,
        autoAlpha: 0,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
        clearProps: "transform,opacity,visibility",
      });
    });

    const projectTiles = Array.from(document.querySelectorAll(".project-tile"));
    if (projectTiles.length) {
      gsap.from(projectTiles, {
        y: 30,
        autoAlpha: 0,
        duration: 0.58,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: "#projects-grid",
          start: "top 78%",
          once: true,
        },
        clearProps: "transform,opacity,visibility",
      });
    }

    const timelineEntries = Array.from(document.querySelectorAll(".timeline-entry"));
    if (timelineEntries.length) {
      gsap.from(timelineEntries, {
        x: -16,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: "#experience",
          start: "top 78%",
          once: true,
        },
        clearProps: "transform,opacity,visibility",
      });
    }
  } catch (error) {
    console.warn("[gsap] motion hooks disabled:", error);
  }
}

function bindScrollHandlers() {
  const onScroll = () => {
    updateHeaderState();
    updateTimelineProgress();

    if (els.body) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      els.body.style.setProperty("--page-progress", progress.toFixed(4));
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function init() {
  setMapWorldSize();
  resetTransitionVisuals();
  setViewMode(VIEW.INTRO);
  fitMapToViewport();

  renderSkills();
  renderProjectTiles();
  renderExperience();
  setActiveContentSection("about");
  restoreCursorTrailPreference();

  observeRevealElements();

  bindIntroExperience();
  bindMapInteractions();
  bindNavigation();
  bindContentRouteLinks();
  bindMobileNav();
  bindProjectBrowser();
  bindTimelineHoverProgress();
  bindHeroParallax();
  bindContactForm();
  bindCursorAura();
  bindGsapMotion();
  bindScrollHandlers();

  const initialHash = window.location.hash;
  const hasSectionHash =
    Boolean(initialHash) &&
    els.sections.some((section) => `#${section.id}`.toLowerCase() === initialHash.toLowerCase());

  if (hasSectionHash) {
    showContentView(initialHash.slice(1));
  }

  window.addEventListener("resize", () => {
    if (performance.now() < state.mapWarmup.freezeUntil) {
      return;
    }
    cacheViewportSize();
    if (state.view === VIEW.MAP || state.view === VIEW.INTRO) {
      if (!state.mapInteracted) {
        fitMapToViewport();
      } else {
        setCameraTarget(state.camera.targetX, state.camera.targetY, state.camera.targetScale);
      }
      return;
    }

    if (state.view === VIEW.CONTENT) {
      updateContentMapBackdrop();
    }
  });

  warmMapForTransition()
    .then(() => primeInitialMapState())
    .catch(() => {})
    .finally(() => {
      setReady();
    });
}

init();
