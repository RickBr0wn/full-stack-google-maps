import React, { useState, useCallback, useRef } from 'react'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import { formatRelative } from 'date-fns'
import mapStyles from './mapStyles'

const libraries = ['places']

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
}

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
}

const center = {
  lat: 51.14648,
  lng: 0.87376,
}

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)

  const onMapClick = useCallback(
    e =>
      setMarkers(current => [
        ...current,
        { lat: e.latLng.lat(), lng: e.latLng.lng(), time: new Date() },
      ]),
    []
  )

  const mapRef = useRef()
  const onMapLoad = useCallback(map => (mapRef.current = map), [])

  if (loadError) return 'Error loading Google Maps 🗺'
  if (!isLoaded) return 'Loading Google Maps data 🗺'

  return (
    <div>
      <h1>
        Bears{' '}
        <span role="img" aria-label="tent">
          ⛺️
        </span>
      </h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}>
        {markers.map(marker => (
          <Marker
            key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: '/bear.svg',
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => setSelected(marker)}
          />
        ))}
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}>
            <div>
              <h2>Bear Spotted!</h2>
              <p>Spotted at {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  )
}

export default Map
