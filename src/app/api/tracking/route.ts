import { NextRequest, NextResponse } from "next/server";
import {
  addEvents,
  getClickHeatmapData,
  getMouseHeatmapData,
  getScrollDepthData,
  getRageClicks,
  getSessionList,
  getSessionEvents,
  getPageStats,
  getPerformanceData,
  getEventCount,
  getSessionCount,
  getUniqueUserCount,
  getElementInteractions,
  type TrackingBatch,
} from "@/lib/tracking-store";

// POST /api/tracking — Receive tracking events from the tracker script
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let batch: TrackingBatch;

    if (contentType.includes("application/json")) {
      batch = await request.json();
    } else {
      // Handle sendBeacon blob
      const text = await request.text();
      batch = JSON.parse(text);
    }

    if (!batch.sessionId || !batch.events || !Array.isArray(batch.events)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    addEvents(batch);

    return NextResponse.json({
      ok: true,
      received: batch.events.length,
    });
  } catch (error) {
    console.error("[Tracking API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/tracking — Query tracking data for the dashboard
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "overview";
  const path = searchParams.get("path") || undefined;
  const sessionId = searchParams.get("sessionId") || undefined;

  try {
    switch (query) {
      case "overview":
        return NextResponse.json({
          totalEvents: getEventCount(),
          totalSessions: getSessionCount(),
          uniqueUsers: getUniqueUserCount(),
          pages: getPageStats(),
        });

      case "heatmap":
        return NextResponse.json({
          clicks: getClickHeatmapData(path),
          mouse: getMouseHeatmapData(path),
          scrollDepth: getScrollDepthData(path),
        });

      case "rage-clicks":
        return NextResponse.json({
          rageClicks: getRageClicks(path),
        });

      case "sessions":
        return NextResponse.json({
          sessions: getSessionList(),
        });

      case "session-events":
        if (!sessionId) {
          return NextResponse.json({ error: "sessionId required" }, { status: 400 });
        }
        return NextResponse.json({
          events: getSessionEvents(sessionId),
        });

      case "performance":
        return NextResponse.json({
          metrics: getPerformanceData(),
        });

      case "elements":
        return NextResponse.json({
          elements: getElementInteractions(path),
        });

      default:
        return NextResponse.json({ error: "Unknown query type" }, { status: 400 });
    }
  } catch (error) {
    console.error("[Tracking API] Query error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
