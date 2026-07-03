import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";

export const metadata = {
  title: "US Infrastructure Map — Power Plants & Grid Explorer",
  description:
    "Explore the US power grid: power plants, transmission lines, substations, and electricity prices. Built on EIA and FERC public data.",
};

// Runs before paint so the correct theme is applied with no flash, ahead of React hydration.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme')||'auto';var r=t;if(t==='auto'){var h=new Date().getHours();r=(h>=19||h<7)?'dark':'light';}if(r==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
          crossOrigin=""
        />
      </head>
      <body className="bg-[var(--bg-app)] text-[var(--text-primary)] overflow-hidden">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
