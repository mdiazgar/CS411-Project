import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import SearchBar from './functions/SearchBar';

type Poi = { key: string; location: google.maps.LatLngLiteral; color: string };

const locations: Poi[] = [
  { key: 'BuckinghamPalace', location: { lat: 51.501476, lng: -0.140634 }, color: '#FBBC04' },
  // Other predefined locations...
];

const libraries = ['places'];

const HomePage = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [userMarkers, setUserMarkers] = useState<Poi[]>([]);
  const [pinColor, setPinColor] = useState('#FBBC04'); // Default color for pins

  // List of color options
  const colorOptions = ['#FBBC04', '#FF5733', '#33FF57', '#5733FF', '#33B5FF', '#FF33A1'];

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear user session
    alert('You have been logged out.');
    window.location.href = '/login'; // Redirect to login page
  };

  // Send new pin with color to backend
  const savePinToBackend = async (data: { lat: number; lng: number; color: string }) => {
    try {
      const response = await fetch('http://localhost:5001/api/pins/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Failed to save pin:', response.statusText);
      } else {
        const savedPin = await response.json();
        console.log('Pin saved to backend:', savedPin);
      }
    } catch (error) {
      console.error('Error saving pin:', error);
    }
  };

  // Load pins from backend on component mount
  useEffect(() => {
    const loadPinsFromBackend = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/pins/pins');
        if (response.ok) {
          const pins = await response.json();
          const loadedMarkers = pins.map((pin: { lat: number; lng: number; color: string }) => ({
            key: `marker-${Date.now()}`,
            location: { lat: pin.lat, lng: pin.lng },
            color: pin.color || '#FBBC04',
          }));
          setUserMarkers([...locations, ...loadedMarkers]);
        } else {
          console.error('Failed to load pins:', response.statusText);
        }
      } catch (error) {
        console.error('Error loading pins:', error);
      }
    };

    loadPinsFromBackend();
  }, []);

  const handlePlaceChanged = (place: google.maps.places.PlaceResult) => {
    if (!place || !place.geometry) {
      window.alert(`No details available for input: '${place?.name}'`);
      return;
    }

    if (place.geometry.viewport) {
      mapRef.current?.fitBounds(place.geometry.viewport);
    } else if (place.geometry.location) {
      const location = place.geometry.location.toJSON();
      mapRef.current?.panTo(location);
      mapRef.current?.setZoom(15);
      setMarkerPosition(location);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker: Poi = {
        key: `marker-${event.latLng.lat()}-${event.latLng.lng()}`, // Unique key based on coordinates
        location: event.latLng.toJSON(),
        color: pinColor, // Use selected color for the pin
      };
  
      setUserMarkers((prev) => [...prev, newMarker]);
  
      const pinData = { lat: event.latLng.lat(), lng: event.latLng.lng(), color: pinColor };
      savePinToBackend(pinData);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD9P_qN7zXexNipsJRpeF2uyLAkU8igO_c" libraries={libraries}>
      <div style={{ height: '100vh', width: '100%' }}>
        {/* Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
          <div>
            <button onClick={() => (window.location.href = '/home')}>Home</button>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>

        {/* Pin Color Selection */}
        <h2>Select a color for your pins:</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {colorOptions.map((color) => (
            <button
              key={color}
              style={{
                backgroundColor: color,
                border: 'none',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                cursor: 'pointer',
                outline: color === pinColor ? '2px solid black' : 'none',
              }}
              onClick={() => setPinColor(color)}
            />
          ))}
        </div>

        {/* Google Map */}
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={{ lat: 51.49988, lng: -0.141913 }}
          zoom={13}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={handleMapClick}
        >
          <SearchBar autocompleteRef={autocompleteRef} mapRef={mapRef} onPlaceChanged={handlePlaceChanged} />

          {/* Marker for Selected Place */}
          {markerPosition && <Marker position={markerPosition} />}

          {/* User Markers with selected colors */}
          {userMarkers.map((marker) => (
            <Marker
              key={marker.key}
              position={marker.location}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: marker.color,
                fillOpacity: 1,
                strokeColor: marker.color,
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default HomePage;

