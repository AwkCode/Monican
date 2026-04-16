"use client";

import { useEffect, useState } from "react";
import type { Signal } from "@/lib/signals/types";
import { getConfidenceLevel } from "@/lib/signals/types";

// Leaflet CSS must be loaded
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

const MARKER_COLORS = {
  hot: "#ef4444",
  warm: "#f59e0b",
  cool: "#6b7280",
};

// Dynamic import wrapper — Leaflet requires window
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MapContainer: any, TileLayer: any, CircleMarker: any, Popup: any;

export default function SignalMap({
  signals,
  onSelect,
}: {
  signals: Signal[];
  onSelect?: (id: string) => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Dynamic import of react-leaflet (requires browser)
    import("react-leaflet").then((rl) => {
      MapContainer = rl.MapContainer;
      TileLayer = rl.TileLayer;
      CircleMarker = rl.CircleMarker;
      Popup = rl.Popup;
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="border border-cb-border rounded-lg bg-cb-card h-[400px] flex items-center justify-center text-cb-gray text-sm">
        Loading map...
      </div>
    );
  }

  const mappable = signals.filter((s) => s.lat && s.lng);

  // Center on signals or default to Bolton MA
  const center =
    mappable.length > 0
      ? {
          lat: mappable.reduce((s, m) => s + m.lat!, 0) / mappable.length,
          lng: mappable.reduce((s, m) => s + m.lng!, 0) / mappable.length,
        }
      : { lat: 42.43, lng: -71.61 }; // Bolton MA

  return (
    <div className="border border-cb-border rounded-lg overflow-hidden h-[400px]">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={11}
        style={{ height: "100%", width: "100%", background: "#050505" }}
        zoomControl={true}
      >
        <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />
        {mappable.map((s) => {
          const level = getConfidenceLevel(s.confidence_score);
          return (
            <CircleMarker
              key={s.id}
              center={[s.lat!, s.lng!]}
              radius={level === "hot" ? 10 : level === "warm" ? 8 : 6}
              pathOptions={{
                fillColor: MARKER_COLORS[level],
                color: MARKER_COLORS[level],
                fillOpacity: 0.7,
                weight: 2,
              }}
              eventHandlers={{
                click: () => onSelect?.(s.id),
              }}
            >
              <Popup>
                <div className="text-xs space-y-1" style={{ color: "#000" }}>
                  <div className="font-semibold">{s.address}</div>
                  <div>
                    {s.city} · {s.signal_type.replace(/_/g, " ")}
                  </div>
                  <div>Confidence: {s.confidence_score}/100</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
