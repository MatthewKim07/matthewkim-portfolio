const data = window.PORTFOLIO_DATA || { skills: [], projects: [], experience: [] };
const mapLocations = Array.isArray(window.EXPEDITION_MAP_LOCATIONS)
  ? window.EXPEDITION_MAP_LOCATIONS
  : [];
const mapMeta = window.EXPEDITION_MAP_META || { width: 3000, height: 1900 };

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DEBUG_TRANSITION = false;

const VIEW = {
  INTRO: "intro",
  TRANSITIONING: "transitioning",
  MAP: "map",
  CONTENT: "content",
};

const state = {
  activeProjectSlug: null,
  previousProjectFocus: null,
  lockedNavId: null,
  lockedNavAt: 0,
  view: VIEW.INTRO,
  introTransitioning: false,
  mapInteracted: false,
  camera: {
    x: 0,
    y: 0,
    scale: 1,
    minScale: 0.7,
    maxScale: 2.45,
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
    duration: 1600,
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
  mapPinsLayer: document.getElementById("map-pins-layer"),
  mapReset: document.getElementById("map-reset"),
  mapIntro: document.getElementById("map-intro"),
  returnToMap: document.getElementById("return-to-map"),

  siteShell: document.querySelector(".site-shell"),
  header: document.getElementById("site-header"),
  navToggle: document.getElementById("nav-toggle"),
  navLinks: Array.from(document.querySelectorAll(".main-nav a")),
  sections: Array.from(document.querySelectorAll("main section[id]")),
  heroScene: document.querySelector(".hero-scene"),
  skillsGrid: document.getElementById("skills-grid"),
  projectsBrowser: document.getElementById("projects-browser"),
  projectsGrid: document.getElementById("projects-grid"),
  projectDetail: document.getElementById("project-detail"),
  experienceTimeline: document.getElementById("experience-timeline"),
  contactForm: document.getElementById("contact-form"),
  formStatus: document.getElementById("form-status"),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

function setReady() {
  requestAnimationFrame(() => {
    els.body.classList.add("is-ready");
  });
}

function setViewMode(view) {
  state.view = view;
  if (els.body) {
    els.body.setAttribute("data-view", view);
  }

  const introVisible = view === VIEW.INTRO || view === VIEW.TRANSITIONING;
  const mapVisible = view !== VIEW.CONTENT;
  const contentVisible = view === VIEW.CONTENT;

  if (els.introGate) {
    els.introGate.hidden = !introVisible;
  }

  if (els.mapGate) {
    els.mapGate.hidden = !mapVisible;
  }

  if (els.siteShell) {
    els.siteShell.classList.toggle("shell-hidden", !contentVisible);
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

  showMapView({ focusPins: true });
  resetTransitionVisuals();
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
    const shake = computeLandingShake(progress, elapsed);

    applyTransitionVisuals(progress, motion, shake.x, shake.y);
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
      state.transition.duration = 1600;
      finishTransitionToMap();
      return;
    }

    state.transition.rafId = requestAnimationFrame(step);
  };

  state.transition.rafId = requestAnimationFrame(step);
}

function setMapWorldSize() {
  if (els.mapWorld) {
    els.mapWorld.style.width = `${mapMeta.width}px`;
    els.mapWorld.style.height = `${mapMeta.height}px`;
  }

  if (els.mapPinsLayer) {
    els.mapPinsLayer.style.width = `${mapMeta.width}px`;
    els.mapPinsLayer.style.height = `${mapMeta.height}px`;
  }
}

function getViewportSize() {
  if (!els.mapViewport) return { width: 1, height: 1 };
  const rect = els.mapViewport.getBoundingClientRect();
  return { width: Math.max(1, rect.width), height: Math.max(1, rect.height) };
}

function clampCamera(x, y, scale) {
  const { width: viewportWidth, height: viewportHeight } = getViewportSize();
  const worldWidth = mapMeta.width * scale;
  const worldHeight = mapMeta.height * scale;
  const padding = 80;

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

  return { x: nextX, y: nextY, scale };
}

function applyCamera() {
  if (!els.mapWorld) return;
  const clamped = clampCamera(state.camera.x, state.camera.y, state.camera.scale);
  state.camera.x = clamped.x;
  state.camera.y = clamped.y;
  state.camera.scale = clamped.scale;
  els.mapWorld.style.transform = `translate3d(${clamped.x}px, ${clamped.y}px, 0) scale(${clamped.scale})`;
}

function fitMapToViewport() {
  const { width, height } = getViewportSize();
  const baseScale = Math.min(width / mapMeta.width, height / mapMeta.height) * 0.94;
  state.camera.scale = clamp(baseScale, state.camera.minScale, state.camera.maxScale);
  state.camera.x = (width - mapMeta.width * state.camera.scale) / 2;
  state.camera.y = (height - mapMeta.height * state.camera.scale) / 2;
  applyCamera();
}

function zoomAt(clientX, clientY, nextScale) {
  if (!els.mapViewport) return;
  const rect = els.mapViewport.getBoundingClientRect();
  const px = clientX - rect.left;
  const py = clientY - rect.top;

  const targetScale = clamp(nextScale, state.camera.minScale, state.camera.maxScale);
  const worldX = (px - state.camera.x) / state.camera.scale;
  const worldY = (py - state.camera.y) / state.camera.scale;

  state.camera.scale = targetScale;
  state.camera.x = px - worldX * targetScale;
  state.camera.y = py - worldY * targetScale;
  applyCamera();
}

function animateCameraTo(x, y, scale, duration = 780) {
  if (prefersReducedMotion) {
    state.camera.x = x;
    state.camera.y = y;
    state.camera.scale = scale;
    applyCamera();
    return Promise.resolve();
  }

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
      applyCamera();

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(tick);
  });
}

function setActiveMapPin(sectionId) {
  const pins = Array.from(document.querySelectorAll(".map-pin"));
  pins.forEach((pin) => {
    pin.classList.toggle("is-active", pin.dataset.section === sectionId);
  });
}

function renderMapPins() {
  if (!els.mapPinsLayer) return;

  els.mapPinsLayer.innerHTML = mapLocations
    .map((location) => {
      return `
        <button
          class="map-pin"
          type="button"
          data-section="${escapeHtml(location.sectionId)}"
          style="left:${location.x}px;top:${location.y}px;--pin-color:${escapeHtml(location.color || "#cba36d")};"
          aria-label="Open ${escapeHtml(location.label)}"
        >
          <span class="map-pin-dot" aria-hidden="true"></span>
          <span class="map-pin-label">${escapeHtml(location.label)}</span>
        </button>
      `;
    })
    .join("");
}

function findMapLocation(sectionId) {
  return mapLocations.find((location) => location.sectionId === sectionId);
}

function showMapView(options = {}) {
  const { focusPins = false } = options;
  setViewMode(VIEW.MAP);
  window.scrollTo({ top: 0, behavior: "auto" });

  if (!state.mapInteracted) {
    fitMapToViewport();
  } else {
    applyCamera();
  }

  if (focusPins) {
    const firstPin = document.querySelector(".map-pin");
    if (firstPin) {
      requestAnimationFrame(() => firstPin.focus());
    }
  }
}

function showContentView(sectionId) {
  setViewMode(VIEW.CONTENT);
  const targetId = `#${sectionId}`;

  if (window.history && typeof window.history.replaceState === "function") {
    window.history.replaceState(null, "", targetId);
  }

  state.lockedNavId = sectionId;
  state.lockedNavAt = performance.now();
  setActiveNavLink(sectionId);
  scrollToSection(targetId);
}

function flyToSection(sectionId) {
  const location = findMapLocation(sectionId);

  if (!location) {
    showContentView(sectionId);
    return;
  }

  setActiveMapPin(sectionId);
  const { width, height } = getViewportSize();
  const scale = clamp(location.focusScale || 1.36, state.camera.minScale, state.camera.maxScale);
  const x = width * 0.5 - location.x * scale;
  const y = height * 0.44 - location.y * scale;

  animateCameraTo(x, y, scale).then(() => {
    showContentView(sectionId);
  });
}

function bindIntroExperience() {
  if (!els.introGate) return;

  const continueToMap = () => {
    if (state.view !== VIEW.INTRO || state.introTransitioning) return;
    state.introTransitioning = true;
    setViewMode(VIEW.TRANSITIONING);

    if (prefersReducedMotion) {
      runReducedMotionTransition();
      return;
    }

    runTransitionTimeline();
  };

  if (els.introContinue) {
    els.introContinue.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      continueToMap();
    });
  }

  els.introGate.addEventListener("click", (event) => {
    if (event.target.closest(".intro-continue")) return;
    continueToMap();
  });

  window.addEventListener("keydown", (event) => {
    if (state.view !== VIEW.INTRO) return;
    if (event.key !== "Enter") return;
    event.preventDefault();
    continueToMap();
  });

  if (!els.introIllustration) return;
  const layers = Array.from(els.introIllustration.querySelectorAll(".intro-parallax"));
  layers.forEach((layer) => {
    const depth = clamp(Number(layer.getAttribute("data-depth") || 0.1), 0.04, 0.42);
    layer.style.setProperty("--depth", depth.toFixed(3));
  });
}

function bindMapInteractions() {
  if (!els.mapViewport || !els.mapWorld) return;

  renderMapPins();

  if (els.mapReset) {
    els.mapReset.addEventListener("click", () => {
      if (state.view !== VIEW.MAP) return;
      state.mapInteracted = false;
      fitMapToViewport();
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
      setViewMode(VIEW.INTRO);
      window.scrollTo({ top: 0, behavior: "auto" });
      if (els.introContinue) {
        requestAnimationFrame(() => els.introContinue.focus());
      }
    });
  }

  if (els.returnToMap) {
    els.returnToMap.addEventListener("click", () => {
      showMapView({ focusPins: true });
    });
  }

  if (els.mapPinsLayer) {
    els.mapPinsLayer.addEventListener("click", (event) => {
      if (state.view !== VIEW.MAP) return;
      const pin = event.target.closest(".map-pin");
      if (!pin) return;
      const sectionId = pin.getAttribute("data-section");
      if (!sectionId) return;
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
      state.mapInteracted = true;
      flyToSection(sectionId);
    });
  }

  els.mapViewport.addEventListener(
    "wheel",
    (event) => {
      if (state.view !== VIEW.MAP) return;
      event.preventDefault();
      state.mapInteracted = true;
      const factor = event.deltaY < 0 ? 1.11 : 0.89;
      zoomAt(event.clientX, event.clientY, state.camera.scale * factor);
    },
    { passive: false }
  );

  els.mapViewport.addEventListener("pointerdown", (event) => {
    if (state.view !== VIEW.MAP) return;
    if (event.button !== 0) return;
    if (event.target.closest(".map-pin")) return;

    state.drag.active = true;
    state.drag.pointerId = event.pointerId;
    state.drag.startX = event.clientX;
    state.drag.startY = event.clientY;
    state.drag.startCamX = state.camera.x;
    state.drag.startCamY = state.camera.y;
    state.mapInteracted = true;

    els.mapViewport.classList.add("is-dragging");
    els.mapViewport.setPointerCapture(event.pointerId);
  });

  els.mapViewport.addEventListener("pointermove", (event) => {
    if (!state.drag.active) return;
    if (event.pointerId !== state.drag.pointerId) return;

    const dx = event.clientX - state.drag.startX;
    const dy = event.clientY - state.drag.startY;

    state.camera.x = state.drag.startCamX + dx;
    state.camera.y = state.drag.startCamY + dy;
    applyCamera();
  });

  const endDrag = (event) => {
    if (!state.drag.active) return;
    if (event.pointerId !== state.drag.pointerId) return;

    state.drag.active = false;
    state.drag.pointerId = null;
    els.mapViewport.classList.remove("is-dragging");
  };

  els.mapViewport.addEventListener("pointerup", endDrag);
  els.mapViewport.addEventListener("pointercancel", endDrag);

  window.addEventListener("keydown", (event) => {
    if (state.view !== VIEW.MAP) return;

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      const { width, height } = getViewportSize();
      zoomAt(width / 2, height / 2, state.camera.scale * 1.08);
      return;
    }

    if (event.key === "-") {
      event.preventDefault();
      const { width, height } = getViewportSize();
      zoomAt(width / 2, height / 2, state.camera.scale * 0.92);
    }
  });
}

function renderSkills() {
  if (!els.skillsGrid) return;

  els.skillsGrid.innerHTML = data.skills
    .map((group) => {
      const chips = group.items
        .map((item) => `<li><span class="skill-chip">${escapeHtml(item.name)}</span></li>`)
        .join("");

      return `
        <article class="card toolkit-card reveal">
          <h3>${escapeHtml(group.category)}</h3>
          <ul class="skill-list">${chips}</ul>
        </article>
      `;
    })
    .join("");
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

function renderProjectIconBadge(project, variant = "tile") {
  const baseClass =
    variant === "detail" ? "project-logo-badge project-logo-badge--detail" : "project-logo-badge";

  if (project.icon) {
    const fitClass =
      project.iconFit === "contain" ? "project-logo-image project-logo-image--contain" : "project-logo-image";
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

  els.projectsGrid.innerHTML = data.projects
    .map((project) => {
      const iconBadge = renderProjectIconBadge(project, "tile");

      return `
        <button class="card project-tile reveal" type="button" data-open-project="${escapeHtml(
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
}

function renderProjectDetail(project) {
  if (!els.projectDetail || !project) return;

  const iconBadge = renderProjectIconBadge(project, "detail");
  const stackChips = project.stack
    .map((item) => `<span class="tag project-stack-chip">${escapeHtml(item)}</span>`)
    .join("");

  const approachItems = project.approach.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const outcomeItems = project.outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const media =
    project.media && project.media.type === "video"
      ? `
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
      `
      : "";

  const links = [];
  if (project.demoUrl) {
    links.push(
      `<a class="btn btn-primary" href="${escapeHtml(
        project.demoUrl
      )}" target="_blank" rel="noreferrer">Live Demo</a>`
    );
  }

  if (project.media && project.media.src) {
    links.push(
      `<a class="btn btn-ghost" href="${escapeHtml(
        project.media.src
      )}" target="_blank" rel="noreferrer">Open Media</a>`
    );
  }

  els.projectDetail.innerHTML = `
    <div class="project-detail-top">
      <button class="btn btn-ghost project-back-btn" type="button" data-project-back="true" id="project-back-button">
        <span class="project-back-icon" aria-hidden="true">&larr;</span>
        <span>Back to all projects</span>
      </button>
      <p class="project-detail-meta">${escapeHtml(project.category)} · ${escapeHtml(project.status)}</p>
    </div>

    <div class="project-detail-head">
      ${iconBadge}
      <h3 class="project-detail-title">${escapeHtml(project.title)}</h3>
    </div>
    <p class="project-detail-summary">${escapeHtml(project.summary)}</p>
    <p class="project-detail-impact"><strong>Impact:</strong> ${escapeHtml(project.impact)}</p>

    <div class="project-detail-stack">${stackChips}</div>
    ${media}

    <div class="project-detail-columns">
      <div class="project-detail-block">
        <h4>Approach</h4>
        <ul>${approachItems}</ul>
      </div>
      <div class="project-detail-block">
        <h4>Outcomes</h4>
        <ul>${outcomeItems}</ul>
      </div>
    </div>

    <div class="project-actions">
      ${links.join("")}
    </div>
  `;
}

function openProjectDetail(slug) {
  const project = getProjectBySlug(slug);
  if (!project || !els.projectsBrowser || !els.projectDetail) return;

  state.previousProjectFocus = document.activeElement;
  state.activeProjectSlug = slug;

  renderProjectDetail(project);
  els.projectDetail.hidden = false;
  els.projectsBrowser.classList.add("is-detail-open");

  const backButton = document.getElementById("project-back-button");
  if (backButton) {
    requestAnimationFrame(() => backButton.focus());
  }
}

function closeProjectDetail() {
  if (!els.projectsBrowser || !els.projectDetail) return;

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
      const highlights = (item.highlights || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("");
      const highlightList = highlights.length ? `<ul class="timeline-highlights">${highlights}</ul>` : "";

      const hasPositions = Array.isArray(item.positions) && item.positions.length > 0;
      const positionBlocks = hasPositions
        ? item.positions
            .map((position) => {
              const positionHighlights = (position.highlights || [])
                .map((point) => `<li>${escapeHtml(point)}</li>`)
                .join("");
              const positionHighlightList = positionHighlights.length
                ? `<ul class="timeline-role-highlights">${positionHighlights}</ul>`
                : "";

              return `
                <article class="timeline-role-card">
                  <div class="timeline-role-head">
                    <h4>${escapeHtml(position.title)}</h4>
                    <p class="timeline-role-period">${escapeHtml(position.period)}</p>
                  </div>
                  ${positionHighlightList}
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

      const notes = (item.fieldNotes || []).map((note) => `<li>${escapeHtml(note)}</li>`).join("");

      const detailsId = `timeline-details-${index}`;
      const hasFieldNotes = notes.length > 0;
      const timelineTitle =
        item.headingOnlyOrganization || !item.role ? item.organization : `${item.role} · ${item.organization}`;

      return `
        <article class="timeline-entry reveal">
          <div class="timeline-marker">
            <img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.organization)} logo" loading="lazy" />
          </div>

          <div class="card timeline-card">
            <div class="timeline-head">
              <h3>${escapeHtml(timelineTitle)}</h3>
              <p class="timeline-period">${escapeHtml(item.period)}</p>
            </div>

            <p class="timeline-location">${escapeHtml(item.location)}</p>
            ${companySummary}
            ${highlightList}
            ${nestedRoles}

            ${
              hasFieldNotes
                ? `<button class="btn btn-ghost timeline-toggle" type="button" aria-expanded="false" aria-controls="${detailsId}">Field Notes</button>
                   <div class="timeline-details" id="${detailsId}" hidden>
                     <ul class="timeline-details-list">${notes}</ul>
                   </div>`
                : ""
            }
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

      if (state.view !== VIEW.CONTENT) {
        showContentView(sectionId);
      } else {
        state.lockedNavId = sectionId;
        state.lockedNavAt = performance.now();
        scrollToSection(href);
      }

      setActiveNavLink(sectionId);
      closeMobileNav();
    });
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

function bindExperienceExpansion() {
  if (!els.experienceTimeline) return;

  els.experienceTimeline.addEventListener("click", (event) => {
    const button = event.target.closest(".timeline-toggle");
    if (!button) return;

    const detailsId = button.getAttribute("aria-controls");
    if (!detailsId) return;

    const details = document.getElementById(detailsId);
    if (!details) return;

    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? "Field Notes" : "Hide Notes";
    details.hidden = isExpanded;
  });
}

function updateTimelineProgress() {
  if (!els.experienceTimeline || state.view !== VIEW.CONTENT) return;

  const rect = els.experienceTimeline.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const start = viewportHeight * 0.2;
  const end = rect.height + viewportHeight * 0.6;

  const progressRaw = (viewportHeight - rect.top - start) / end;
  const progress = Math.max(0, Math.min(1, progressRaw));

  els.experienceTimeline.style.setProperty("--timeline-progress", progress.toFixed(3));
}

function bindHeroParallax() {
  if (!els.heroScene || prefersReducedMotion) return;

  const updateByPointer = (clientX, clientY, rect) => {
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;

    els.heroScene.style.setProperty("--pointer-x", x.toFixed(3));
    els.heroScene.style.setProperty("--pointer-y", y.toFixed(3));
  };

  const heroSection = document.querySelector(".hero");
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

  els.contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!els.contactForm.reportValidity()) {
      els.formStatus.textContent = "Please complete all required fields.";
      return;
    }

    const formData = new FormData(els.contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    els.formStatus.textContent = "Opening your email client...";
    window.location.href = `mailto:m398kim@uwaterloo.ca?subject=${subject}&body=${body}`;
  });
}

function bindCursorAura() {
  if (!els.body || prefersReducedMotion) return;

  let rafPending = false;
  let pointerX = 50;
  let pointerY = 50;

  const commit = () => {
    els.body.style.setProperty("--cursor-x", `${pointerX.toFixed(2)}%`);
    els.body.style.setProperty("--cursor-y", `${pointerY.toFixed(2)}%`);
    rafPending = false;
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      if (state.view !== VIEW.CONTENT) return;
      pointerX = (event.clientX / window.innerWidth) * 100;
      pointerY = (event.clientY / window.innerHeight) * 100;
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(commit);
    },
    { passive: true }
  );
}

function bindSurfaceEffects() {
  if (prefersReducedMotion) return;

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
  setReady();
  setMapWorldSize();
  resetTransitionVisuals();

  renderSkills();
  renderProjectTiles();
  renderExperience();

  observeRevealElements();
  observeActiveSection();

  bindIntroExperience();
  bindMapInteractions();
  bindNavigation();
  bindMobileNav();
  bindProjectBrowser();
  bindExperienceExpansion();
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
  } else {
    setViewMode(VIEW.INTRO);
    fitMapToViewport();
  }

  window.addEventListener("resize", () => {
    if (state.view === VIEW.MAP || state.view === VIEW.INTRO) {
      if (!state.mapInteracted) {
        fitMapToViewport();
      } else {
        applyCamera();
      }
    }
  });
}

init();
