import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Listing } from "../lib/types";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export function MapBlock({ listing }: { listing: Listing }) {
  const lat = listing.latitude ?? listing.location?.lat ?? listing.location?.latitude ?? 51.4344;
  const lng = listing.longitude ?? listing.location?.lng ?? listing.location?.longitude ?? 6.7623;
  return (
    <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}><Popup>{listing.title}</Popup></Marker>
    </MapContainer>
  );
}
