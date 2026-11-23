(() => {
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const innerPage = body?.dataset.page === "inner";

  const closeMenu = () => {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navMenu.classList.remove("is-open");
    body?.classList.remove("menu-open");
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
      navMenu.classList.toggle("is-open", !isExpanded);
      body?.classList.toggle("menu-open", !isExpanded);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", innerPage || window.scrollY > 24);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  const homePage = body?.dataset.page === "home";
  if (homePage) {
    const sectionLinks = navLinks.filter((link) => link.hash && link.pathname === window.location.pathname);
    const sections = sectionLinks
      .map((link) => document.querySelector(link.hash))
      .filter((section) => section instanceof HTMLElement);

    const setActiveNav = () => {
      let activeSection = sections[0];
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.38) activeSection = section;
      });
      navLinks.forEach((link) => {
        const isActive = link === sectionLinks[sections.indexOf(activeSection)];
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    if (sections.length) {
      setActiveNav();
      window.addEventListener("scroll", setActiveNav, { passive: true });
    }
  } else {
    const currentPage = window.location.pathname.split("/").pop();
    const activeLink = currentPage === "services.html"
      ? navLinks.find((link) => link.textContent?.trim() === "Experience")
      : currentPage === "about.html"
        ? navLinks.find((link) => link.textContent?.trim() === "About")
        : null;
    navLinks.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  document.querySelectorAll(".faq-question").forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    const panelId = button.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });

  const testimonials = Array.from(document.querySelectorAll(".testimonial"));
  const previousButton = document.getElementById("t-prev-btn");
  const nextButton = document.getElementById("t-next-btn");
  if (testimonials.length && previousButton && nextButton) {
    let activeTestimonial = 0;
    const showTestimonial = (index) => {
      activeTestimonial = (index + testimonials.length) % testimonials.length;
      testimonials.forEach((testimonial, testimonialIndex) => {
        testimonial.hidden = testimonialIndex !== activeTestimonial;
      });
    };
    showTestimonial(0);
    previousButton.addEventListener("click", () => showTestimonial(activeTestimonial - 1));
    nextButton.addEventListener("click", () => showTestimonial(activeTestimonial + 1));
  }

  const portfolioFilters = document.querySelectorAll(".portfolio-filter");
  const portfolioItems = document.querySelectorAll(".portfolio-item[data-category]");
  if (portfolioFilters.length && portfolioItems.length) {
    portfolioFilters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const category = filter.getAttribute("data-filter");
        portfolioFilters.forEach((button) => {
          button.setAttribute("aria-pressed", String(button === filter));
        });
        portfolioItems.forEach((item) => {
          item.hidden = category !== "all" && item.getAttribute("data-category") !== category;
        });
      });
    });
  }

  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (element) => {
    if (!(element instanceof HTMLElement)) return;
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;
    const suffix = element.dataset.suffix ?? "";
    const duration = 1400;
    const start = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      element.textContent = `${Math.floor(target * eased)}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  const reservationForm = document.getElementById("reservation-form");
  if (reservationForm instanceof HTMLFormElement) {
    const nameInput = reservationForm.querySelector("#guest-name");
    const emailInput = reservationForm.querySelector("#guest-email");
    const dateInput = reservationForm.querySelector("#reservation-date");
    const formStatus = reservationForm.querySelector("#form-status");
    const fields = [
      { input: nameInput, error: reservationForm.querySelector("#name-error"), message: "Please enter your name." },
      { input: emailInput, error: reservationForm.querySelector("#email-error"), message: "Please enter a valid email address." },
      { input: dateInput, error: reservationForm.querySelector("#date-error"), message: "Please choose today or a future date." },
    ];

    if (dateInput instanceof HTMLInputElement) {
      const today = new Date();
      const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateInput.min = localToday;
    }

    const validateField = (field) => {
      if (!(field.input instanceof HTMLInputElement) || !(field.error instanceof HTMLElement)) return true;
      let message = "";
      const value = field.input.value.trim();
      if (!value) {
        message = field.message;
      } else if (field.input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = field.message;
      } else if (field.input.type === "date" && field.input.min && value < field.input.min) {
        message = field.message;
      }
      field.error.textContent = message;
      field.input.setAttribute("aria-invalid", String(Boolean(message)));
      return !message;
    };

    fields.forEach((field) => {
      if (!(field.input instanceof HTMLInputElement)) return;
      field.input.addEventListener("input", () => {
        validateField(field);
        if (formStatus instanceof HTMLElement) formStatus.textContent = "";
      });
      field.input.addEventListener("change", () => validateField(field));
    });

    reservationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isValid = fields.map(validateField).every(Boolean);
      if (formStatus instanceof HTMLElement) {
        formStatus.textContent = isValid
          ? "Thank you. Your reservation request is on its way; our team will be in touch."
          : "Please check the highlighted fields and try again.";
      }
      if (!isValid) {
        fields.find((field) => field.input instanceof HTMLInputElement && field.input.getAttribute("aria-invalid") === "true")?.input?.focus();
      }
    });
  }
})();
