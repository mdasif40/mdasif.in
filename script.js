document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  const revealElements = document.querySelectorAll(".reveal");
  const slideshowElements = document.querySelectorAll(".preview");
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const disabledPdfBtns = document.querySelectorAll('.disabled-pdf');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // --- 1. GITHUB PAGES CLEAN URL ROUTING HANDLER ---
  (() => {
    const redirectPath = window.location.search.match(/^\?\/(.*)$/);
    if (redirectPath && redirectPath[1]) {
      const cleanRoute = redirectPath[1].replace(/\/$/, "");
      window.history.replaceState(null, "", "/" + cleanRoute);
      
      const targetElement = document.getElementById(cleanRoute);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  })();

  const updateUrlPath = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
  };

  // Nav link click smooth scroll + Clean URL bar update
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const cleanName = targetId.replace('#', '');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          const newPath = cleanName === 'home' ? '/' : `/${cleanName}`;
          updateUrlPath(newPath);
        }
      }
    });
  });

  // Dynamic URL update on scroll
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const newPath = id === 'home' ? '/' : `/${id}`;
        updateUrlPath(newPath);
      }
    });
  }, { threshold: 0.4 });

  sections.forEach((section) => sectionObserver.observe(section));

  // --- 2. MOBILE HAMBURGER TOGGLE LOGIC ---
  if (navToggle && navLinks) {
    const closeMenu = () => {
      navToggle.classList.remove("open");
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
      if (nav && !nav.contains(e.target) && navLinks.classList.contains("open")) {
        closeMenu();
      }
    });
  }

  // --- 3. NAVBAR & BACK TO TOP SCROLL EFFECTS ---
  let ticking = false;
  const handleScroll = () => {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    }
    
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 4. SCROLL REVEAL OBSERVER ---
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // --- 5. SMART SLIDESHOW ---
  slideshowElements.forEach((slideshow) => {
    const slides = slideshow.querySelectorAll(".slide");
    if (slides.length <= 1) return;

    let currentSlideIndex = Array.from(slides).findIndex(s => s.classList.contains("active"));
    if (currentSlideIndex === -1) {
      currentSlideIndex = 0;
      slides[0].classList.add("active");
    }

    let intervalId = null;
    let isHovered = false;

    const nextSlide = () => {
      slides[currentSlideIndex].classList.remove("active");
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      slides[currentSlideIndex].classList.add("active");
    };

    const startSlideshow = () => {
      if (!intervalId && !isHovered) {
        intervalId = setInterval(nextSlide, 1500);
      }
    };

    const stopSlideshow = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    slideshow.addEventListener("mouseenter", () => {
      isHovered = true;
      stopSlideshow();
    });

    slideshow.addEventListener("mouseleave", () => {
      isHovered = false;
      startSlideshow();
    });

    const slideshowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startSlideshow();
        } else {
          stopSlideshow();
        }
      });
    }, { threshold: 0.2 });

    slideshowObserver.observe(slideshow);
  });

  // --- 6. DISABLED PDF NOTICE HANDLER ---
  disabledPdfBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const wrapper = btn.closest('.pdf-wrapper');
      const notice = wrapper ? wrapper.querySelector('.pdf-red-notice') : null;

      if (notice) {
        notice.classList.add('show');
        setTimeout(() => {
          notice.classList.remove('show');
        }, 4000);
      }
    });
  });

  // --- 7. FOOTER QUOTE ROTATOR ---
  const footerQuoteElement = document.getElementById("footer-quote");

  if (footerQuoteElement) {
    const lines = [
      '"Tuesday smells like angry circles."',
      '"Your knees are secretly downloading water from the TV."',
      '"The sun is a big yellow lemon that forgot how to drop."',
      '"A tiny shoe in the wall is screaming about hot dogs."',
      '"Don\'t touch that cloud; it will turn your cat into a clock."',
      '"The floor is drinking my tea through its invisible toes."',
      '"Yesterday is running around inside my pocket with a spoon."',
      '"The refrigerator is whispering secrets to the carpet."',
      '"Don\'t look now, but your shadow is trying to steal a sandwich."',
      '"My left shoe completely forgot how to speak Tuesdays."',
      '"Be careful with that pencil; it might draw an exit sign in your mind."',
      '"The moon is just a bowl of soup waiting for a giant spoon."',
      '"Never trust a staircase that counts backwards when you step on it."',
      '"Your reflection is currently stuck in traffic on the third floor."',
      '"The wall clock is slowly drinking all the silence in the room."',
      '"A polite triangle is asking for directions to your left ear."',
      '"Don\'t open the closet door-it’s currently buffering yesterday."'
    ];

    let currentIndex = Math.floor(Math.random() * lines.length);
    footerQuoteElement.textContent = lines[currentIndex];

    setInterval(() => {
      footerQuoteElement.classList.remove("flip-in");
      footerQuoteElement.classList.add("flip-out");

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % lines.length;
        footerQuoteElement.textContent = lines[currentIndex];

        footerQuoteElement.classList.remove("flip-out");
        footerQuoteElement.classList.add("flip-in");
      }, 600);
    }, 5000);
  }
});