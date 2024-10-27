
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {createRoot} from "react-dom/client";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    MapCameraChangedEvent,
    useMap,
    Pin
  } from '@vis.gl/react-google-maps';
  import type {Marker} from '@googlemaps/markerclusterer';
  import {Circle} from './circle'
  
  
  
  const PoiMarkers = () => {
    const map = useMap();
    const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
    const [circleCenter, setCircleCenter] = useState<google.maps.LatLng | null>(null);
    const [mode, setMode] = useState<'marker' | 'circle'>('marker'); // State for choosing between marker and circle
  
    useEffect(() => {
      if (!map) return;
  
      const handleMapClick = (ev: google.maps.MapMouseEvent) => {
        if (!ev.latLng) return;
  
        if (mode === 'marker') {
          const newMarker = new google.maps.Marker({
            position: ev.latLng,
            map,
          });
  
          const key = `marker-${Date.now()}`; // Unique key for the new marker
          setMarkers(prev => ({ ...prev, [key]: newMarker }));
        } else if (mode === 'circle') {
          setCircleCenter(ev.latLng);
        }
      };
  
      // Add click listener to the map
      map.addListener('click', handleMapClick);
  
      // Cleanup the listener on unmount
      return () => {
        google.maps.event.clearListeners(map, 'click');
      };
    }, [map, mode]);
  
    const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log('marker clicked:', ev.latLng.toString());
      setCircleCenter(ev.latLng);
      map.panTo(ev.latLng);
    }, [map]);
  
    return (
      <div style={{ position: 'relative', height: '100%' }}>
        {/* Map Area */}
        <div style={{ height: '100%', width: '100%' }}>
          {/* Render your map component here */}
        </div>
  
        {/* Mode Selection Dropdown */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 2,
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}>
          <label htmlFor="modeSelect" style={{ marginRight: '5px' }}>Select Mode:</label>
          <select
            id="modeSelect"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'marker' | 'circle')}
          >
            <option value="marker">Create POI Marker</option>
            <option value="circle">Create Circle</option>
          </select>
        </div>
  
        {/* Circle */}
        {circleCenter && (
          <Circle
            radius={800}
            center={circleCenter}
            strokeColor={'#0c4cb3'}
            strokeOpacity={1}
            strokeWeight={3}
            fillColor={'#3b82f6'}
            fillOpacity={0.3}
          />
        )}
  
        {/* Markers */}
        {Object.entries(markers).map(([key, marker]) => (
          <AdvancedMarker
            key={key}
            position={marker.getPosition()}
            clickable={true}
            onClick={handleClick}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </div>
    );
  };
  
  export default PoiMarkers;
  