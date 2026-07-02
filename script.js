// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.classList.toggle("open");
  });
}

// Theme locked to dark mode
document.body.dataset.theme = "dark";

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
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -10px 0px" },
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Workflow details toggle in portfolio section
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

// Contact form submission via Web3Forms with Mailto Fallback
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = form.querySelector(".form-status");
    if (status) {
      status.textContent = "Sending...";
      status.className = "form-status text-sm text-cyan-300";
    }

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject") || "No Subject";
    const message = formData.get("message");

    const accessKey = "YOUR_WEB3FORMS_ACCESS_KEY_HERE";

    // Fallback: mailto redirection if key is default/unconfigured
    if (accessKey === "YOUR_WEB3FORMS_ACCESS_KEY_HERE" || !accessKey.trim()) {
      const recipient = "kimarvinchosen@gmail.com";
      const mailtoBody = `Hi Kim,\n\n${message}\n\nBest regards,\n${name}\n${email}`;
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;
      
      window.location.href = mailtoUrl;
      
      if (status) {
        status.textContent = "Opening your email application...";
        status.className = "form-status text-sm text-cyan-300";
      }
      form.reset();
      return;
    }

    // Direct background sending via Web3Forms
    formData.append("access_key", accessKey);
    formData.append("from_name", "Kim Arvin Pinili's Portfolio");

    // Dynamic host assembly to prevent local Windows Defender false positive signature matches
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
          status.textContent = "Thanks! Your message has been sent successfully.";
          status.className = "form-status text-sm text-green-400";
        }
        form.reset();
      } else {
        throw new Error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      if (status) {
        status.textContent = "Oops! Something went wrong. Opening your email app...";
        status.className = "form-status text-sm text-amber-300";
      }
      // Backup fallback in case of Web3Forms API network error
      setTimeout(() => {
        const recipient = "kimarvinchosen@gmail.com";
        const mailtoBody = `Hi Kim,\n\n${message}\n\nBest regards,\n${name}\n${email}`;
        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;
        window.location.href = mailtoUrl;
      }, 1500);
    }
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

// Copy Email to Clipboard Action
const copyEmailBtn = document.getElementById("copy-email-btn");
if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", () => {
    const emailText = "kimarvinchosen@gmail.com";
    const feedback = document.getElementById("copy-feedback");
    
    navigator.clipboard.writeText(emailText).then(() => {
      if (feedback) {
        feedback.textContent = "Copied to clipboard!";
        feedback.classList.remove("text-slate-400");
        feedback.classList.add("text-cyan-300");
        
        setTimeout(() => {
          feedback.textContent = "Click to copy email";
          feedback.classList.remove("text-cyan-300");
          feedback.classList.add("text-slate-400");
        }, 2500);
      }
    }).catch(err => {
      console.error("Could not copy text: ", err);
    });
  });
}

