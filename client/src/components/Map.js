import React from 'react'
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
      />
    </div>
  )
}

export default Map
