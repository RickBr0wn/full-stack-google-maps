import React, { useState, useCallback, useRef } from 'react'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox'
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

const Locate = ({ panTo }) => {
  return (
    <button className="locate">
      <span role="img" aria-label="compass">
        🧭
      </span>
    </button>
  )
}

const Search = ({ panTo }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: {
        lat: () => 51.14648,
        lng: () => 0.87376,
      },
      radius: 200 * 1000,
    },
  })
  return (
    <Combobox
      onSelect={async address => {
        setValue(address, false)
        clearSuggestions()
        try {
          const results = await getGeocode({ address })
          const { lat, lng } = await getLatLng(results[0])
          panTo({ lat, lng })
        } catch (error) {
          console.log(error)
        }
      }}
      className="search">
      <ComboboxInput
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Enter your address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
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

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(16)
  }, [])

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
      <Search panTo={panTo} />
      <Locate panTo={panTo} />
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
