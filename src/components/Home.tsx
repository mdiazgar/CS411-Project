import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import SearchBar from './functions/SearchBar'; // Importing SearchBar component


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


// Define the libraries array outside of the component to avoid unnecessary re-renders
const libraries = ["places"];


const HomePage = () => {
 const mapRef = useRef<google.maps.Map | null>(null);
 const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
 const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
 const [userMarkers, setUserMarkers] = useState<Poi[]>([]);


 // Send new pin to backend
 const savePinToBackend = async (data: { lat: number; lng: number }) => {
   try {
     const response = await fetch('http://localhost:5002/api/pins/pins', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     });


     if (!response.ok) {
       console.error('Failed to save pins:', response.statusText);
     } else {
       const savedPin = await response.json();
       console.log('Pin saved to backend:', savedPin);
     }
   } catch (error) {
     console.error('Error saving pin:', error);
   }
 };


 useEffect(() => {
   // Ensure markers are updated when the map is loaded
   if (mapRef.current) {
     setUserMarkers([...locations]);
   }
 }, [mapRef.current]);


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
       key: `marker-${Date.now()}`,
       location: event.latLng.toJSON(),
     };


     // Add the marker to state
     setUserMarkers((prev) => [...prev, newMarker]);


     // Send the new pin to backend
     const pinData = {
       lat: event.latLng.lat(),
       lng: event.latLng.lng(),
     };
     savePinToBackend(pinData);
   }
 };


 return (
   <LoadScript googleMapsApiKey='AIzaSyD9P_qN7zXexNipsJRpeF2uyLAkU8igO_c' libraries={libraries}>
     <div style={{ height: '100vh', width: '100%' }}>
       <GoogleMap
         mapContainerStyle={{ width: '100%', height: '100%' }}
         center={{ lat: 51.499880, lng: -0.141913 }}
         zoom={13}
         onLoad={(map) => {
           mapRef.current = map;
         }}
         onClick={handleMapClick}
       >
         <SearchBar autocompleteRef={autocompleteRef} mapRef={mapRef} onPlaceChanged={handlePlaceChanged} />


         {/* Marker for Selected Place */}
         {/*markerPosition && <Marker position={markerPosition} />*/}


         {/* POI Markers for predefined locations */}
         {userMarkers.map((marker) => (
           <Marker key={marker.key} position={marker.location} />
         ))}
       </GoogleMap>
     </div>
   </LoadScript>
 );
};


export default HomePage;


