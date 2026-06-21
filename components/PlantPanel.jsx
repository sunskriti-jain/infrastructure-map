"use client";
import { FUEL_COLORS, FUEL_LABELS, homesEquivalent } from "../data/plants";

const FUEL_ICONS = {
  coal: "⚫",
  gas: "🔥",
  nuclear: "⚛️",
  solar: "☀️",
  wind: "💨",
  hydro: "💧",
  oil: "🛢️",
  biomass: "🌿",
  geothermal: "🌋",
  other: "⚡",
};

export default function PlantPanel({ plant, onClose }) {
  if (!plant) return null;

  const color = FUEL_COLORS[plant.fuel] || FUEL_COLORS.other;

  return (
    <div className="absolute top-16 right-4 z-20 w-80 bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="relative p-5 pb-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
          Power Plant · {plant.state}
        </p>
        <h2 className="text-xl font-bold text-white leading-tight">{plant.name}</h2>

        {/* Tags */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
            style={{ background: color + "22", color: color, border: `1px solid ${color}44` }}
          >
            {FUEL_ICONS[plant.fuel]} {FUEL_LABELS[plant.fuel] || plant.fuel}
          </span>
          {plant.capacityMW > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {plant.capacityMW >= 1000
                ? `${(plant.capacityMW / 1000).toFixed(2)} GW`
                : `${plant.capacityMW} MW`}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-[#1e293b]" />

      {/* Stats grid */}
      <div className="grid grid-cols-3 divide-x divide-[#1e293b]">
        <div className="p-3 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Capacity</p>
          <p className="text-lg font-bold text-white mt-0.5">
            {plant.capacityMW >= 1000
              ? `${(plant.capacityMW / 1000).toFixed(1)}`
              : plant.capacityMW > 0 ? plant.capacityMW : "—"}
          </p>
          {plant.capacityMW > 0 && (
            <p className="text-xs text-slate-400">{plant.capacityMW >= 1000 ? "GW" : "MW"}</p>
          )}
        </div>
        <div className="p-3 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Generators</p>
          <p className="text-lg font-bold text-white mt-0.5">{plant.generators || "—"}</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Since</p>
          <p className="text-lg font-bold text-white mt-0.5">{plant.since || "—"}</p>
        </div>
      </div>

      <div className="border-t border-[#1e293b]" />

      {/* Details */}
      <div className="p-4 space-y-2 text-sm">
        {plant.operator && (
          <Row label="Operator" value={plant.operator} />
        )}
        {plant.county && (
          <Row label="County" value={`${plant.county}, ${plant.state}`} />
        )}
        {plant.balancing && (
          <Row label="Balancing authority" value={plant.balancing} />
        )}
        {plant.capacityMW > 0 && (
          <Row label="Output equals" value={homesEquivalent(plant.capacityMW)} />
        )}
        <Row
          label="Coordinates"
          value={`${plant.lat.toFixed(4)}° N, ${Math.abs(plant.lng).toFixed(4)}° W`}
        />
      </div>

      {/* Notes */}
      {plant.notes && (
        <>
          <div className="border-t border-[#1e293b]" />
          <div className="p-4 bg-amber-950/20 border-t border-amber-900/30">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-amber-400 font-semibold">Did you know · </span>
              {plant.notes}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-200 text-right">{value}</span>
    </div>
  );
}
