# ⚡ US Grid Atlas

An interactive map of US power plants, transmission infrastructure, and energy data — built for students and citizens who want to understand the grid without paywalls.

## Features

- **150+ power plants** mapped across all fuel types (nuclear, coal, gas, solar, wind, hydro, geothermal)
- Click any plant for a detailed panel: capacity, operator, balancing authority, and did-you-know facts
- **Search** by plant name, state, or operator
- **Layer toggles** to filter by fuel type
- **Ohm AI assistant** — ask anything about energy, the grid, or a specific plant
- Dark-themed map, clustered markers, mobile-friendly

## Setup (2 minutes)

1. **Clone & install**
   ```bash
   git clone https://github.com/sunskritijain-droid/infrastructure-map
   cd infrastructure-map
   npm install
   ```

2. **Add your API key**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and paste your Anthropic API key
   # Free key at: https://console.anthropic.com
   ```

3. **Run**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

## Deploy on Vercel (free)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sunskritijain-droid/infrastructure-map)

Add `ANTHROPIC_API_KEY` as an environment variable in your Vercel project settings.

## Data Sources

- **Plants**: EIA Form 860 (Annual Electric Generator Report) — public domain
- **Capacity/operator data**: EIA Open Data API
- **Map tiles**: CartoDB Dark Matter (© OpenStreetMap contributors)
- **AI**: Claude (Anthropic)

## Why this exists

US energy data is publicly available but scattered across FERC, EIA, and utility-specific portals — often behind clunky interfaces. This tool puts it all on one map so anyone can explore the infrastructure that powers their life.
