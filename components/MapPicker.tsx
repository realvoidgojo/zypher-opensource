"use client"
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41], iconAnchor: [12, 41]
});

function MapResizer({ isFullscreen }: { isFullscreen: boolean }) {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => { map.invalidateSize() }, 80)
    return () => clearTimeout(timer)
  }, [isFullscreen, map])
  return null
}

export default function MapPicker({ position, setPosition, isFullscreen = false }: { position: [number, number] | null, setPosition: (p: [number, number]) => void, isFullscreen?: boolean }) {
  function LocationMarker() {
    useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]) } })
    return position === null ? null : <Marker position={position} icon={customIcon} />
  }

  return (
    <div className="h-full w-full min-h-[350px] overflow-hidden z-0 relative text-black bg-[#0f1423] rounded-xl border border-white/5">
      <MapContainer center={position || [20.5937, 78.9629]} zoom={position ? 10 : 4} className="h-full w-full" style={{ background: '#0f1423' }}>
        <MapResizer isFullscreen={isFullscreen} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <LocationMarker />
      </MapContainer>
    </div>
  )
}
