
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
  import PoiMarkers from './components/poiMarkers';
  import {Circle} from './components/circle'

  //inputed saved/pinned locations in London
type Poi ={ key: string, location: google.maps.LatLngLiteral }
const locations: Poi[] = [
    {key: 'BuckinghamPalace', location: { lat: 51.501476, lng: -0.140634  }},
    {key: 'LondonEye', location: { lat: 51.503399, lng: -0.119519 }},
    {key: 'BigBen', location: { lat: 51.5007, lng: -0.1246 }},
    {key: 'HydePark', location: { lat: 51.5074, lng: -0.1641 }},
    {key: 'DickensMuseum', location: { lat: 51.3126, lng: -0.070}},
    {key: 'TateBritain', location: { lat: 51.4911, lng: -0.1278 }},
    {key: 'BritishMuseum', location: { lat: 51.5194, lng: -0.1270 }}
];


const App = () => (
//Api call
    <APIProvider apiKey={'AIzaSyD9P_qN7zXexNipsJRpeF2uyLAkU8igO_c'} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
            defaultZoom={13}
            defaultCenter={ { lat: 51.499880, lng: -0.141913 } }
            mapId='90f58958f03d6d19'
            onCameraChanged={ (ev: MapCameraChangedEvent) =>
                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            }>
            <PoiMarkers pois={locations} />
        </Map>
    </APIProvider>
);


  

const root = createRoot(document.getElementById('app'));
root.render(<App />);


export default App;


