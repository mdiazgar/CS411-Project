// PoiMarkers.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

type Poi = { key: string, location: google.maps.LatLngLiteral };

interface PoiMarkersProps {
  pois: Poi[];
  mapRef?: React.MutableRefObject<google.maps.Map | null>;
}

const PoiMarkers: React.FC<PoiMarkersProps> = ({ pois, mapRef }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});

  useEffect(() => {
    if (!map && !mapRef?.current) return;

    const currentMap = map ?? mapRef.current;

    const handleMapClick = (ev: google.maps.MapMouseEvent) => {
      if (!ev.latLng) return;

      if (mode === 'marker') {
        const newMarker = new google.maps.Marker({
          position: ev.latLng,
          map: currentMap,
        });

        const key = `marker-${Date.now()}`; // Unique key for the new marker
        setMarkers(prev => ({ ...prev, [key]: newMarker }));


    // Add click listener to the map
    currentMap?.addListener('click', handleMapClick);

    // Cleanup the listener on unmount
    return () => {
      if (currentMap) {
        google.maps.event.clearListeners(currentMap, 'click');
      }
    };
  }, [map, mode, mapRef]);

  const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    if (!map && !mapRef?.current) return;
    if (!ev.latLng) return;

    const currentMap = map ?? mapRef.current;

    console.log('Marker clicked:', ev.latLng.toString());
    setCircleCenter(ev.latLng);
    currentMap?.panTo(ev.latLng);
  }, [map, mapRef]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
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

      {/* Predefined POI Markers */}
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
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
