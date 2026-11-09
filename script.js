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

  // 3. Workflow Collapsible Details in Project Section
  document.querySelectorAll(".workflow-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const details = document.getElementById(targetId);
      const svg = button.querySelector("svg");

      if (details) {
        const isOpen = details.classList.contains("open");
        if (isOpen) {
          details.classList.remove("open");
          details.style.maxHeight = null;
          svg?.classList.remove("rotate-180");
        } else {
          details.classList.add("open");
          details.style.maxHeight = details.scrollHeight + "px";
          svg?.classList.add("rotate-180");
        }
      }
    });
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
            feedback.textContent = "Click to copy email";
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
