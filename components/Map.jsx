"use client";
import { useEffect, useRef, useState } from "react";
import PLANTS, { FUEL_COLORS } from "../data/plants";

// Leaflet must be imported client-side only
let L;

function getIcon(fuel, size = 32) {
  const color = FUEL_COLORS[fuel] || FUEL_COLORS.other;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="#0f172a" stroke="rgba(59,130,246,0.7)" stroke-width="1.5"/>
    <path d="M18 4 L10 17 H16 L14 28 L22 15 H16 Z" fill="${color}" stroke="none"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function clusterIcon(count) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill="#0f172a" stroke="rgba(59,130,246,0.8)" stroke-width="2"/>
    <text x="20" y="25" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#e2e8f0">${count > 999 ? "999+" : count}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function Map({ activeFuels, onSelectPlant, selectedPlant, searchQuery }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const clusterGroupRef = useRef(null);
  const initialized = useRef(false);

  // Initialize map
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      L = (await import("leaflet")).default;
      await import("leaflet.markercluster");

      const map = L.map(mapRef.current, {
        center: [38.5, -96],
        zoom: 5,
        zoomControl: false,
        attributionControl: true,
      });

      // Dark basemap
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a> · Plants: EIA-860',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);

      // Marker cluster group
      const clusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 60,
        iconCreateFunction: (cluster) => {
          return L.icon({
            iconUrl: clusterIcon(cluster.getChildCount()),
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
        },
      });

      // Add all plant markers
      PLANTS.forEach((plant) => {
        const icon = L.icon({
          iconUrl: getIcon(plant.fuel),
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        });

        const marker = L.marker([plant.lat, plant.lng], { icon });
        marker.on("click", () => onSelectPlant(plant));
        marker.bindTooltip(
          `<strong>${plant.name}</strong><br/>${plant.capacityMW.toLocaleString()} MW`,
          { className: "leaflet-tooltip-dark", direction: "top" }
        );

        marker._plantData = plant;
        clusterGroup.addLayer(marker);
        markersRef.current[plant.id] = marker;
      });

      map.addLayer(clusterGroup);
      clusterGroupRef.current = clusterGroup;
      mapInstanceRef.current = map;
    })();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        initialized.current = false;
      }
    };
  }, []);

  // Filter by active fuels
  useEffect(() => {
    if (!clusterGroupRef.current || !L) return;
    clusterGroupRef.current.clearLayers();
    PLANTS.forEach((plant) => {
      if (activeFuels.has(plant.fuel)) {
        clusterGroupRef.current.addLayer(markersRef.current[plant.id]);
      }
    });
  }, [activeFuels]);

  // Fly to selected plant
  useEffect(() => {
    if (!selectedPlant || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedPlant.lat, selectedPlant.lng], 9, {
      animate: true,
      duration: 1.2,
    });
  }, [selectedPlant]);

  // Search fly-to
  useEffect(() => {
    if (!searchQuery || !mapInstanceRef.current) return;
    const q = searchQuery.toLowerCase();
    const match = PLANTS.find(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.operator?.toLowerCase().includes(q)
    );
    if (match) {
      onSelectPlant(match);
    }
  }, [searchQuery]);

  return (
    <>
      <style>{`
        .leaflet-tooltip-dark {
          background: #1e293b;
          border: 1px solid #334155;
          color: #e2e8f0;
          font-size: 12px;
          border-radius: 6px;
          padding: 4px 8px;
        }
        .leaflet-tooltip-dark::before {
          border-top-color: #334155;
        }
      `}</style>
      <div ref={mapRef} className="absolute inset-0 z-0" />
    </>
  );
}
