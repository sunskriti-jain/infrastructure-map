const HIFLD_URL =
  "https://services2.arcgis.com/LYMgRMwHfrWWEg3s/arcgis/rest/services/HIFLD_US_Electric_Power_Transmission_Lines/FeatureServer/0/query";

// Half-width of the bounding box, in degrees, drawn around the selected plant.
const BUFFER_DEG = 0.5;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat"));
  const lng = parseFloat(searchParams.get("lng"));

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return Response.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const bbox = [
    lng - BUFFER_DEG,
    lat - BUFFER_DEG,
    lng + BUFFER_DEG,
    lat + BUFFER_DEG,
  ].join(",");

  const params = new URLSearchParams({
    geometry: bbox,
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "VOLTAGE,VOLT_CLASS,OWNER,SUB_1,SUB_2",
    returnGeometry: "true",
    outSR: "4326",
    resultRecordCount: "800",
    f: "geojson",
  });

  const res = await fetch(`${HIFLD_URL}?${params.toString()}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return Response.json({ error: "Failed to fetch transmission lines" }, { status: 502 });
  }

  const data = await res.json();
  return Response.json(data);
}
