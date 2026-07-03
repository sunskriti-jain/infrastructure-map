"use client";
import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import PLANTS, { FUEL_COLORS, FUEL_LABELS } from "../data/plants";
import PlantPanel from "../components/PlantPanel";
import AIAssistant from "../components/AIAssistant";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../components/ThemeProvider";

// Leaflet can't run on server
const Map = dynamic(() => import("../components/Map"), { ssr: false });

const ALL_FUELS = new Set(PLANTS.map((p) => p.fuel));

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [activeFuels, setActiveFuels] = useState(new Set(ALL_FUELS));
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const plantCounts = useMemo(() => {
    const counts = {};
    PLANTS.forEach((p) => {
      counts[p.fuel] = (counts[p.fuel] || 0) + 1;
    });
    return counts;
  }, []);

  const handleToggleFuel = useCallback((fuel) => {
    setActiveFuels((prev) => {
      const next = new Set(prev);
      if (next.has(fuel)) next.delete(fuel);
      else next.add(fuel);
      return next;
    });
  }, []);

  function handleSearchInput(val) {
    setSearchInput(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    const q = val.toLowerCase();
    const results = PLANTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.operator?.toLowerCase().includes(q) ||
        p.county?.toLowerCase().includes(q)
    ).slice(0, 6);
    setSearchResults(results);
  }

  function handleSelectResult(plant) {
    setSelectedPlant(plant);
    setSearchInput(plant.name);
    setSearchResults([]);
    setSearchQuery(plant.name);
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Map fills the background */}
      <Map
        activeFuels={activeFuels}
        onSelectPlant={setSelectedPlant}
        selectedPlant={selectedPlant}
        searchQuery={searchQuery}
        theme={resolvedTheme}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-3 flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 bg-[var(--bg-floating)] border border-[var(--border)] rounded-xl px-3 py-2 backdrop-blur-sm shrink-0">
          <span className="text-blue-400 text-lg">⚡</span>
          <span className="text-[var(--text-primary)] font-bold text-sm hidden sm:block">US Grid Atlas</span>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-lg mx-auto">
          <div className="flex items-center bg-[var(--bg-floating)] border border-[var(--border)] rounded-xl px-3 py-2 backdrop-blur-sm focus-within:border-blue-500 transition-colors">
            <span className="text-[var(--text-muted)] mr-2 text-sm">🔍</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchResults.length > 0) {
                  handleSelectResult(searchResults[0]);
                }
              }}
              placeholder="Search a plant, state, or operator..."
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none text-sm"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(""); setSearchResults([]); }}
                className="text-[var(--text-faint)] hover:text-[var(--text-primary)] ml-2"
              >
                ×
              </button>
            )}
          </div>

          {/* Autocomplete */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xl z-50">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectResult(p)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-hover)] text-left transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: FUEL_COLORS[p.fuel] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-primary)] text-sm font-medium truncate">{p.name}</p>
                    <p className="text-[var(--text-muted)] text-xs">{p.state} · {FUEL_LABELS[p.fuel]}</p>
                  </div>
                  {p.capacityMW > 0 && (
                    <span className="text-[var(--text-faint)] text-xs shrink-0">
                      {p.capacityMW >= 1000
                        ? `${(p.capacityMW / 1000).toFixed(1)} GW`
                        : `${p.capacityMW} MW`}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats pill */}
        <div className="hidden md:flex items-center gap-3 bg-[var(--bg-floating)] border border-[var(--border)] rounded-xl px-3 py-2 backdrop-blur-sm shrink-0">
          <Stat label="Plants" value={PLANTS.filter((p) => activeFuels.has(p.fuel)).length} />
          <div className="w-px h-4 bg-[var(--border)]" />
          <Stat
            label="Total GW"
            value={(
              PLANTS.filter((p) => activeFuels.has(p.fuel)).reduce(
                (s, p) => s + p.capacityMW,
                0
              ) / 1000
            ).toFixed(0)}
          />
        </div>

        <ThemeToggle />
      </div>

      {/* Legend strip */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-[var(--bg-floating)] border border-[var(--border)] rounded-full px-3 py-1.5 backdrop-blur-sm flex-wrap justify-center max-w-[90vw]">
        {[...ALL_FUELS].map((fuel) => (
          <button
            key={fuel}
            onClick={() => handleToggleFuel(fuel)}
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-all ${
              activeFuels.has(fuel)
                ? "text-[var(--text-secondary)]"
                : "text-[var(--text-faint)] line-through"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: activeFuels.has(fuel) ? FUEL_COLORS[fuel] : "var(--bg-hover-strong)" }}
            />
            {FUEL_LABELS[fuel]}
          </button>
        ))}
      </div>

      {/* Plant detail panel */}
      <PlantPanel plant={selectedPlant} onClose={() => setSelectedPlant(null)} />

      {/* AI Assistant */}
      <AIAssistant selectedPlant={selectedPlant} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-[var(--text-primary)] font-bold text-sm leading-none">{value}</p>
      <p className="text-[var(--text-faint)] text-xs mt-0.5">{label}</p>
    </div>
  );
}
