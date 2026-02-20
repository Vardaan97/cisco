/**
 * In-memory tracking data store.
 *
 * In production, replace this with a database (PostgreSQL, ClickHouse, etc.)
 * This in-memory store is suitable for development and small deployments.
 * For production at scale, use:
 *   - ClickHouse (best for time-series analytics)
 *   - PostgreSQL with TimescaleDB extension
 *   - MongoDB (flexible schema for event data)
 */

export interface TrackingEvent {
  type: string;
  timestamp: number;
  sessionId: string;
  userId: string;
  url: string;
  path: string;
  viewport: {
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
    docHeight: number;
    docWidth: number;
  };
  data: Record<string, unknown>;
}

export interface TrackingBatch {
  sessionId: string;
  userId: string;
  userAgent: string;
  screenResolution: string;
  language: string;
  platform: string;
  timestamp: number;
  events: TrackingEvent[];
}

export interface SessionSummary {
  sessionId: string;
  userId: string;
  startTime: number;
  endTime: number;
  duration: number;
  pageViews: number;
  totalClicks: number;
  rageClicks: number;
  maxScrollDepth: number;
  pagesVisited: string[];
  userAgent: string;
  screenResolution: string;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  pageX: number;
  pageY: number;
  value: number;
  path: string;
  elementSelector?: string;
}

// In-memory storage (replace with DB in production)
const store = {
  events: [] as TrackingEvent[],
  sessions: new Map<string, SessionSummary>(),
  maxEvents: 100000, // Limit in-memory storage
};

export function addEvents(batch: TrackingBatch): void {
  const events = batch.events;

  // Initialize or update session
  if (!store.sessions.has(batch.sessionId)) {
    store.sessions.set(batch.sessionId, {
      sessionId: batch.sessionId,
      userId: batch.userId,
      startTime: batch.timestamp,
      endTime: batch.timestamp,
      duration: 0,
      pageViews: 0,
      totalClicks: 0,
      rageClicks: 0,
      maxScrollDepth: 0,
      pagesVisited: [],
      userAgent: batch.userAgent,
      screenResolution: batch.screenResolution,
    });
  }

  const session = store.sessions.get(batch.sessionId)!;
  session.endTime = batch.timestamp;
  session.duration = session.endTime - session.startTime;

  for (const event of events) {
    // Trim storage if needed
    if (store.events.length >= store.maxEvents) {
      store.events.splice(0, store.maxEvents / 2);
    }
    store.events.push(event);

    // Update session aggregates
    switch (event.type) {
      case "click":
        session.totalClicks++;
        break;
      case "rage_click":
        session.rageClicks++;
        break;
      case "page_view":
        session.pageViews++;
        if (event.path && !session.pagesVisited.includes(event.path)) {
          session.pagesVisited.push(event.path);
        }
        break;
      case "scroll":
        if (
          typeof event.data?.maxDepth === "number" &&
          event.data.maxDepth > session.maxScrollDepth
        ) {
          session.maxScrollDepth = event.data.maxDepth as number;
        }
        break;
    }
  }
}

export function getClickHeatmapData(path?: string): HeatmapPoint[] {
  const clicks = store.events.filter(
    (e) => e.type === "click" && (!path || e.path === path)
  );

  // Aggregate clicks by approximate position (10px grid)
  const grid = new Map<string, HeatmapPoint>();
  for (const click of clicks) {
    const data = click.data as { x?: number; y?: number; pageX?: number; pageY?: number; element?: { selector?: string } };
    if (typeof data.pageX !== "number" || typeof data.pageY !== "number") continue;

    const gx = Math.round((data.pageX ?? 0) / 10) * 10;
    const gy = Math.round((data.pageY ?? 0) / 10) * 10;
    const key = `${gx},${gy},${click.path}`;

    if (grid.has(key)) {
      grid.get(key)!.value++;
    } else {
      grid.set(key, {
        x: data.x ?? gx,
        y: data.y ?? gy,
        pageX: gx,
        pageY: gy,
        value: 1,
        path: click.path,
        elementSelector: data.element?.selector,
      });
    }
  }

  return Array.from(grid.values()).sort((a, b) => b.value - a.value);
}

export function getMouseHeatmapData(path?: string): HeatmapPoint[] {
  const trails = store.events.filter(
    (e) => e.type === "mouse_trail" && (!path || e.path === path)
  );

  const grid = new Map<string, HeatmapPoint>();
  for (const trail of trails) {
    const points = (trail.data as { points?: Array<{ x: number; y: number; pageX: number; pageY: number }> }).points;
    if (!points) continue;

    for (const p of points) {
      const gx = Math.round(p.pageX / 20) * 20;
      const gy = Math.round(p.pageY / 20) * 20;
      const key = `${gx},${gy},${trail.path}`;

      if (grid.has(key)) {
        grid.get(key)!.value++;
      } else {
        grid.set(key, {
          x: p.x,
          y: p.y,
          pageX: gx,
          pageY: gy,
          value: 1,
          path: trail.path,
        });
      }
    }
  }

  return Array.from(grid.values()).sort((a, b) => b.value - a.value);
}

export function getScrollDepthData(path?: string): Array<{ depth: number; count: number }> {
  const scrolls = store.events.filter(
    (e) => e.type === "scroll" && (!path || e.path === path)
  );

  const depthBuckets = new Map<number, number>();
  for (const s of scrolls) {
    const percent = (s.data as { scrollPercent?: number }).scrollPercent;
    if (typeof percent !== "number") continue;
    const bucket = Math.floor(percent / 10) * 10;
    depthBuckets.set(bucket, (depthBuckets.get(bucket) || 0) + 1);
  }

  return Array.from(depthBuckets.entries())
    .map(([depth, count]) => ({ depth, count }))
    .sort((a, b) => a.depth - b.depth);
}

export function getRageClicks(path?: string): TrackingEvent[] {
  return store.events.filter(
    (e) => e.type === "rage_click" && (!path || e.path === path)
  );
}

export function getSessionList(): SessionSummary[] {
  return Array.from(store.sessions.values()).sort(
    (a, b) => b.startTime - a.startTime
  );
}

export function getSessionEvents(sessionId: string): TrackingEvent[] {
  return store.events
    .filter((e) => e.sessionId === sessionId)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function getPageStats(): Array<{
  path: string;
  views: number;
  clicks: number;
  avgScrollDepth: number;
  rageClicks: number;
}> {
  const pages = new Map<string, { views: number; clicks: number; scrollDepths: number[]; rageClicks: number }>();

  for (const e of store.events) {
    if (!pages.has(e.path)) {
      pages.set(e.path, { views: 0, clicks: 0, scrollDepths: [], rageClicks: 0 });
    }
    const page = pages.get(e.path)!;

    switch (e.type) {
      case "page_view":
        page.views++;
        break;
      case "click":
        page.clicks++;
        break;
      case "scroll":
        if (typeof (e.data as { maxDepth?: number }).maxDepth === "number") {
          page.scrollDepths.push((e.data as { maxDepth: number }).maxDepth);
        }
        break;
      case "rage_click":
        page.rageClicks++;
        break;
    }
  }

  return Array.from(pages.entries()).map(([path, data]) => ({
    path,
    views: data.views,
    clicks: data.clicks,
    avgScrollDepth:
      data.scrollDepths.length > 0
        ? Math.round(data.scrollDepths.reduce((a, b) => a + b, 0) / data.scrollDepths.length)
        : 0,
    rageClicks: data.rageClicks,
  }));
}

export function getPerformanceData(): TrackingEvent[] {
  return store.events.filter((e) => e.type === "performance" || e.type === "web_vital");
}

export function getEventCount(): number {
  return store.events.length;
}

export function getSessionCount(): number {
  return store.sessions.size;
}

export function getUniqueUserCount(): number {
  const users = new Set(store.events.map((e) => e.userId));
  return users.size;
}

export function getElementInteractions(path?: string): Array<{
  selector: string;
  clicks: number;
  text: string;
}> {
  const elements = new Map<string, { clicks: number; text: string }>();

  const clicks = store.events.filter(
    (e) => e.type === "click" && (!path || e.path === path)
  );

  for (const click of clicks) {
    const data = click.data as { element?: { selector?: string; text?: string } };
    const selector = data.element?.selector;
    if (!selector) continue;

    if (!elements.has(selector)) {
      elements.set(selector, { clicks: 0, text: data.element?.text || "" });
    }
    elements.get(selector)!.clicks++;
  }

  return Array.from(elements.entries())
    .map(([selector, data]) => ({ selector, ...data }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 50);
}
