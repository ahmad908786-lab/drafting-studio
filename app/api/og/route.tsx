import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "2D AutoCAD Drafting").slice(0, 120);
  const eyebrow = (searchParams.get("eyebrow") ?? "Drafting Studio").slice(0, 60);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a1f44 0%, #081936 100%)",
          padding: 70,
          fontFamily: "sans-serif",
        }}
      >
        {/* grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a1f44", fontSize: 34, fontWeight: 800 }}>
            D
          </div>
          <div style={{ color: "#e6edf7", fontSize: 26, fontWeight: 700 }}>Drafting Studio</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#f59e0b", fontSize: 24, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            {eyebrow}
          </div>
          <div style={{ color: "#ffffff", fontSize: 62, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.55)", fontSize: 22, fontFamily: "monospace" }}>
          <span>MEP · Fire · Lighting</span>
          <span>2D / AutoCAD · Nationwide</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
