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
// STARFIELD BACKGROUND ENGINE (Plain 2D Canvas API)
// Upgraded: 4 Depth Layers, Depth-of-Field Bokeh, Mouse Parallax, Cursor Push,
// Scroll Warp, Idle Constellations, Concurrent Shooting Stars, Adaptive Quality
// ===========================================================================
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Single top-level CONFIG object exposed for tuning
  const CONFIG = {
    // Star density: 1 star per 4,500 px^2 (capped at 450 desktop / 160 mobile)
    areaPerStar: 4500,
    maxStarsDesktop: 450,
    maxStarsMobile: 160,
    mobileBreakpoint: 768,

    // 4 Depth Layers
    layers: [
      {
        name: 'far_dust',
        ratio: 0.55,       // 55% of stars
        radiusMin: 0.3,
        radiusMax: 0.6,
        opacityMin: 0.20,
        opacityMax: 0.40,
        speedMin: 3.0,
        speedMax: 6.0,
        driftAngle: -1.15, // Upward and rightward drift
        parallaxScroll: 0.015,
        parallaxMouse: 6,  // max 6px opposite offset
        hasGlow: false,
        canPush: false
      },
      {
        name: 'far',
        ratio: 0.25,       // 25% of stars
        radiusMin: 0.6,
        radiusMax: 1.0,
        opacityMin: 0.35,
        opacityMax: 0.60,
        speedMin: 6.0,
        speedMax: 12.0,
        driftAngle: -1.15,
        parallaxScroll: 0.035,
        parallaxMouse: 12, // max 12px opposite offset
        hasGlow: false,
        canPush: false
      },
      {
        name: 'mid',
        ratio: 0.15,       // 15% of stars
        radiusMin: 1.0,
        radiusMax: 1.5,
        opacityMin: 0.50,
        opacityMax: 0.80,
        speedMin: 12.0,
        speedMax: 24.0,
        driftAngle: -1.15,
        parallaxScroll: 0.065,
        parallaxMouse: 20, // max 20px opposite offset
        hasGlow: false,
        canPush: true      // Layer 3 pushed by cursor
      },
      {
        name: 'near',
        ratio: 0.05,       // 5% of stars
        radiusMin: 1.5,
        radiusMax: 2.4,
        opacityMin: 0.70,
        opacityMax: 1.00,
        speedMin: 24.0,
        speedMax: 45.0,
        driftAngle: -1.15,
        parallaxScroll: 0.10,
        parallaxMouse: 28, // max 28px opposite offset
        hasGlow: true,     // Pre-rendered sprite glow
        canPush: true      // Layer 4 pushed by cursor
      }
    ],

    // Twinkle: oscillating sine wave with ~8% bright twinklers
    twinkle: {
      periodMin: 2.0,      // seconds
      periodMax: 7.0,
      amplitudeNormal: 0.25,
      amplitudeBright: 0.65,
      brightRatio: 0.08    // ~8% bright twinklers
    },

    // Depth-of-Field Bokeh (10-14 soft out-of-focus circles)
    bokeh: {
      enabled: true,
      countMin: 10,
      countMax: 14,
      radiusMin: 14,       // px
      radiusMax: 40,       // px
      opacityMin: 0.03,
      opacityMax: 0.07,
      speedMin: 35.0,      // px/s
      speedMax: 55.0,      // px/s
      parallaxMouse: 34    // max offset
    },

    // Cursor Interaction (Gentle push and spring back)
    cursor: {
      pushRadius: 120,      // px radius around cursor
      pushForce: 36,        // max px displacement
      springBackSpeed: 2.2, // spring back over ~1s
      parallaxEase: 0.06
    },

    // Scroll Warp (Vertical streaks proportional to scroll velocity)
    scrollWarp: {
      enabled: true,
      maxStreak: 14,        // max px stretch
      velocityScale: 0.022,
      smoothing: 0.18
    },

    // Subtle Constellation Lines (Idle cursor over hero)
    constellations: {
      enabled: true,
      maxDistance: 110,     // px
      maxLines: 40,
      lineColor: 'rgba(255, 255, 255, 0.08)',
      idleThresholdMs: 320  // ms idle before lines appear
    },

    // Shooting Stars (Up to 2 concurrent, 6-14s interval, 120-200px, <1s)
    shootingStars: {
      enabled: true,
      intervalMin: 6000,    // ms
      intervalMax: 14000,   // ms
      maxConcurrent: 2,     // at most 2 at once
      lengthMin: 120,       // px
      lengthMax: 200,       // px
      durationMin: 650,     // ms
      durationMax: 900,     // ms
      speedMin: 650,        // px/s
      speedMax: 950         // px/s
    },

    // Adaptive Performance Check
    quality: {
      benchmarkDuration: 2000, // first 2 seconds
      fpsThreshold: 45,        // fps cut-off
      degradeStarReduction: 0.40 // 40% star reduction
    }
  };

  // Expose CONFIG globally on window for tuning
  window.__STARFIELD_CONFIG = CONFIG;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let bokehCircles = [];
  let activeShootingStars = [];
  let nextShootingStarTime = performance.now() + randomRange(CONFIG.shootingStars.intervalMin, CONFIG.shootingStars.intervalMax);

  let animationFrameId = null;
  let lastTime = 0;
  let isRunning = false;

  // Track scroll position & velocity
  let scrollY = window.scrollY || document.documentElement.scrollTop;
  let lastScrollY = scrollY;
  let rawScrollVelocity = 0;
  let smoothScrollVelocity = 0;
  let currentWarpStreak = 0;

  // Track mouse position on fine pointer devices
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let rawPixelMouseX = -9999;
  let rawPixelMouseY = -9999;
  let lastMouseMoveTime = 0;
  let constellationAlpha = 0;

  // Adaptive Quality Metrics
  let benchmarkStart = 0;
  let benchmarkFrames = 0;
  let qualityBenchmarkDone = false;
  window.__measuredFps = 60; // Initialized

  // Pre-render Offscreen Glow Sprite for Layer 4 Stars
  const glowSpriteCanvas = document.createElement('canvas');
  glowSpriteCanvas.width = 64;
  glowSpriteCanvas.height = 64;
  const glowCtx = glowSpriteCanvas.getContext('2d');
  const glowGrad = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  glowGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  glowGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.65)');
  glowGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.18)');
  glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  glowCtx.fillStyle = glowGrad;
  glowCtx.fillRect(0, 0, 64, 64);

  // Pre-render Offscreen Bokeh Sprite
  const bokehSpriteCanvas = document.createElement('canvas');
  bokehSpriteCanvas.width = 96;
  bokehSpriteCanvas.height = 96;
  const bokehCtx = bokehSpriteCanvas.getContext('2d');
  const bokehGrad = bokehCtx.createRadialGradient(48, 48, 0, 48, 48, 48);
  bokehGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  bokehGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.50)');
  bokehGrad.addColorStop(0.70, 'rgba(255, 255, 255, 0.14)');
  bokehGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  bokehCtx.fillStyle = bokehGrad;
  bokehCtx.fillRect(0, 0, 96, 96);

  // Scroll handler tracking velocity
  const onScroll = () => {
    const curY = window.scrollY || document.documentElement.scrollTop;
    rawScrollVelocity += Math.abs(curY - lastScrollY);
    lastScrollY = curY;
    scrollY = curY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mouse move handler
  if (isFinePointer) {
    window.addEventListener('mousemove', (e) => {
      rawPixelMouseX = e.clientX;
      rawPixelMouseY = e.clientY;
      lastMouseMoveTime = performance.now();
      // Normalized between -1 and +1 from center
      targetMouseX = (e.clientX / (width || window.innerWidth) - 0.5) * 2;
      targetMouseY = (e.clientY / (height || window.innerHeight) - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      targetMouseX = 0;
      targetMouseY = 0;
      rawPixelMouseX = -9999;
      rawPixelMouseY = -9999;
    });
  }

  // Random range helper
  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  // Populate Stars & Bokeh
  function createUniverse() {
    stars = [];
    bokehCircles = [];

    const isMobile = width < CONFIG.mobileBreakpoint;
    const area = width * height;
    const targetCount = Math.min(
      Math.floor(area / CONFIG.areaPerStar),
      isMobile ? CONFIG.maxStarsMobile : CONFIG.maxStarsDesktop
    );

    // Populate stars by 4 depth layers
    CONFIG.layers.forEach((layer, layerIdx) => {
      const layerCount = Math.max(1, Math.round(targetCount * layer.ratio));
      for (let i = 0; i < layerCount; i++) {
        const speed = randomRange(layer.speedMin, layer.speedMax);
        const isBright = Math.random() < CONFIG.twinkle.brightRatio;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: randomRange(layer.radiusMin, layer.radiusMax),
          baseOpacity: randomRange(layer.opacityMin, layer.opacityMax),
          layerIndex: layerIdx,
          speedX: Math.cos(layer.driftAngle) * speed,
          speedY: Math.sin(layer.driftAngle) * speed,
          twinklePhase: Math.random() * Math.PI * 2,
          twinklePeriod: randomRange(CONFIG.twinkle.periodMin, CONFIG.twinkle.periodMax),
          amplitude: isBright ? CONFIG.twinkle.amplitudeBright : CONFIG.twinkle.amplitudeNormal,
          isBright,
          // Cursor displacement for layers 3 and 4
          dispX: 0,
          dispY: 0,
          targetDispX: 0,
          targetDispY: 0
        });
      }
    });

    // Populate depth-of-field bokeh foreground circles
    if (CONFIG.bokeh.enabled && !isMobile) {
      const bokehCount = Math.floor(randomRange(CONFIG.bokeh.countMin, CONFIG.bokeh.countMax + 1));
      for (let b = 0; b < bokehCount; b++) {
        const speed = randomRange(CONFIG.bokeh.speedMin, CONFIG.bokeh.speedMax);
        bokehCircles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: randomRange(CONFIG.bokeh.radiusMin, CONFIG.bokeh.radiusMax),
          baseOpacity: randomRange(CONFIG.bokeh.opacityMin, CONFIG.bokeh.opacityMax),
          speedX: Math.cos(-1.15) * speed,
          speedY: Math.sin(-1.15) * speed,
          twinklePhase: Math.random() * Math.PI * 2,
          twinklePeriod: randomRange(4.0, 8.0)
        });
      }
    }
  }

  // Canvas Resize Handler
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    createUniverse();
  }

  // Debounced window resize listener
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
    }, 150);
  }, { passive: true });

  // Spawn Shooting Star (Allow up to 2 concurrent)
  function spawnShootingStar(now) {
    if (activeShootingStars.length >= CONFIG.shootingStars.maxConcurrent) return;

    const angle = randomRange(0.40, 0.75); // Downward-right diagonal
    const length = randomRange(CONFIG.shootingStars.lengthMin, CONFIG.shootingStars.lengthMax);
    const duration = randomRange(CONFIG.shootingStars.durationMin, CONFIG.shootingStars.durationMax);
    const speed = randomRange(CONFIG.shootingStars.speedMin, CONFIG.shootingStars.speedMax);

    const startX = randomRange(-40, width * 0.85);
    const startY = randomRange(-40, height * 0.45);

    activeShootingStars.push({
      startX,
      startY,
      angle,
      length,
      duration,
      speed,
      startTime: now
    });

    nextShootingStarTime = now + randomRange(CONFIG.shootingStars.intervalMin, CONFIG.shootingStars.intervalMax);
  }

  // Render Shooting Stars
  function renderShootingStars(now) {
    if (!CONFIG.shootingStars.enabled) return;

    // Check spawn
    if (now >= nextShootingStarTime && activeShootingStars.length < CONFIG.shootingStars.maxConcurrent) {
      spawnShootingStar(now);
    }

    // Render active
    for (let i = activeShootingStars.length - 1; i >= 0; i--) {
      const star = activeShootingStars[i];
      const elapsed = now - star.startTime;
      const progress = elapsed / star.duration;

      if (progress >= 1) {
        activeShootingStars.splice(i, 1);
        continue;
      }

      const dist = (elapsed / 1000) * star.speed;
      const headX = star.startX + Math.cos(star.angle) * dist;
      const headY = star.startY + Math.sin(star.angle) * dist;
      const tailX = headX - Math.cos(star.angle) * star.length;
      const tailY = headY - Math.sin(star.angle) * star.length;

      let alpha = 1;
      if (progress < 0.2) {
        alpha = progress / 0.2;
      } else if (progress > 0.6) {
        alpha = (1 - progress) / 0.4;
      }
      alpha = Math.max(0, Math.min(1, alpha));

      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.7, `rgba(255, 255, 255, ${(alpha * 0.45).toFixed(3)})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${(alpha * 0.95).toFixed(3)})`);

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.98).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(headX, headY, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Draw Subtle Constellation Lines between Near Stars
  function renderConstellationLines(nearStars) {
    if (!CONFIG.constellations.enabled || nearStars.length < 2 || constellationAlpha < 0.02) return;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.08 * constellationAlpha).toFixed(3)})`;

    let linesDrawn = 0;
    const maxLines = CONFIG.constellations.maxLines;
    const maxDist = CONFIG.constellations.maxDistance;

    for (let i = 0; i < nearStars.length && linesDrawn < maxLines; i++) {
      const s1 = nearStars[i];
      for (let j = i + 1; j < nearStars.length && linesDrawn < maxLines; j++) {
        const s2 = nearStars[j];
        const dx = s1.screenX - s2.screenX;
        const dy = s1.screenY - s2.screenY;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(s1.screenX, s1.screenY);
          ctx.lineTo(s2.screenX, s2.screenY);
          ctx.stroke();
          linesDrawn++;
        }
      }
    }
    ctx.restore();
  }

  // Static Frame (prefers-reduced-motion)
  function renderStaticFrame() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      const layer = CONFIG.layers[star.layerIndex];
      ctx.save();
      if (layer.hasGlow) {
        const glowSize = star.radius * 7;
        ctx.globalAlpha = star.baseOpacity;
        ctx.drawImage(glowSpriteCanvas, star.x - glowSize / 2, star.y - glowSize / 2, glowSize, glowSize);
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${star.baseOpacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // Adaptive Quality Benchmark Check
  function evaluateQuality(currentTime) {
    if (qualityBenchmarkDone) return;
    if (!benchmarkStart) {
      benchmarkStart = currentTime;
      benchmarkFrames = 0;
      return;
    }
    benchmarkFrames++;
    const elapsed = currentTime - benchmarkStart;
    if (elapsed >= CONFIG.quality.benchmarkDuration) {
      const fps = (benchmarkFrames * 1000) / elapsed;
      window.__measuredFps = Math.round(fps);
      qualityBenchmarkDone = true;

      if (fps < CONFIG.quality.fpsThreshold) {
        console.warn(`[Starfield] Average FPS ${fps.toFixed(1)} < ${CONFIG.quality.fpsThreshold}. Adapting quality.`);
        const removeCount = Math.floor(stars.length * CONFIG.quality.degradeStarReduction);
        stars.splice(0, removeCount);
        CONFIG.bokeh.enabled = false;
        CONFIG.constellations.enabled = false;
      }
    }
  }

  // Main Animation Loop
  function loop(currentTime) {
    if (!isRunning) return;

    if (!lastTime) lastTime = currentTime;
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;

    // Run performance benchmark
    evaluateQuality(currentTime);

    // Smooth mouse parallax interpolation
    if (isFinePointer) {
      currentMouseX += (targetMouseX - currentMouseX) * CONFIG.cursor.parallaxEase;
      currentMouseY += (targetMouseY - currentMouseY) * CONFIG.cursor.parallaxEase;
    }

    // Smooth scroll velocity and vertical warp
    smoothScrollVelocity += (rawScrollVelocity - smoothScrollVelocity) * CONFIG.scrollWarp.smoothing;
    rawScrollVelocity *= 0.82; // Velocity decay
    currentWarpStreak = Math.min(CONFIG.scrollWarp.maxStreak, smoothScrollVelocity * CONFIG.scrollWarp.velocityScale);

    // Clear Canvas
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const timeSeconds = currentTime / 1000;

    // Check if cursor is idle over hero section for constellation lines
    const isHeroVisible = scrollY < window.innerHeight * 0.85;
    const isCursorIdle = (currentTime - lastMouseMoveTime) > CONFIG.constellations.idleThresholdMs && isHeroVisible;
    if (isCursorIdle) {
      constellationAlpha = Math.min(1, constellationAlpha + dt * 2.5);
    } else {
      constellationAlpha = Math.max(0, constellationAlpha - dt * 3.5);
    }

    const nearStarsForConstellations = [];

    // Draw Stars Grouped by 4 Layers
    for (let layerIdx = 0; layerIdx < CONFIG.layers.length; layerIdx++) {
      const layer = CONFIG.layers[layerIdx];
      const layerStars = stars.filter(s => s.layerIndex === layerIdx);

      // Mouse parallax shift opposite to cursor
      const mouseOffsetX = isFinePointer ? -currentMouseX * layer.parallaxMouse : 0;
      const mouseOffsetY = isFinePointer ? -currentMouseY * layer.parallaxMouse : 0;
      const scrollOffsetY = scrollY * layer.parallaxScroll;

      ctx.save();

      for (let i = 0; i < layerStars.length; i++) {
        const star = layerStars[i];

        // Motion update with wrapping
        star.x += star.speedX * dt;
        star.y += star.speedY * dt;

        if (star.y < -15) {
          star.y = height + 15;
          star.x = Math.random() * width;
        } else if (star.x > width + 15) {
          star.x = -15;
          star.y = Math.random() * height;
        } else if (star.y > height + 15) {
          star.y = -15;
          star.x = Math.random() * width;
        } else if (star.x < -15) {
          star.x = width + 15;
          star.y = Math.random() * height;
        }

        // Screen position with parallax
        let drawX = (star.x + mouseOffsetX) % width;
        if (drawX < 0) drawX += width;

        let drawY = (star.y - scrollOffsetY + mouseOffsetY) % height;
        if (drawY < 0) drawY += height;

        // Cursor push interaction for layers 3 and 4
        if (layer.canPush && isFinePointer && rawPixelMouseX > -500) {
          const dx = drawX - rawPixelMouseX;
          const dy = drawY - rawPixelMouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < CONFIG.cursor.pushRadius && dist > 1) {
            const force = (1 - dist / CONFIG.cursor.pushRadius) * CONFIG.cursor.pushForce;
            star.targetDispX = (dx / dist) * force;
            star.targetDispY = (dy / dist) * force;
          } else {
            star.targetDispX = 0;
            star.targetDispY = 0;
          }

          // Ease back / spring back over ~1s
          star.dispX += (star.targetDispX - star.dispX) * Math.min(1, dt * CONFIG.cursor.springBackSpeed);
          star.dispY += (star.targetDispY - star.dispY) * Math.min(1, dt * CONFIG.cursor.springBackSpeed);

          drawX += star.dispX;
          drawY += star.dispY;
        }

        // Collect near stars for constellation lines
        if ((layerIdx === 2 || layerIdx === 3) && constellationAlpha > 0.02) {
          nearStarsForConstellations.push({ screenX: drawX, screenY: drawY });
        }

        // Twinkle factor
        const twinkleCycle = ((timeSeconds / star.twinklePeriod) * Math.PI * 2) + star.twinklePhase;
        const twinkleFactor = 1 + star.amplitude * Math.sin(twinkleCycle);
        const currentOpacity = Math.max(0.12, Math.min(1, star.baseOpacity * twinkleFactor));

        // Draw Layer 4 Glow Sprite
        if (layer.hasGlow) {
          const glowSize = star.radius * 7;
          ctx.globalAlpha = (currentOpacity * 0.75);
          ctx.drawImage(glowSpriteCanvas, drawX - glowSize / 2, drawY - glowSize / 2, glowSize, glowSize);
          ctx.globalAlpha = 1.0;
        }

        // Draw Star with Scroll Warp
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity.toFixed(3)})`;
        if (currentWarpStreak > 0.5) {
          ctx.lineWidth = star.radius * 2;
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity.toFixed(3)})`;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(drawX, drawY - currentWarpStreak * 0.5);
          ctx.lineTo(drawX, drawY + currentWarpStreak * 0.5);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    // Render Constellation Lines
    renderConstellationLines(nearStarsForConstellations);

    // Render Depth-of-Field Bokeh Foreground Circles
    if (CONFIG.bokeh.enabled && bokehCircles.length > 0) {
      const bokehMouseX = isFinePointer ? -currentMouseX * CONFIG.bokeh.parallaxMouse : 0;
      const bokehMouseY = isFinePointer ? -currentMouseY * CONFIG.bokeh.parallaxMouse : 0;
      const bokehScrollY = scrollY * 0.12;

      for (let b = 0; b < bokehCircles.length; b++) {
        const bokeh = bokehCircles[b];

        bokeh.x += bokeh.speedX * dt;
        bokeh.y += bokeh.speedY * dt;

        if (bokeh.y < -50) bokeh.y = height + 50;
        else if (bokeh.x > width + 50) bokeh.x = -50;
        else if (bokeh.y > height + 50) bokeh.y = -50;
        else if (bokeh.x < -50) bokeh.x = width + 50;

        let bx = (bokeh.x + bokehMouseX) % width;
        if (bx < 0) bx += width;
        let by = (bokeh.y - bokehScrollY + bokehMouseY) % height;
        if (by < 0) by += height;

        const bokehCycle = ((timeSeconds / bokeh.twinklePeriod) * Math.PI * 2) + bokeh.twinklePhase;
        const opacity = Math.max(0.02, Math.min(0.08, bokeh.baseOpacity * (1 + 0.3 * Math.sin(bokehCycle))));

        ctx.globalAlpha = opacity;
        ctx.drawImage(bokehSpriteCanvas, bx - bokeh.radius, by - bokeh.radius, bokeh.radius * 2, bokeh.radius * 2);
      }
      ctx.globalAlpha = 1.0;
    }

    // Render Shooting Stars
    renderShootingStars(currentTime);

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
