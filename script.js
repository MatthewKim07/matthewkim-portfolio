const revealElements = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("main section[id]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => {
  if (!element.classList.contains("visible")) {
    revealObserver.observe(element);
  }
});

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isMatch);
  });
};

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  {
    threshold: 0.4,
    rootMargin: "-12% 0px -42% 0px",
  }
);

sections.forEach((section) => {
  activeObserver.observe(section);
});
