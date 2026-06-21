"use client";
import { FUEL_COLORS, FUEL_LABELS } from "../data/plants";

const ALL_FUELS = ["nuclear", "coal", "gas", "solar", "wind", "hydro", "geothermal", "biomass", "oil", "other"];

const FUEL_ICONS = {
  nuclear: "⚛️", coal: "⚫", gas: "🔥", solar: "☀️", wind: "💨",
  hydro: "💧", geothermal: "🌋", biomass: "🌿", oil: "🛢️", other: "⚡",
};

export default function LayerControl({ activeFuels, onToggle, plantCounts }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-6 left-4 z-20">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-[#0f172a] border border-[#1e293b] text-slate-200 px-4 py-2 rounded-full shadow-lg text-sm font-medium hover:border-blue-500 transition-colors"
      >
        <span>⊞</span> Layers
        <span className="bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-xs leading-none">
          {activeFuels.size}
        </span>
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 w-56 bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1e293b]">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Fuel Types</p>
          </div>
          <div className="p-2 space-y-0.5">
            {ALL_FUELS.map((fuel) => {
              const active = activeFuels.has(fuel);
              const count = plantCounts[fuel] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={fuel}
                  onClick={() => onToggle(fuel)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active ? "bg-[#1e293b]" : "opacity-40"
                  } hover:bg-[#1e293b]`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: FUEL_COLORS[fuel] }}
                  />
                  <span className="text-slate-200 flex-1 text-left">{FUEL_LABELS[fuel]}</span>
                  <span className="text-slate-500 text-xs">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="px-4 py-2 border-t border-[#1e293b] flex justify-between">
            <button
              onClick={() => ALL_FUELS.forEach((f) => !activeFuels.has(f) && onToggle(f))}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              All
            </button>
            <button
              onClick={() => ALL_FUELS.forEach((f) => activeFuels.has(f) && onToggle(f))}
              className="text-xs text-slate-400 hover:text-slate-300"
            >
              None
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Need useState
import { useState } from "react";
