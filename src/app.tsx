// App.tsx

import React, { useRef, useState } from 'react';
import { createRoot } from "react-dom/client";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import SearchBar from './components/SearchBar'; // Importing SearchBar component

// Type definition for Points of Interest
type Poi = { key: string, location: google.maps.LatLngLiteral };
const locations: Poi[] = [
    { key: 'BuckinghamPalace', location: { lat: 51.501476, lng: -0.140634 } },
    { key: 'LondonEye', location: { lat: 51.503399, lng: -0.119519 } },
    { key: 'BigBen', location: { lat: 51.5007, lng: -0.1246 } },
    { key: 'HydePark', location: { lat: 51.5074, lng: -0.1641 } },
    { key: 'DickensMuseum', location: { lat: 51.3126, lng: -0.070 } },
    { key: 'TateBritain', location: { lat: 51.4911, lng: -0.1278 } },
    { key: 'BritishMuseum', location: { lat: 51.5194, lng: -0.1270 } }
];

const libraries = ["places"];

const App = () => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

    const handlePlaceChanged = (place: google.maps.places.PlaceResult) => {
        if (!place || !place.geometry) {
            window.alert(`No details available for input: '${place?.name}'`);
            return;
        }

        // Extract the location or viewport information
        if (place.geometry.viewport) {
            // Fit the map to the selected place's viewport
            mapRef.current?.fitBounds(place.geometry.viewport);
        } else if (place.geometry.location) {
            // Pan the map to the selected place's location
            const location = place.geometry.location.toJSON();
            mapRef.current?.panTo(location);
            mapRef.current?.setZoom(15);
            setMarkerPosition(location);
        }
    };

    return (
        <LoadScript googleMapsApiKey='AIzaSyD9P_qN7zXexNipsJRpeF2uyLAkU8igO_c' libraries={libraries}>
            <div style={{ height: '100vh', width: '100%' }}>
                {/* Google Map Component */}
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: 51.499880, lng: -0.141913 }}
                    zoom={13}
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                >
                    {/* SearchBar Component */}
                    <SearchBar
                        autocompleteRef={autocompleteRef}
                        mapRef={mapRef}
                        onPlaceChanged={handlePlaceChanged}
                    />

                    {/* Marker for Selected Place */}
                    {markerPosition && (
                        <Marker position={markerPosition} />
                    )}

                    {/* POI Markers */}
                    {locations.map((poi) => (
                        <Marker key={poi.key} position={poi.location} />
                    ))}
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);

export default App;
