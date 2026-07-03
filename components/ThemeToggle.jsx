"use client";
import { useTheme } from "./ThemeProvider";

const OPTIONS = [
  { key: "light", icon: "☀️", label: "Light mode" },
  { key: "auto", icon: "🕐", label: "Auto (day/night)" },
  { key: "dark", icon: "🌙", label: "Dark mode" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 bg-[var(--bg-floating)] border border-[var(--border)] rounded-xl px-1 py-1 backdrop-blur-sm shrink-0">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => setTheme(opt.key)}
          title={opt.label}
          aria-label={opt.label}
          aria-pressed={theme === opt.key}
          className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-colors ${
            theme === opt.key
              ? "bg-blue-600 text-white"
              : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
          }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
