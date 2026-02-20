/**
 * ERP Heatmap & Session Tracker v1.0
 *
 * Standalone tracking script that can be embedded in ANY web application.
 * Captures: clicks, mouse movements, scroll depth, page views, screenshots,
 * rage clicks, idle time, element interactions, and performance metrics.
 *
 * Usage: Add this script to your ERP/website:
 *   <script src="https://your-domain.com/erp-tracker.js"
 *           data-endpoint="https://your-domain.com/api/tracking"
 *           data-user-id="employee-123"
 *           data-session-capture="true"
 *           data-screenshot-interval="30000"
 *   ></script>
 */
(function () {
  "use strict";

  // ─── Configuration ───────────────────────────────────────────────
  const scriptTag = document.currentScript || document.querySelector('script[data-endpoint]');
  const CONFIG = {
    endpoint: scriptTag?.getAttribute("data-endpoint") || "/api/tracking",
    userId: scriptTag?.getAttribute("data-user-id") || "anonymous",
    sessionCapture: scriptTag?.getAttribute("data-session-capture") !== "false",
    screenshotInterval: parseInt(scriptTag?.getAttribute("data-screenshot-interval") || "30000", 10),
    flushInterval: 5000,        // Send data every 5 seconds
    mouseSampleRate: 100,       // Sample mouse position every 100ms
    scrollSampleRate: 250,      // Sample scroll every 250ms
    rageClickThreshold: 3,      // 3 clicks in 1 second = rage click
    rageClickWindow: 1000,      // 1 second window
    idleTimeout: 60000,         // 1 minute idle = inactive
    maxBatchSize: 500,          // Max events per batch
    captureScreenshots: scriptTag?.getAttribute("data-screenshots") !== "false",
  };

  // ─── State ───────────────────────────────────────────────────────
  const sessionId = generateSessionId();
  const startTime = Date.now();
  let eventBuffer = [];
  let mouseTrail = [];
  let clickHistory = [];
  let isIdle = false;
  let lastActivity = Date.now();
  let scrollDepthMax = 0;
  let pageViewCount = 0;
  let currentPageUrl = window.location.href;
  let screenshotTimer = null;

  // ─── Utilities ───────────────────────────────────────────────────
  function generateSessionId() {
    return "sess_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 9);
  }

  function getTimestamp() {
    return Date.now();
  }

  function getElementSelector(el) {
    if (!el || el === document.body || el === document.documentElement) return "body";
    const parts = [];
    let current = el;
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += "#" + current.id;
        parts.unshift(selector);
        break;
      }
      if (current.className && typeof current.className === "string") {
        const classes = current.className.trim().split(/\s+/).slice(0, 2).join(".");
        if (classes) selector += "." + classes;
      }
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (c) => c.tagName === current.tagName
        );
        if (siblings.length > 1) {
          selector += ":nth-child(" + (Array.from(parent.children).indexOf(current) + 1) + ")";
        }
      }
      parts.unshift(selector);
      current = current.parentElement;
    }
    return parts.join(" > ");
  }

  function getElementMeta(el) {
    if (!el) return {};
    return {
      tag: el.tagName?.toLowerCase(),
      id: el.id || null,
      classes: el.className && typeof el.className === "string"
        ? el.className.trim().split(/\s+/).slice(0, 3)
        : [],
      text: (el.textContent || "").trim().substring(0, 100),
      href: el.href || el.closest?.("a")?.href || null,
      selector: getElementSelector(el),
      rect: el.getBoundingClientRect
        ? {
            x: Math.round(el.getBoundingClientRect().x),
            y: Math.round(el.getBoundingClientRect().y),
            w: Math.round(el.getBoundingClientRect().width),
            h: Math.round(el.getBoundingClientRect().height),
          }
        : null,
    };
  }

  function getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: Math.round(window.scrollX),
      scrollY: Math.round(window.scrollY),
      docHeight: document.documentElement.scrollHeight,
      docWidth: document.documentElement.scrollWidth,
    };
  }

  // ─── Event Recording ────────────────────────────────────────────
  function recordEvent(type, data) {
    const event = {
      type: type,
      timestamp: getTimestamp(),
      sessionId: sessionId,
      userId: CONFIG.userId,
      url: window.location.href,
      path: window.location.pathname,
      viewport: getViewportInfo(),
      data: data,
    };
    eventBuffer.push(event);

    if (eventBuffer.length >= CONFIG.maxBatchSize) {
      flush();
    }
  }

  // ─── Click Tracking ─────────────────────────────────────────────
  function handleClick(e) {
    lastActivity = Date.now();
    const x = e.clientX;
    const y = e.clientY;
    const pageX = e.pageX;
    const pageY = e.pageY;

    recordEvent("click", {
      x: x,
      y: y,
      pageX: pageX,
      pageY: pageY,
      button: e.button,
      element: getElementMeta(e.target),
      timestamp: getTimestamp(),
    });

    // Rage click detection
    const now = Date.now();
    clickHistory.push({ x: x, y: y, time: now });
    clickHistory = clickHistory.filter((c) => now - c.time < CONFIG.rageClickWindow);

    if (clickHistory.length >= CONFIG.rageClickThreshold) {
      const avgX = clickHistory.reduce((sum, c) => sum + c.x, 0) / clickHistory.length;
      const avgY = clickHistory.reduce((sum, c) => sum + c.y, 0) / clickHistory.length;
      const isCluster = clickHistory.every(
        (c) => Math.abs(c.x - avgX) < 50 && Math.abs(c.y - avgY) < 50
      );
      if (isCluster) {
        recordEvent("rage_click", {
          x: Math.round(avgX),
          y: Math.round(avgY),
          clickCount: clickHistory.length,
          element: getElementMeta(e.target),
        });
      }
      clickHistory = [];
    }
  }

  // ─── Mouse Movement Tracking ────────────────────────────────────
  let mouseThrottleTimer = null;
  function handleMouseMove(e) {
    lastActivity = Date.now();
    if (mouseThrottleTimer) return;
    mouseThrottleTimer = setTimeout(() => {
      mouseThrottleTimer = null;
    }, CONFIG.mouseSampleRate);

    mouseTrail.push({
      x: e.clientX,
      y: e.clientY,
      pageX: e.pageX,
      pageY: e.pageY,
      t: getTimestamp(),
    });

    // Batch mouse trails — flush every 50 points
    if (mouseTrail.length >= 50) {
      recordEvent("mouse_trail", {
        points: mouseTrail.slice(),
      });
      mouseTrail = [];
    }
  }

  // ─── Scroll Tracking ───────────────────────────────────────────
  let scrollThrottleTimer = null;
  function handleScroll() {
    lastActivity = Date.now();
    if (scrollThrottleTimer) return;
    scrollThrottleTimer = setTimeout(() => {
      scrollThrottleTimer = null;
    }, CONFIG.scrollSampleRate);

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    if (scrollPercent > scrollDepthMax) {
      scrollDepthMax = scrollPercent;
    }

    recordEvent("scroll", {
      scrollY: Math.round(scrollTop),
      scrollPercent: scrollPercent,
      maxDepth: scrollDepthMax,
    });
  }

  // ─── Form Interaction Tracking ──────────────────────────────────
  function handleFocus(e) {
    lastActivity = Date.now();
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") {
      recordEvent("form_focus", {
        element: getElementMeta(e.target),
        fieldType: e.target.type || e.target.tagName.toLowerCase(),
        fieldName: e.target.name || e.target.id || null,
      });
    }
  }

  function handleBlur(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") {
      recordEvent("form_blur", {
        element: getElementMeta(e.target),
        fieldType: e.target.type || e.target.tagName.toLowerCase(),
        fieldName: e.target.name || e.target.id || null,
        // Don't capture actual values for privacy — just whether it was filled
        hasValue: !!e.target.value,
      });
    }
  }

  // ─── Visibility & Idle Tracking ─────────────────────────────────
  function handleVisibilityChange() {
    recordEvent("visibility", {
      hidden: document.hidden,
      state: document.visibilityState,
    });
  }

  function checkIdle() {
    const now = Date.now();
    const wasIdle = isIdle;
    isIdle = now - lastActivity > CONFIG.idleTimeout;

    if (isIdle && !wasIdle) {
      recordEvent("idle_start", { idleAfter: CONFIG.idleTimeout });
    } else if (!isIdle && wasIdle) {
      recordEvent("idle_end", { idleDuration: now - (lastActivity - CONFIG.idleTimeout) });
    }
  }

  // ─── Page Navigation Tracking ───────────────────────────────────
  function trackPageView() {
    pageViewCount++;
    currentPageUrl = window.location.href;
    scrollDepthMax = 0;

    recordEvent("page_view", {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      pageViewNumber: pageViewCount,
    });
  }

  // Track SPA navigation (hash changes and pushState)
  let lastPathname = window.location.pathname + window.location.hash;
  function checkNavigation() {
    const current = window.location.pathname + window.location.hash;
    if (current !== lastPathname) {
      // Record page exit for previous page
      recordEvent("page_exit", {
        url: currentPageUrl,
        timeOnPage: Date.now() - startTime,
        maxScrollDepth: scrollDepthMax,
      });
      lastPathname = current;
      trackPageView();
    }
  }

  // Intercept pushState and replaceState for SPA tracking
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    setTimeout(checkNavigation, 0);
  };
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    setTimeout(checkNavigation, 0);
  };
  window.addEventListener("popstate", function () {
    setTimeout(checkNavigation, 0);
  });

  // ─── Performance Tracking ──────────────────────────────────────
  function capturePerformance() {
    if (!window.performance) return;

    const nav = performance.getEntriesByType("navigation")[0];
    if (nav) {
      recordEvent("performance", {
        dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
        tcp: Math.round(nav.connectEnd - nav.connectStart),
        ttfb: Math.round(nav.responseStart - nav.requestStart),
        domLoad: Math.round(nav.domContentLoadedEventEnd - nav.fetchStart),
        fullLoad: Math.round(nav.loadEventEnd - nav.fetchStart),
        domInteractive: Math.round(nav.domInteractive - nav.fetchStart),
        transferSize: nav.transferSize || 0,
      });
    }

    // Core Web Vitals (if available)
    if (window.PerformanceObserver) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver(function (list) {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          recordEvent("web_vital", {
            name: "LCP",
            value: Math.round(lastEntry.startTime),
          });
        });
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

        // First Input Delay
        const fidObserver = new PerformanceObserver(function (list) {
          const entries = list.getEntries();
          entries.forEach(function (entry) {
            recordEvent("web_vital", {
              name: "FID",
              value: Math.round(entry.processingStart - entry.startTime),
            });
          });
        });
        fidObserver.observe({ type: "first-input", buffered: true });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(function (list) {
          list.getEntries().forEach(function (entry) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          recordEvent("web_vital", {
            name: "CLS",
            value: Math.round(clsValue * 1000) / 1000,
          });
        });
        clsObserver.observe({ type: "layout-shift", buffered: true });
      } catch (e) {
        // PerformanceObserver not fully supported
      }
    }
  }

  // ─── Screenshot Capture ─────────────────────────────────────────
  function captureScreenshot() {
    if (!CONFIG.captureScreenshots) return;

    // Use html2canvas-like approach via canvas API
    // For a lightweight approach, we capture a DOM snapshot instead
    try {
      const snapshot = {
        html: document.documentElement.outerHTML.substring(0, 50000), // First 50KB
        url: window.location.href,
        title: document.title,
        viewport: getViewportInfo(),
        timestamp: getTimestamp(),
      };

      recordEvent("dom_snapshot", {
        snapshot: snapshot.html,
        url: snapshot.url,
        title: snapshot.title,
      });
    } catch (e) {
      // Snapshot capture failed silently
    }
  }

  // ─── Element Visibility Tracking ────────────────────────────────
  function setupVisibilityTracking() {
    if (!window.IntersectionObserver) return;

    // Track which sections/panels are actually seen by users
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            recordEvent("element_visible", {
              element: getElementMeta(entry.target),
              visiblePercent: Math.round(entry.intersectionRatio * 100),
            });
          }
        });
      },
      { threshold: [0.25, 0.5, 0.75, 1.0] }
    );

    // Observe major sections — panels, dashboards, sidebars, main content areas
    const selectors = [
      "main", "section", "aside", "nav", "header", "footer",
      "[role='main']", "[role='navigation']", "[role='complementary']",
      ".panel", ".dashboard", ".card", ".widget", ".sidebar",
      "[data-track]", // Custom attribute for elements you want to track
    ];

    selectors.forEach(function (sel) {
      try {
        document.querySelectorAll(sel).forEach(function (el) {
          observer.observe(el);
        });
      } catch (e) {
        // Invalid selector
      }
    });
  }

  // ─── Error Tracking ─────────────────────────────────────────────
  function handleError(e) {
    recordEvent("js_error", {
      message: e.message || "Unknown error",
      filename: e.filename || null,
      line: e.lineno || null,
      col: e.colno || null,
      stack: e.error?.stack?.substring(0, 500) || null,
    });
  }

  // ─── Data Flushing ──────────────────────────────────────────────
  function flush() {
    if (eventBuffer.length === 0) return;

    const batch = eventBuffer.splice(0, CONFIG.maxBatchSize);
    const payload = {
      sessionId: sessionId,
      userId: CONFIG.userId,
      userAgent: navigator.userAgent,
      screenResolution: screen.width + "x" + screen.height,
      language: navigator.language,
      platform: navigator.platform,
      timestamp: getTimestamp(),
      events: batch,
    };

    // Use sendBeacon for reliability (works even on page close)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const sent = navigator.sendBeacon(CONFIG.endpoint, blob);
      if (!sent) {
        // Fallback to fetch
        sendViaFetch(payload);
      }
    } else {
      sendViaFetch(payload);
    }
  }

  function sendViaFetch(payload) {
    try {
      fetch(CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(function () {
        // Silently fail — don't disrupt the ERP
      });
    } catch (e) {
      // Silently fail
    }
  }

  // ─── Session Summary on Exit ────────────────────────────────────
  function handleBeforeUnload() {
    // Flush remaining mouse trail
    if (mouseTrail.length > 0) {
      recordEvent("mouse_trail", { points: mouseTrail.slice() });
      mouseTrail = [];
    }

    // Send session summary
    recordEvent("session_end", {
      duration: Date.now() - startTime,
      pageViewCount: pageViewCount,
      maxScrollDepth: scrollDepthMax,
      finalUrl: window.location.href,
    });

    flush();
  }

  // ─── Initialize ─────────────────────────────────────────────────
  function init() {
    // Record session start
    recordEvent("session_start", {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screen: screen.width + "x" + screen.height,
      viewport: getViewportInfo(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // Track initial page view
    trackPageView();

    // Attach event listeners
    document.addEventListener("click", handleClick, { capture: true, passive: true });
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("focusin", handleFocus, { passive: true });
    document.addEventListener("focusout", handleBlur, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("error", handleError);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Periodic tasks
    setInterval(flush, CONFIG.flushInterval);
    setInterval(checkIdle, 10000);

    // Screenshot/DOM snapshot capture
    if (CONFIG.captureScreenshots && CONFIG.screenshotInterval > 0) {
      screenshotTimer = setInterval(captureScreenshot, CONFIG.screenshotInterval);
    }

    // Performance capture after page load
    if (document.readyState === "complete") {
      capturePerformance();
      setupVisibilityTracking();
    } else {
      window.addEventListener("load", function () {
        setTimeout(capturePerformance, 1000);
        setupVisibilityTracking();
      });
    }

    // Log to console in dev mode
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.log("[ERP Tracker] Initialized", {
        sessionId: sessionId,
        userId: CONFIG.userId,
        endpoint: CONFIG.endpoint,
      });
    }
  }

  // Start tracking
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ─── Public API (optional) ──────────────────────────────────────
  window.__erpTracker = {
    getSessionId: function () { return sessionId; },
    getUserId: function () { return CONFIG.userId; },
    setUserId: function (id) { CONFIG.userId = id; },
    trackEvent: function (name, data) { recordEvent("custom", { name: name, data: data }); },
    flush: flush,
    getEventCount: function () { return eventBuffer.length; },
  };
})();
