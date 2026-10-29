/**
 * Portfolio JavaScript - Srujan
 * Features:
 * - Thin scroll-progress bar updating on scroll
 * - Sticky navbar shrinking & blur styling past 40px
 * - Cursor-following spotlight on glass cards (--mx, --my on fine pointer devices)
 * - IntersectionObserver fade-up animations (triggers once)
 * - Mobile hamburger navigation with ARIA support & keyboard controls
 * - Smooth active section navigation highlighting
 * - Interactive email address copy with feedback
 * - Respects prefers-reduced-motion
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Thin Top Scroll Progress Bar
  // ---------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0 && scrollProgressBar) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ---------------------------------------------------------------------------
  // 2. Mobile Navigation Toggle & Accessibility
  // ---------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const siteHeader = document.getElementById('navbar');

  function openMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('active');
  }

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close mobile menu when any nav item is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      const isClickInside = siteHeader && siteHeader.contains(event.target);
      if (!isClickInside && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Sticky Navbar: Shrink slightly & Increase Blur past 40px
  // ---------------------------------------------------------------------------
  const handleScrollNavbar = () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  // ---------------------------------------------------------------------------
  // 4. Cursor-Following Spotlight on Glass Cards (Skip on Touch Devices)
  // ---------------------------------------------------------------------------
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (isFinePointer) {
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        card.style.setProperty('--mx', `${mouseX}px`);
        card.style.setProperty('--my', `${mouseY}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Scroll Fade-Up with IntersectionObserver (Runs once per element)
  // ---------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fadeElements = document.querySelectorAll('.fade-element');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // If user prefers reduced motion or browser has no observer support, make all visible immediately
    fadeElements.forEach(el => el.classList.add('is-visible'));
  } else {
    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Trigger once per element
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      }
    );

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // ---------------------------------------------------------------------------
  // 6. Active Section Highlighting in Navbar (IntersectionObserver)
  // ---------------------------------------------------------------------------
  const trackedSections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            allNavLinks.forEach(link => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active-link');
              } else {
                link.classList.remove('active-link');
              }
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    trackedSections.forEach(sec => navObserver.observe(sec));
  } else {
    // Fallback for older browsers
    const handleActiveFallback = () => {
      const scrollPos = window.scrollY + 140;
      trackedSections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const targetLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (targetLink) {
          if (scrollPos >= top && scrollPos < top + height) {
            targetLink.classList.add('active-link');
          } else {
            targetLink.classList.remove('active-link');
          }
        }
      });
    };
    window.addEventListener('scroll', handleActiveFallback, { passive: true });
    handleActiveFallback();
  }

  // ---------------------------------------------------------------------------
  // 7. Interactive Copy Email to Clipboard
  // ---------------------------------------------------------------------------
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailTextEl = document.querySelector('.email-text');

  if (copyBtn && emailTextEl) {
    copyBtn.addEventListener('click', async () => {
      const emailToCopy = emailTextEl.textContent.trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for non-https or older browsers
          const textarea = document.createElement('textarea');
          textarea.value = emailToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        // Visual feedback
        copyBtn.classList.add('copied');
        const copyTextSpan = copyBtn.querySelector('.copy-text');
        if (copyTextSpan) {
          copyTextSpan.textContent = 'Copied!';
        }

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyTextSpan) {
            copyTextSpan.textContent = 'Copy';
          }
        }, 2200);

      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 8. Animated Hero Scroll Cue (Fades out after first scroll)
  // ---------------------------------------------------------------------------
  const heroScrollCue = document.getElementById('heroScrollCue');

  // ---------------------------------------------------------------------------
  // 9. Floating Back-to-Top Button (Appears after 600px scroll)
  // ---------------------------------------------------------------------------
  const floatingBackToTop = document.getElementById('floatingBackToTop');

  const handleScrollEffects = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Fade out hero scroll cue past 40px
    if (heroScrollCue) {
      if (scrollY > 40) {
        heroScrollCue.classList.add('cue-hidden');
      } else {
        heroScrollCue.classList.remove('cue-hidden');
      }
    }

    // Show floating back-to-top button past 600px
    if (floatingBackToTop) {
      if (scrollY > 600) {
        floatingBackToTop.classList.add('is-visible');
      } else {
        floatingBackToTop.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();

  if (floatingBackToTop) {
    floatingBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 10. Initialize Starfield Background
  // ---------------------------------------------------------------------------
  initStarfield();

  // ---------------------------------------------------------------------------
  // 11. Gentle Space Background Parallax (Nebula 0.03x, Milky-Way 0.05x)
  // ---------------------------------------------------------------------------
  initSpaceParallax();
});

// ===========================================================================
// STARFIELD BACKGROUND (Plain 2D Canvas API)
// ===========================================================================
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Single top-level CONFIG object for tuning
  const CONFIG = {
    // Star density: 1 star per 9,000 px^2
    areaPerStar: 9000,
    maxStarsDesktop: 220,
    maxStarsMobile: 90,
    mobileBreakpoint: 768,

    // Three depth layers
    layers: [
      {
        name: 'far',
        ratio: 0.60,      // ~60% of stars
        radiusMin: 0.4,
        radiusMax: 0.8,
        opacityMin: 0.25,
        opacityMax: 0.50,
        speedX: 3.0,      // px/s drift right
        speedY: -6.0,     // px/s drift up (total drift: ~6.7 px/s)
        parallaxScroll: 0.02,
        parallaxMouse: 3,
        glow: false
      },
      {
        name: 'mid',
        ratio: 0.30,      // ~30% of stars
        radiusMin: 0.8,
        radiusMax: 1.2,
        opacityMin: 0.40,
        opacityMax: 0.70,
        speedX: 5.5,      // px/s drift right
        speedY: -11.0,    // px/s drift up (total drift: ~12.3 px/s)
        parallaxScroll: 0.05,
        parallaxMouse: 7,
        glow: false
      },
      {
        name: 'near',
        ratio: 0.10,      // ~10% of stars
        radiusMin: 1.2,
        radiusMax: 1.8,
        opacityMin: 0.60,
        opacityMax: 0.90,
        speedX: 8.5,      // px/s drift right
        speedY: -17.5,    // px/s drift up (total drift: ~19.4 px/s)
        parallaxScroll: 0.10,
        parallaxMouse: 12, // max 12px offset
        glow: true,
        glowBlur: 6,
        glowColor: 'rgba(255, 255, 255, 0.6)'
      }
    ],

    // Twinkle: oscillation with sine wave (period 2-6s, amplitude ~30%)
    twinkle: {
      periodMin: 2.0, // seconds
      periodMax: 6.0,
      amplitude: 0.30 // 30% oscillation
    },

    // Shooting star: thin white streak (length ~80px, fading trail) every 12-25s, <1s
    shootingStar: {
      enabled: true,
      intervalMin: 12000, // ms
      intervalMax: 25000, // ms
      length: 80,         // px
      durationMin: 650,   // ms
      durationMax: 850,   // ms
      speedMin: 600,      // px/s
      speedMax: 850       // px/s
    },

    // Parallax mouse easing (fine pointer only)
    mouseParallaxEase: 0.06
  };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let shootingStar = null;
  let nextShootingStarTime = performance.now() + randomRange(CONFIG.shootingStar.intervalMin, CONFIG.shootingStar.intervalMax);

  let animationFrameId = null;
  let lastTime = 0;
  let isRunning = false;

  // Track scroll position
  let scrollY = window.scrollY || document.documentElement.scrollTop;
  const updateScroll = () => {
    scrollY = window.scrollY || document.documentElement.scrollTop;
  };
  window.addEventListener('scroll', updateScroll, { passive: true });

  // Track mouse position on fine pointer devices only
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  if (isFinePointer) {
    window.addEventListener('mousemove', (e) => {
      // Normalized between -1 and +1 from screen center
      targetMouseX = (e.clientX / (width || window.innerWidth) - 0.5) * 2;
      targetMouseY = (e.clientY / (height || window.innerHeight) - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      targetMouseX = 0;
      targetMouseY = 0;
    });
  }

  // Helper random function
  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  // Generate / populate stars
  function createStars() {
    stars = [];
    const isMobile = width < CONFIG.mobileBreakpoint;
    const area = width * height;
    const targetCount = Math.min(
      Math.floor(area / CONFIG.areaPerStar),
      isMobile ? CONFIG.maxStarsMobile : CONFIG.maxStarsDesktop
    );

    // Compute star count per layer
    CONFIG.layers.forEach((layer, layerIdx) => {
      const layerCount = Math.max(1, Math.round(targetCount * layer.ratio));
      for (let i = 0; i < layerCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: randomRange(layer.radiusMin, layer.radiusMax),
          baseOpacity: randomRange(layer.opacityMin, layer.opacityMax),
          layerIndex: layerIdx,
          speedX: layer.speedX,
          speedY: layer.speedY,
          twinklePhase: Math.random() * Math.PI * 2,
          twinklePeriod: randomRange(CONFIG.twinkle.periodMin, CONFIG.twinkle.periodMax)
        });
      }
    });
  }

  // Resize canvas with DPR scaling
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    createStars();

    const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (motionReduced) {
      renderStaticFrame();
    }
  }

  // Debounced window resize listener
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
    }, 150);
  }, { passive: true });

  // Spawn shooting star
  function spawnShootingStar(now) {
    if (!CONFIG.shootingStar.enabled) return;
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.45; // 32° to 58° angle downwards
    const duration = randomRange(CONFIG.shootingStar.durationMin, CONFIG.shootingStar.durationMax);
    const speed = randomRange(CONFIG.shootingStar.speedMin, CONFIG.shootingStar.speedMax);
    const startX = Math.random() * (width * 0.75) + (width * 0.05);
    const startY = Math.random() * (height * 0.35);

    shootingStar = {
      startTime: now,
      duration,
      speed,
      startX,
      startY,
      angle,
      length: CONFIG.shootingStar.length
    };
  }

  // Update and draw shooting star
  function renderShootingStar(now) {
    if (!shootingStar) {
      if (now >= nextShootingStarTime) {
        spawnShootingStar(now);
      }
      return;
    }

    const elapsed = now - shootingStar.startTime;
    const progress = elapsed / shootingStar.duration;

    if (progress >= 1) {
      shootingStar = null;
      nextShootingStarTime = now + randomRange(CONFIG.shootingStar.intervalMin, CONFIG.shootingStar.intervalMax);
      return;
    }

    // Distance traveled
    const dist = (elapsed / 1000) * shootingStar.speed;
    const headX = shootingStar.startX + Math.cos(shootingStar.angle) * dist;
    const headY = shootingStar.startY + Math.sin(shootingStar.angle) * dist;
    const tailX = headX - Math.cos(shootingStar.angle) * shootingStar.length;
    const tailY = headY - Math.sin(shootingStar.angle) * shootingStar.length;

    // Fade envelope: in during first 20%, out during last 40%
    let alpha = 1;
    if (progress < 0.2) {
      alpha = progress / 0.2;
    } else if (progress > 0.6) {
      alpha = (1 - progress) / 0.4;
    }
    alpha = Math.max(0, Math.min(1, alpha));

    // Gradient trail
    const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.45})`);
    grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.9})`);

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.stroke();

    // Small head spark
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
    ctx.beginPath();
    ctx.arc(headX, headY, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw a static frame (for prefers-reduced-motion)
  function renderStaticFrame() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      const layer = CONFIG.layers[star.layerIndex];
      ctx.save();
      if (layer.glow) {
        ctx.shadowBlur = layer.glowBlur;
        ctx.shadowColor = layer.glowColor;
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${star.baseOpacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // Animation frame loop
  function loop(currentTime) {
    if (!isRunning) return;

    if (!lastTime) lastTime = currentTime;
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;

    // Smooth mouse parallax interpolation
    if (isFinePointer) {
      currentMouseX += (targetMouseX - currentMouseX) * CONFIG.mouseParallaxEase;
      currentMouseY += (targetMouseY - currentMouseY) * CONFIG.mouseParallaxEase;
    }

    // Clear canvas
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const timeSeconds = currentTime / 1000;

    // Draw stars grouped by layer for batch performance
    for (let layerIdx = 0; layerIdx < CONFIG.layers.length; layerIdx++) {
      const layer = CONFIG.layers[layerIdx];
      const layerStars = stars.filter(s => s.layerIndex === layerIdx);

      ctx.save();
      if (layer.glow) {
        ctx.shadowBlur = layer.glowBlur;
        ctx.shadowColor = layer.glowColor;
      }

      const parallaxY = scrollY * layer.parallaxScroll;
      const mouseX = isFinePointer ? currentMouseX * layer.parallaxMouse : 0;
      const mouseY = isFinePointer ? currentMouseY * layer.parallaxMouse : 0;

      for (let i = 0; i < layerStars.length; i++) {
        const star = layerStars[i];

        // Motion update (diagonal drift)
        star.x += star.speedX * dt;
        star.y += star.speedY * dt;

        // Wrap around boundaries
        if (star.y < -10) {
          star.y = height + 10;
          star.x = Math.random() * width;
        } else if (star.x > width + 10) {
          star.x = -10;
          star.y = Math.random() * height;
        } else if (star.y > height + 10) {
          star.y = -10;
          star.x = Math.random() * width;
        } else if (star.x < -10) {
          star.x = width + 10;
          star.y = Math.random() * height;
        }

        // Twinkle factor
        const twinkleCycle = ((timeSeconds / star.twinklePeriod) * Math.PI * 2) + star.twinklePhase;
        const twinkleFactor = 1 + CONFIG.twinkle.amplitude * Math.sin(twinkleCycle);
        const currentOpacity = Math.max(0.1, Math.min(1, star.baseOpacity * twinkleFactor));

        // Effective position with scroll and mouse parallax
        let drawX = (star.x + mouseX) % width;
        if (drawX < 0) drawX += width;

        let drawY = (star.y - parallaxY + mouseY) % height;
        if (drawY < 0) drawY += height;

        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Shooting star
    renderShootingStar(currentTime);

    animationFrameId = requestAnimationFrame(loop);
  }

  function startLoop() {
    const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (motionReduced) {
      renderStaticFrame();
      return;
    }

    if (!isRunning) {
      isRunning = true;
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    }
  }

  function stopLoop() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Handle visibility change (pause loop when tab hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else {
      const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!motionReduced) {
        startLoop();
      }
    }
  });

  // Handle prefers-reduced-motion dynamically
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', (e) => {
    if (e.matches) {
      stopLoop();
      renderStaticFrame();
    } else {
      startLoop();
    }
  });

  // Initial setup and start
  resizeCanvas();
  startLoop();
}

// ===========================================================================
// SPACE BACKGROUND SCROLL PARALLAX (Nebula: 0.03x, Milky-Way: 0.05x)
// Throttled via requestAnimationFrame, disabled on touch & reduced motion
// ===========================================================================
function initSpaceParallax() {
  const nebulaLayer = document.getElementById('spaceNebula');
  const milkywayLayer = document.getElementById('spaceMilkyway');
  if (!nebulaLayer && !milkywayLayer) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) return;

  // Skip on touch devices to ensure 60/120fps native scrolling performance
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  let latestScrollY = window.scrollY || document.documentElement.scrollTop;
  let ticking = false;

  function updateParallax() {
    if (nebulaLayer) {
      nebulaLayer.style.transform = `translate3d(0, ${-(latestScrollY * 0.03).toFixed(2)}px, 0)`;
    }
    if (milkywayLayer) {
      milkywayLayer.style.transform = `translate3d(0, ${-(latestScrollY * 0.05).toFixed(2)}px, 0)`;
    }
    ticking = false;
  }

  function onScroll() {
    latestScrollY = window.scrollY || document.documentElement.scrollTop;
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateParallax();

  // Handle dynamic reduced-motion toggle
  motionQuery.addEventListener('change', (e) => {
    if (e.matches) {
      window.removeEventListener('scroll', onScroll);
      if (nebulaLayer) nebulaLayer.style.transform = '';
      if (milkywayLayer) milkywayLayer.style.transform = '';
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
      updateParallax();
    }
  });
}
