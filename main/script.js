// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.classList.toggle("open");
  });
}

// Persistent light/dark theme toggle
const themeToggles = document.querySelectorAll(".theme-toggle");

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  themeToggles.forEach((button) => {
    button.setAttribute("aria-pressed", String(theme === "light"));

    const label = button.querySelector(".theme-toggle-label");
    const icon = button.querySelector(".theme-toggle-icon");

    if (label) {
      label.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
    }

    if (icon) {
      icon.textContent = theme === "light" ? "☾" : "☀";
    }
  });
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

// Section scroll reveal
const revealEls = document.querySelectorAll(".section-stage .reveal");
if (
  revealEls.length &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

themeToggles.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(document.body.dataset.theme === "light" ? "dark" : "light");
  });
});

// Smooth scroll for internal links (fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 88, behavior: "smooth" });
      nav?.classList.remove("open");
      toggle?.classList.remove("open");
    }
  });
});

// Contact form mock submission
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = form.querySelector(".form-status");
    if (status) status.textContent = "Sending...";
    // Simulate async submission
    await new Promise((res) => setTimeout(res, 800));
    if (status) status.textContent = "Thanks! I will get back to you soon.";
    form.reset();
  });
}

// Navigation sliding pill logic
const navUl = document.querySelector(".site-nav ul");
const navLinks = document.querySelectorAll(".site-nav a");

if (navUl && navLinks.length) {
  // Create indicator pill
  const pill = document.createElement("div");
  pill.className =
    "nav-indicator-pill absolute rounded-full pointer-events-none opacity-0 z-0";
  navUl.appendChild(pill);

  let currentActiveLink = null;

  function moveIndicator(link) {
    if (!pill || !link) return;
    const linkRect = link.getBoundingClientRect();
    const parentRect = navUl.getBoundingClientRect();

    const left = linkRect.left - parentRect.left;
    const top = linkRect.top - parentRect.top;
    const width = linkRect.width;
    const height = linkRect.height;

    pill.style.left = `${left}px`;
    pill.style.top = `${top}px`;
    pill.style.width = `${width}px`;
    pill.style.height = `${height}px`;
    pill.style.opacity = "1";
  }

  function setActiveLink(link) {
    if (currentActiveLink) {
      currentActiveLink.classList.remove("text-cyan-300");
      currentActiveLink.classList.add("text-slate-300");
    }
    currentActiveLink = link;
    currentActiveLink.classList.add("text-cyan-300");
    currentActiveLink.classList.remove("text-slate-300");
    moveIndicator(currentActiveLink);
  }

  // Handle link interactions
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      moveIndicator(link);
    });

    link.addEventListener("click", () => {
      setActiveLink(link);
    });
  });

  // Return to active link on mouse leave
  navUl.addEventListener("mouseleave", () => {
    if (currentActiveLink) {
      moveIndicator(currentActiveLink);
    } else {
      pill.style.opacity = "0";
    }
  });

  // Track active section on scroll
  const sections = document.querySelectorAll("section[id]");
  const activeNavObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          const matchingLink = document.querySelector(
            `.site-nav a[href="#${id}"]`,
          );
          if (matchingLink) {
            setActiveLink(matchingLink);
          }
        }
      });
    },
    {
      rootMargin: "-25% 0px -55% 0px",
    },
  );

  sections.forEach((section) => activeNavObserver.observe(section));

  // Handle window resize
  window.addEventListener("resize", () => {
    if (currentActiveLink) {
      pill.style.transition = "none";
      moveIndicator(currentActiveLink);
      pill.offsetHeight; // Force repaint
      pill.style.transition = "";
    }
  });

  // Initial active item setup
  const currentHash = window.location.hash;
  const initialLink =
    document.querySelector(`.site-nav a[href="${currentHash}"]`) || navLinks[0];
  if (initialLink) {
    setTimeout(() => {
      setActiveLink(initialLink);
    }, 150);
  }
}
