"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────
interface PageStat {
  path: string;
  views: number;
  clicks: number;
  avgScrollDepth: number;
  rageClicks: number;
}

interface HeatmapPoint {
  x: number;
  y: number;
  pageX: number;
  pageY: number;
  value: number;
  path: string;
  elementSelector?: string;
}

interface SessionSummary {
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

interface ElementInteraction {
  selector: string;
  clicks: number;
  text: string;
}

interface OverviewData {
  totalEvents: number;
  totalSessions: number;
  uniqueUsers: number;
  pages: PageStat[];
}

interface HeatmapData {
  clicks: HeatmapPoint[];
  mouse: HeatmapPoint[];
  scrollDepth: Array<{ depth: number; count: number }>;
}

// ─── Heatmap Canvas Renderer ──────────────────────────────────────
function HeatmapCanvas({
  points,
  width,
  height,
  label,
}: {
  points: HeatmapPoint[];
  width: number;
  height: number;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    // Dark background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);

    const maxValue = Math.max(...points.map((p) => p.value), 1);

    // Draw heatmap points
    for (const point of points) {
      const intensity = point.value / maxValue;
      const radius = 15 + intensity * 30;

      // Scale coordinates to canvas size
      const cx = (point.pageX / 1920) * width;
      const cy = (point.pageY / 3000) * height;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

      if (intensity > 0.7) {
        gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(255, 165, 0, ${intensity * 0.4})`);
        gradient.addColorStop(1, "rgba(255, 255, 0, 0)");
      } else if (intensity > 0.3) {
        gradient.addColorStop(0, `rgba(255, 165, 0, ${intensity * 0.7})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 0, ${intensity * 0.3})`);
        gradient.addColorStop(1, "rgba(0, 255, 0, 0)");
      } else {
        gradient.addColorStop(0, `rgba(0, 100, 255, ${intensity * 0.6})`);
        gradient.addColorStop(0.5, `rgba(0, 200, 255, ${intensity * 0.2})`);
        gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }

    // Label
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.fillText(label, 10, 20);
    ctx.fillText(`${points.length} data points`, 10, 40);
  }, [points, width, height, label]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg border border-gray-700"
      style={{ maxHeight: height }}
    />
  );
}

// ─── Scroll Depth Visualization ───────────────────────────────────
function ScrollDepthChart({ data }: { data: Array<{ depth: number; count: number }> }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.depth} className="flex items-center gap-3">
          <span className="w-16 text-right text-sm text-gray-400 font-mono">{d.depth}%</span>
          <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${(d.count / maxCount) * 100}%`,
                background: `linear-gradient(90deg,
                  ${d.depth < 30 ? "#22c55e" : d.depth < 60 ? "#eab308" : d.depth < 80 ? "#f97316" : "#ef4444"},
                  ${d.depth < 30 ? "#16a34a" : d.depth < 60 ? "#ca8a04" : d.depth < 80 ? "#ea580c" : "#dc2626"})`,
              }}
            />
          </div>
          <span className="w-16 text-sm text-gray-400 font-mono">{d.count}</span>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">No scroll data yet</p>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────
export default function HeatmapDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "heatmap" | "sessions" | "elements">("overview");
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [elements, setElements] = useState<ElementInteraction[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      switch (activeTab) {
        case "overview": {
          const res = await fetch("/api/tracking?q=overview");
          const data = await res.json();
          setOverview(data);
          break;
        }
        case "heatmap": {
          const pathParam = selectedPath ? `&path=${encodeURIComponent(selectedPath)}` : "";
          const res = await fetch(`/api/tracking?q=heatmap${pathParam}`);
          const data = await res.json();
          setHeatmapData(data);
          break;
        }
        case "sessions": {
          const res = await fetch("/api/tracking?q=sessions");
          const data = await res.json();
          setSessions(data.sessions || []);
          break;
        }
        case "elements": {
          const pathParam = selectedPath ? `&path=${encodeURIComponent(selectedPath)}` : "";
          const res = await fetch(`/api/tracking?q=elements${pathParam}`);
          const data = await res.json();
          setElements(data.elements || []);
          break;
        }
      }
    } catch (err) {
      console.error("Failed to fetch tracking data:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedPath]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  }

  function formatTime(ts: number): string {
    return new Date(ts).toLocaleString();
  }

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "heatmap" as const, label: "Heatmaps" },
    { id: "sessions" as const, label: "Sessions" },
    { id: "elements" as const, label: "Elements" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">ERP Heatmap Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">
                Real-time user behavior tracking &amp; analytics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-800"
                />
                Auto-refresh
              </label>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-gray-800 text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading && !overview && !heatmapData && sessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 mt-4">Loading tracking data...</p>
          </div>
        ) : (
          <>
            {/* ─── Overview Tab ─────────────────────────────── */}
            {activeTab === "overview" && overview && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Total Events</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {overview.totalEvents.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Active Sessions</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {overview.totalSessions.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Unique Users</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {overview.uniqueUsers.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Page Stats Table */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold text-white">Page Statistics</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Click a page to view its heatmap
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">
                            Page Path
                          </th>
                          <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">
                            Views
                          </th>
                          <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">
                            Clicks
                          </th>
                          <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">
                            Avg Scroll
                          </th>
                          <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">
                            Rage Clicks
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {overview.pages.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                              No page data yet. Start tracking to see results.
                            </td>
                          </tr>
                        ) : (
                          overview.pages.map((page) => (
                            <tr
                              key={page.path}
                              className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
                              onClick={() => {
                                setSelectedPath(page.path);
                                setActiveTab("heatmap");
                              }}
                            >
                              <td className="px-6 py-3 font-mono text-sm text-blue-400">
                                {page.path}
                              </td>
                              <td className="text-right px-6 py-3 text-sm">{page.views}</td>
                              <td className="text-right px-6 py-3 text-sm">{page.clicks}</td>
                              <td className="text-right px-6 py-3 text-sm">
                                {page.avgScrollDepth}%
                              </td>
                              <td className="text-right px-6 py-3 text-sm">
                                {page.rageClicks > 0 ? (
                                  <span className="text-red-400 font-medium">
                                    {page.rageClicks}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">0</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Setup Instructions
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Add this script tag to your ERP system or any web page you want to track:
                  </p>
                  <pre className="bg-gray-800 rounded-lg p-4 text-sm text-green-400 overflow-x-auto">
{`<script
  src="${typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/erp-tracker.js"
  data-endpoint="${typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/api/tracking"
  data-user-id="employee-name-or-id"
  data-session-capture="true"
  data-screenshot-interval="30000"
></script>`}
                  </pre>
                  <div className="mt-4 space-y-2 text-sm text-gray-400">
                    <p><strong className="text-gray-300">data-endpoint:</strong> URL where tracking data is sent</p>
                    <p><strong className="text-gray-300">data-user-id:</strong> Employee identifier for filtering</p>
                    <p><strong className="text-gray-300">data-screenshot-interval:</strong> DOM snapshot interval in ms (default: 30s)</p>
                    <p><strong className="text-gray-300">data-screenshots:</strong> Set to &quot;false&quot; to disable DOM snapshots</p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Heatmap Tab ──────────────────────────────── */}
            {activeTab === "heatmap" && (
              <div className="space-y-8">
                {/* Path filter */}
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400">Filter by page:</label>
                  <input
                    type="text"
                    value={selectedPath}
                    onChange={(e) => setSelectedPath(e.target.value)}
                    placeholder="/dashboard or leave empty for all"
                    className="flex-1 max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => { setSelectedPath(""); fetchData(); }}
                    className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                </div>

                {heatmapData && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Click Heatmap */}
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Click Heatmap</h3>
                      <HeatmapCanvas
                        points={heatmapData.clicks}
                        width={600}
                        height={400}
                        label="Clicks"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        {heatmapData.clicks.length} click zones recorded
                      </p>
                    </div>

                    {/* Mouse Movement Heatmap */}
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Mouse Movement Heatmap
                      </h3>
                      <HeatmapCanvas
                        points={heatmapData.mouse}
                        width={600}
                        height={400}
                        label="Mouse Movement"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        {heatmapData.mouse.length} movement zones recorded
                      </p>
                    </div>

                    {/* Scroll Depth */}
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 lg:col-span-2">
                      <h3 className="text-lg font-semibold text-white mb-4">Scroll Depth</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        How far down the page users scroll (percentage of page height)
                      </p>
                      <ScrollDepthChart data={heatmapData.scrollDepth} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── Sessions Tab ─────────────────────────────── */}
            {activeTab === "sessions" && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h2 className="text-lg font-semibold text-white">User Sessions</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {sessions.length} sessions recorded
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">
                          User
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">
                          Started
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">
                          Duration
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">
                          Pages
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">
                          Clicks
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">
                          Rage
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">
                          Resolution
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            No sessions recorded yet
                          </td>
                        </tr>
                      ) : (
                        sessions.map((s) => (
                          <tr
                            key={s.sessionId}
                            className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="px-6 py-3 text-sm font-medium text-blue-400">
                              {s.userId}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-300">
                              {formatTime(s.startTime)}
                            </td>
                            <td className="text-right px-6 py-3 text-sm font-mono">
                              {formatDuration(s.duration)}
                            </td>
                            <td className="text-right px-6 py-3 text-sm">{s.pageViews}</td>
                            <td className="text-right px-6 py-3 text-sm">{s.totalClicks}</td>
                            <td className="text-right px-6 py-3 text-sm">
                              {s.rageClicks > 0 ? (
                                <span className="text-red-400 font-medium">{s.rageClicks}</span>
                              ) : (
                                <span className="text-gray-500">0</span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-400 font-mono">
                              {s.screenResolution}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── Elements Tab ─────────────────────────────── */}
            {activeTab === "elements" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400">Filter by page:</label>
                  <input
                    type="text"
                    value={selectedPath}
                    onChange={(e) => setSelectedPath(e.target.value)}
                    placeholder="/dashboard or leave empty for all"
                    className="flex-1 max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold text-white">
                      Most Clicked Elements
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Elements ranked by interaction frequency — helps identify what users
                      use most and what can be optimized
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">
                            #
                          </th>
                          <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">
                            Element
                          </th>
                          <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">
                            Text
                          </th>
                          <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">
                            Clicks
                          </th>
                          <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">
                            Frequency
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {elements.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                              No element interaction data yet
                            </td>
                          </tr>
                        ) : (
                          elements.map((el, i) => {
                            const maxClicks = elements[0]?.clicks || 1;
                            return (
                              <tr
                                key={el.selector}
                                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                              >
                                <td className="px-6 py-3 text-sm text-gray-500">{i + 1}</td>
                                <td className="px-6 py-3 text-sm font-mono text-blue-400 max-w-xs truncate">
                                  {el.selector}
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-300 max-w-xs truncate">
                                  {el.text || "—"}
                                </td>
                                <td className="text-right px-6 py-3 text-sm font-medium">
                                  {el.clicks}
                                </td>
                                <td className="px-6 py-3 w-40">
                                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 rounded-full"
                                      style={{
                                        width: `${(el.clicks / maxClicks) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
