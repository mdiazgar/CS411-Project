// SearchBar.tsx

import React, { useEffect, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface SearchBarProps {
  autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  onPlaceChanged: (place: google.maps.places.PlaceResult) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ autocompleteRef, mapRef, onPlaceChanged }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['address_components', 'geometry', 'name'],
        types: ['geocode'],
      });

      autocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place) {
          onPlaceChanged(place);
        }
      });
    }
  }, [autocompleteRef, mapRef, onPlaceChanged]);

  return (
    <Autocomplete>
      <input
        ref={inputRef}
        id="location-input"
        className="controls"
        type="text"
        placeholder="Search for places"
        style={{
          boxSizing: 'border-box',
          border: '1px solid transparent',
          width: '300px',
          height: '40px',
          marginTop: '10px',
          padding: '0 12px',
          borderRadius: '3px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          fontSize: '16px',
          outline: 'none',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '10px',
          zIndex: 10,
        }}
      />
    </Autocomplete>
  );
};

export default SearchBar;
