import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const FEET_PER_METER = 3.28084

// Default view: continental US, zoomed out until the user searches an address.
const DEFAULT_CENTER = [39.5, -98.35]
const DEFAULT_ZOOM = 4
const MEASURE_ZOOM = 20

// Sum the great-circle distance between consecutive points, in feet.
function lengthInFeet(points) {
  let meters = 0
  for (let i = 1; i < points.length; i++) {
    meters += L.latLng(points[i - 1]).distanceTo(L.latLng(points[i]))
  }
  return Math.round(meters * FEET_PER_METER)
}

// Drops a point on every map click.
function ClickToDraw({ onAdd }) {
  useMapEvents({ click: (e) => onAdd([e.latlng.lat, e.latlng.lng]) })
  return null
}

// Recenters the map imperatively when a new address is geocoded.
function Recenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export default function RooflineMap({ onMeasure, onAddress }) {
  const [points, setPoints] = useState([])
  const [center, setCenter] = useState(null) // null → still on the default US view
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const feet = useMemo(() => lengthInFeet(points), [points])

  // Push the measurement up whenever it changes.
  function commit(next) {
    setPoints(next)
    onMeasure?.(lengthInFeet(next))
  }

  const addPoint = (latlng) => commit([...points, latlng])
  const undo = () => commit(points.slice(0, -1))
  const clear = () => commit([])

  async function search(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setSearching(true)
    setSearchError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
      )
      const data = await res.json()
      if (!data.length) {
        setSearchError('Address not found. Try adding a city or ZIP.')
        return
      }
      const { lat, lon, display_name } = data[0]
      setCenter([Number(lat), Number(lon)])
      clear() // a new property → start a fresh trace
      onAddress?.(display_name)
    } catch {
      setSearchError("Couldn't reach the address lookup. Please try again.")
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 flex flex-col gap-1">
        <p className="font-semibold tracking-wide text-gold">📍 Measure your roofline</p>
        <p className="text-sm text-slate-400">
          Search your address, then click each corner along your roof. We&apos;ll calculate the length and price it instantly.
        </p>
      </div>

      {/* Address search */}
      <form onSubmit={search} className="mb-3 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your address…"
          className="flex-1 rounded-[10px] border border-white/10 bg-black/25 px-3.5 py-2.5 text-[15px] text-slate-100 transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-[10px] bg-[linear-gradient(135deg,#ffd166,#f4a836)] px-5 py-2.5 text-sm font-semibold text-[#2a1a00] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
        >
          {searching ? 'Finding…' : 'Find'}
        </button>
      </form>
      {searchError && <p className="mb-3 text-sm text-festive-red">{searchError}</p>}

      {/* Map */}
      <div className="relative overflow-hidden rounded-xl border border-white/10">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          style={{ height: 440, width: '100%', background: '#0a1530' }}
        >
          <TileLayer
            attribution="Imagery &copy; Esri, Maxar, Earthstar Geographics"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={MEASURE_ZOOM}
            maxNativeZoom={19}
          />
          <ClickToDraw onAdd={addPoint} />
          <Recenter center={center} zoom={MEASURE_ZOOM} />
          {points.length > 1 && (
            <Polyline positions={points} pathOptions={{ color: '#ffd166', weight: 4 }} />
          )}
          {points.map((p, i) => (
            <CircleMarker
              key={i}
              center={p}
              radius={5}
              pathOptions={{ color: '#ffd166', fillColor: '#f4a836', fillOpacity: 1, weight: 2 }}
            />
          ))}
        </MapContainer>

        {/* Live readout overlay */}
        <div className="pointer-events-none absolute left-3 top-3 z-[1000] rounded-lg border border-gold/30 bg-navy-900/85 px-3.5 py-2 backdrop-blur-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Measured</p>
          <p className="text-2xl font-extrabold leading-none text-gold">{feet} ft</p>
          <p className="text-[11px] text-slate-500">{points.length} point{points.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {points.length === 0
            ? 'Tip: zoom in close, then click along the edge of your roof.'
            : 'Click to add more points · drag the map to pan.'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={points.length === 0}
            className="rounded-full border border-white/10 px-3.5 py-1.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:opacity-40"
          >
            ↶ Undo
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={points.length === 0}
            className="rounded-full border border-white/10 px-3.5 py-1.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
