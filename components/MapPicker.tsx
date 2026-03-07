"use client"
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41], iconAnchor: [12, 41]
});

export default function MapPicker({ position, setPosition }: { position: [number, number] | null, setPosition: (p: [number, number]) => void }) {
  function LocationMarker() {
    useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]) } })
    return position === null ? null : <Marker position={position} icon={customIcon} />
  }

  return (
    <div className="h-full w-full min-h-[350px] overflow-hidden z-0 relative text-black bg-[#0f1423] rounded-xl border border-white/5">
      <MapContainer center={position || [20.5937, 78.9629]} zoom={position ? 10 : 4} className="h-full w-full" style={{ background: '#0f1423' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <LocationMarker />
      </MapContainer>
    </div>
  )
}