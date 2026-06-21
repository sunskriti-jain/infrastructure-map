import "./globals.css";

export const metadata = {
  title: "US Infrastructure Map — Power Plants & Grid Explorer",
  description:
    "Explore the US power grid: power plants, transmission lines, substations, and electricity prices. Built on EIA and FERC public data.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
      <body className="bg-[#0a0f1e] text-white overflow-hidden">{children}</body>
    </html>
  );
}
