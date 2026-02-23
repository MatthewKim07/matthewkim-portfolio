const data = window.PORTFOLIO_DATA || { skills: [], projects: [], experience: [] };

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  activeProjectSlug: null,
  previousProjectFocus: null,
};

const els = {
  body: document.body,
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

function setReady() {
  requestAnimationFrame(() => {
    els.body.classList.add("is-ready");
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
          <p class="toolkit-summary">${escapeHtml(group.summary)}</p>
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

function renderProjectTiles() {
  if (!els.projectsGrid) return;

  els.projectsGrid.innerHTML = data.projects
    .map((project) => {
      return `
        <button class="card project-tile reveal" type="button" data-open-project="${escapeHtml(
          project.slug
        )}" aria-label="Open ${escapeHtml(project.title)} project details">
          <div class="project-art" style="--art-a:${escapeHtml(project.palette.a)};--art-b:${escapeHtml(
            project.palette.b
          )};" aria-hidden="true">
            <span class="project-art-label">${escapeHtml(project.category)}</span>
            <span class="project-logo-mark">${escapeHtml(getProjectMark(project.title))}</span>
          </div>
          <h3 class="project-tile-title">${escapeHtml(project.title)}</h3>
        </button>
      `;
    })
    .join("");
}

function renderProjectDetail(project) {
  if (!els.projectDetail || !project) return;

  const stackChips = project.stack
    .map((item) => `<span class="tag project-stack-chip">${escapeHtml(item)}</span>`)
    .join("");

  const approachItems = project.approach
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const outcomeItems = project.outcomes
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

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
      <button class="btn btn-ghost" type="button" data-project-back="true" id="project-back-button">Back to all projects</button>
      <p class="project-detail-meta">${escapeHtml(project.category)} · ${escapeHtml(project.status)}</p>
    </div>

    <h3 class="project-detail-title">${escapeHtml(project.title)}</h3>
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
      const highlights = item.highlights
        .map((point) => `<li>${escapeHtml(point)}</li>`)
        .join("");

      const notes = (item.fieldNotes || [])
        .map((note) => `<li>${escapeHtml(note)}</li>`)
        .join("");

      const detailsId = `timeline-details-${index}`;
      const hasFieldNotes = notes.length > 0;

      return `
        <article class="timeline-entry reveal">
          <div class="timeline-marker">
            <img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.organization)} logo" loading="lazy" />
          </div>

          <div class="card timeline-card">
            <div class="timeline-head">
              <h3>${escapeHtml(item.role)} · ${escapeHtml(item.organization)}</h3>
              <p class="timeline-period">${escapeHtml(item.period)}</p>
            </div>

            <p class="timeline-location">${escapeHtml(item.location)}</p>
            <ul class="timeline-highlights">${highlights}</ul>

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
}

function observeActiveSection() {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNavLink(entry.target.id);
        }
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-12% 0px -42% 0px",
    }
  );

  els.sections.forEach((section) => sectionObserver.observe(section));
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
      scrollToSection(href);
      closeMobileNav();
    });
  });
}

function updateHeaderState() {
  if (!els.header) return;
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
  if (!els.experienceTimeline) return;

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

function bindScrollHandlers() {
  const onScroll = () => {
    updateHeaderState();
    updateTimelineProgress();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function init() {
  setReady();

  renderSkills();
  renderProjectTiles();
  renderExperience();

  observeRevealElements();
  observeActiveSection();

  bindNavigation();
  bindMobileNav();
  bindProjectBrowser();
  bindExperienceExpansion();
  bindHeroParallax();
  bindContactForm();
  bindScrollHandlers();
}

init();
