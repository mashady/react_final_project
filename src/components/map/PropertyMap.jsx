import { useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function PropertyMap({ university, properties }) {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [viewState, setViewState] = useState({
    latitude: university?.latitude || 30.0667,
    longitude: university?.longitude || 29.5577,
    zoom: 12
  })

  if (!university) return null

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {/* University Marker */}
      <Marker longitude={university.longitude} latitude={university.latitude}>
        <div className="relative">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer">
            🏫
          </div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-sm mb-1">
            {university.name}
          </div>
        </div>
      </Marker>

      {/* Property Markers */}
      {properties.map(property => (
        <Marker
          key={property.id}
          longitude={property.longitude}
          latitude={property.latitude}
          onClick={() => setSelectedProperty(property)}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer">
              🏠
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-sm mb-1">
              ${property.price}
            </div>
          </div>
        </Marker>
      ))}

      {/* Property Popup */}
      {selectedProperty && (
        <Popup
          longitude={selectedProperty.longitude}
          latitude={selectedProperty.latitude}
          onClose={() => setSelectedProperty(null)}
          closeButton={false}
          offset={25}
        >
          <div className="max-w-xs">
            <h3 className="font-bold text-lg mb-1">{selectedProperty.title}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {[selectedProperty.block, selectedProperty.street, selectedProperty.area]
                .filter(Boolean)
                .join(', ')}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-semibold">${selectedProperty.price}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {selectedProperty.distance?.toFixed(2)} km
              </span>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  )
}