// ─── Kim Arvin Pinili Portfolio — Main Script ───

document.addEventListener("DOMContentLoaded", () => {
  // Global scroll lock flag shared by observer and smooth click handlers
  let isNavScrolling = false;
  let scrollTimeout = null;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Mobile Navigation Toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 2. Section Scroll Reveal Animation
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (!prefersReducedMotion) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // 3. Interactive Project Showcase & Full-Screen Lightbox
  const schedulerModules = [
    {
      badge: "MODULE 01",
      title: "Chairperson Dashboard",
      url: "localhost:5173/admin/dashboard",
      img: "images/media__1781340880330.png",
      desc: "Central administrative hub displaying real-time timetable health, active faculty counts, and automated conflict alerts.",
      pills: ["REST API Aggregation", "Real-Time Conflict Scan", "Dynamic Status Counters"],
      isLogic: false,
    },
    {
      badge: "MODULE 02",
      title: "Instructor Profile Registry",
      url: "localhost:5173/admin/instructors",
      img: "images/media__1781340880185.png",
      desc: "Faculty workload manager tracking academic credentials, unit limits, and weekly teaching availability constraints.",
      pills: ["Unit Load Validation", "Transactional MySQL Sync", "Instant Department Filter"],
      isLogic: false,
    },
    {
      badge: "MODULE 03",
      title: "Faculty Grid Timetable",
      url: "localhost:5173/admin/instructor-schedule",
      img: "images/media__1781340880083.png",
      desc: "Dynamic 2D scheduling matrix visualizing weekly class allocations per instructor and flagging overlapping slots.",
      pills: ["Single-Payload Fetch", "Back-to-Back Clash Audit", "Color-Coded Subject Blocks"],
      isLogic: false,
    },
    {
      badge: "MODULE 04",
      title: "Student Section Schedules",
      url: "localhost:5173/admin/class-schedules",
      img: "images/media__1781340880220.png",
      desc: "Cohort-level timetable viewer ensuring zero collisions between lecture and laboratory sessions for student blocks.",
      pills: ["Cohort Track Mapping", "Contact-Hour Verification", "Print-Ready Export"],
      isLogic: false,
    },
    {
      badge: "MODULE 05",
      title: "Facility & Room Console",
      url: "localhost:5173/admin/rooms",
      img: "images/media__1781340880285.png",
      desc: "Classroom allocation console monitoring lecture hall and computer lab capacities, occupancy rates, and idle hours.",
      pills: ["Seat Capacity Tracking", "Room Double-Book Prevention", "Facility Utilization Audit"],
      isLogic: false,
    },
    {
      badge: "ARCHITECTURE",
      title: "Conflict Detection Engine",
      url: "backend/api/validate_schedule.php",
      img: "",
      desc: "Server-side validation pipeline that audits room, instructor, and student section intervals before saving to MySQL.",
      pills: ["PDO Prepared Statements", "Interval Overlap Math", "ACID Transactions"],
      isLogic: true,
    },
  ];

  let currentModuleIndex = 0;
  const tabBtns = document.querySelectorAll("#scheduler-tabs .project-tab-btn");
  const showcaseUrl = document.getElementById("showcase-url");
  const showcaseImg = document.getElementById("showcase-img");
  const showcaseImagePanel = document.getElementById("showcase-image-panel");
  const showcaseLogicPanel = document.getElementById("showcase-logic-panel");
  const showcaseBadge = document.getElementById("showcase-step-badge");
  const showcaseTitle = document.getElementById("showcase-title");
  const showcaseDesc = document.getElementById("showcase-desc");
  const showcasePills = document.getElementById("showcase-pills");
  const prevBtn = document.getElementById("showcase-prev");
  const nextBtn = document.getElementById("showcase-next");
  const zoomBtn = document.getElementById("showcase-zoom-btn");

  function renderShowcaseModule(index) {
    if (index < 0) index = schedulerModules.length - 1;
    if (index >= schedulerModules.length) index = 0;
    currentModuleIndex = index;

    const mod = schedulerModules[index];

    // Update active state on tab buttons
    tabBtns.forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });

    if (showcaseUrl) showcaseUrl.textContent = mod.url;
    if (showcaseBadge) showcaseBadge.textContent = mod.badge;
    if (showcaseTitle) showcaseTitle.textContent = mod.title;
    if (showcaseDesc) showcaseDesc.textContent = mod.desc;

    // Toggle between screenshot view and architecture logic view
    if (mod.isLogic) {
      showcaseImagePanel?.classList.add("hidden");
      showcaseLogicPanel?.classList.remove("hidden");
      zoomBtn?.classList.add("hidden");
    } else {
      showcaseLogicPanel?.classList.add("hidden");
      showcaseImagePanel?.classList.remove("hidden");
      zoomBtn?.classList.remove("hidden");
      if (showcaseImg) {
        showcaseImg.src = mod.img;
        showcaseImg.alt = mod.title;
      }
    }

    // Render engineering highlight pills
    if (showcasePills) {
      const pillsHtml = mod.pills
        .map(
          (p) =>
            `<span class="rounded-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 px-2.5 py-0.5 font-semibold text-slate-800 dark:text-slate-200">${p}</span>`
        )
        .join("");
      showcasePills.innerHTML = `<span class="font-bold text-slate-700 dark:text-slate-400 mr-1">Engineering Highlights:</span>${pillsHtml}`;
    }
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index") || "0", 10);
      renderShowcaseModule(idx);
    });
  });

  prevBtn?.addEventListener("click", () => renderShowcaseModule(currentModuleIndex - 1));
  nextBtn?.addEventListener("click", () => renderShowcaseModule(currentModuleIndex + 1));

  // Full-Screen Lightbox Modal Logic
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  function openLightbox() {
    const mod = schedulerModules[currentModuleIndex];
    if (!lightbox || !lightboxImg || mod.isLogic) return;
    lightboxImg.src = mod.img;
    lightboxImg.alt = mod.title;
    if (lightboxCaption) lightboxCaption.textContent = `${mod.title} — ${mod.url}`;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
  }

  showcaseImagePanel?.addEventListener("click", openLightbox);
  zoomBtn?.addEventListener("click", openLightbox);
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // 4. Sliding Pill Indicator & Active Link Highlighting (Desktop)
  const navUl = document.querySelector(".site-nav ul");
  const navLinks = document.querySelectorAll(".site-nav a");
  let pill = null;
  let currentActiveLink = null;

  function moveIndicator(link) {
    if (!pill || !link || window.innerWidth < 1024) return;
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
    if (!link) return;
    if (currentActiveLink && currentActiveLink !== link) {
      currentActiveLink.classList.remove("active");
    }
    currentActiveLink = link;
    currentActiveLink.classList.add("active");
    moveIndicator(currentActiveLink);
  }

  if (navUl && navLinks.length) {
    pill = document.createElement("div");
    pill.className = "nav-indicator-pill absolute rounded-full pointer-events-none opacity-0 z-0 hidden lg:block";
    navUl.appendChild(pill);

    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        if (window.innerWidth >= 1024) moveIndicator(link);
      });
      link.addEventListener("click", () => {
        setActiveLink(link);
      });
    });

    navUl.addEventListener("mouseleave", () => {
      if (window.innerWidth >= 1024) {
        if (currentActiveLink) {
          moveIndicator(currentActiveLink);
        } else {
          pill.style.opacity = "0";
        }
      }
    });

    // Track active section on scroll
    const sections = document.querySelectorAll("section[id]");
    if (sections.length) {
      const activeNavObserver = new IntersectionObserver(
        (entries) => {
          if (isNavScrolling) return; // Don't jitter indicator pill during programmatic smooth scroll
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              const matchingLink = document.querySelector(`.site-nav a[href="#${id}"]`);
              if (matchingLink) {
                setActiveLink(matchingLink);
              }
            }
          });
        },
        { rootMargin: "-20% 0px -50% 0px" }
      );
      sections.forEach((section) => activeNavObserver.observe(section));
    }

    window.addEventListener("resize", () => {
      if (currentActiveLink && window.innerWidth >= 1024) {
        pill.style.transition = "none";
        moveIndicator(currentActiveLink);
        pill.offsetHeight; // force reflow
        pill.style.transition = "";
      } else if (window.innerWidth < 1024 && pill) {
        pill.style.opacity = "0";
      }
    });

    // Initial active link setup
    const currentHash = window.location.hash;
    const initialLink = document.querySelector(`.site-nav a[href="${currentHash}"]`) || navLinks[0];
    if (initialLink) {
      setTimeout(() => {
        setActiveLink(initialLink);
      }, 100);
    }
  }

  // 5. Silky Smooth Navigation Gliding (Up-to-Down and Down-to-Up)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 64;

        // Going all the way to top for #home, or landing with offset below header
        const targetTop = targetId === "home"
          ? 0
          : Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12);

        // Lock observer temporarily so indicator smoothly targets destination without flicker
        isNavScrolling = true;
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isNavScrolling = false;
        }, 800);

        // Smooth glide up or down
        window.scrollTo({
          top: targetTop,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });

        // Highlight matching nav link and glide indicator pill
        const matchingNavLink = document.querySelector(`.site-nav a[href="#${targetId}"]`);
        if (matchingNavLink) {
          setActiveLink(matchingNavLink);
        }

        // Update URL hash cleanly without instant jump
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, "#" + targetId);
        }

        // Close mobile drawer if open
        if (nav && nav.classList.contains("open")) {
          nav.classList.remove("open");
          toggle?.classList.remove("open");
          toggle?.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  // 6. Theme Toggle (Light & Night Appearance)
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // 7. Copy Email to Clipboard Feature
  const copyEmailBtn = document.getElementById("copy-email-btn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      const emailText = "kimarvinchosen@gmail.com";
      const feedback = document.getElementById("copy-feedback");

      navigator.clipboard.writeText(emailText).then(() => {
        if (feedback) {
          feedback.textContent = "Copied to clipboard!";
          feedback.classList.remove("text-slate-700", "dark:text-slate-400");
          feedback.classList.add("text-sky-700", "dark:text-sky-400", "font-bold");

          setTimeout(() => {
            feedback.textContent = "Click to copy";
            feedback.classList.remove("text-sky-700", "dark:text-sky-400", "font-bold");
            feedback.classList.add("text-slate-700", "dark:text-slate-400");
          }, 2500);
        }
      }).catch((err) => {
        console.error("Could not copy text: ", err);
      });
    });
  }

  // 8. Contact Form Submission (Web3Forms + Mailto Fallback)
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      if (status) {
        status.textContent = "Sending message...";
        status.className = "form-status mt-3 text-xs font-semibold text-sky-700 dark:text-sky-400";
      }

      const formData = new FormData(form);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject") || "Portfolio Inquiry";
      const message = formData.get("message");

      const accessKey = "YOUR_WEB3FORMS_ACCESS_KEY_HERE";

      // If key is unconfigured, fallback immediately to default mail client
      if (accessKey === "YOUR_WEB3FORMS_ACCESS_KEY_HERE" || !accessKey.trim()) {
        const recipient = "kimarvinchosen@gmail.com";
        const mailtoBody = `Hi Kim,\n\n${message}\n\nFrom: ${name} (${email})`;
        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

        window.location.href = mailtoUrl;

        if (status) {
          status.textContent = "Opening your email app to send message...";
          status.className = "form-status mt-3 text-xs font-semibold text-sky-700 dark:text-sky-400";
        }
        form.reset();
        return;
      }

      formData.append("access_key", accessKey);
      formData.append("from_name", "Kim Arvin Pinili Portfolio");

      const host = "api.web3forms.com";
      const submitUrl = "https://" + host + "/submit";

      try {
        const response = await fetch(submitUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          if (status) {
            status.textContent = "Thank you! Your message has been sent successfully.";
            status.className = "form-status mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400";
          }
          form.reset();
        } else {
          throw new Error(result.message || "Submission failed");
        }
      } catch (error) {
        console.error("Form error:", error);
        if (status) {
          status.textContent = "Redirecting to your email client...";
          status.className = "form-status mt-3 text-xs font-semibold text-amber-700 dark:text-amber-400";
        }
        setTimeout(() => {
          const recipient = "kimarvinchosen@gmail.com";
          const mailtoBody = `Hi Kim,\n\n${message}\n\nFrom: ${name} (${email})`;
          const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;
          window.location.href = mailtoUrl;
        }, 1200);
      }
    });
  }
});
