/**
 * Copyright 2024 Google LLC
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
import React, { useState } from 'react';
import { createRoot } from "react-dom/client";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    MapCameraChangedEvent,
    Pin,
    InfoWindow
} from '@vis.gl/react-google-maps';

type Poi = {
    key: string,
    location: google.maps.LatLngLiteral,
    description?: string,
    rating?: number //Google maps rating
    ourRating?: number// User input ratings
    

}

const locations: Poi[] = [
    { key: 'BuckinghamPalace', location: { lat: 51.501476, lng: -0.140634 }, description: "The Buckingham Palace, Queen's residence", rating: 4.7 },
    { key: 'LondonEye', location: { lat: 51.503399, lng: -0.119519 }, description: "A giant Ferris wheel", rating: 4.5 },
    { key: 'BigBen', location: { lat: 51.5007, lng: -0.1246 }, description: "Iconic clock tower", rating: 4.6 },
    { key: 'HydePark', location: { lat: 51.5074, lng: -0.1641 }, description: "Large park in central London", rating: 4.8 },
    { key: 'DickensMuseum', location: { lat: 51.3126, lng: -0.070 }, description: "Museum dedicated to Charles Dickens", rating: 4.4 },
    { key: 'TateBritain', location: { lat: 51.4911, lng: -0.1278 }, description: "Art museum housing British art", rating: 4.3 },
    { key: 'BritishMuseum', location: { lat: 51.5194, lng: -0.1270 }, description: "World-renowned museum", rating: 4.7 }
];

const App = () => {
    const [activePlace, setActivePlace] = useState<Poi | null>(null);  // State to track which place is clicked

    return (
        <APIProvider apiKey={'AIzaSyD9P_qN7zXexNipsJRpeF2uyLAkU8igO_c'} onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                defaultZoom={13}
                defaultCenter={{ lat: 51.499880, lng: -0.141913 }}
                mapId='90f58958f03d6d19'
                onCameraChanged={(ev: MapCameraChangedEvent) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }
            >
                <PoiMarkers pois={locations} onMarkerClick={setActivePlace} />
                {activePlace && (
                    <InfoWindow position={activePlace.location} onCloseClick={() => setActivePlace(null)}>
                        <div>
                            <h2>{activePlace.key}</h2>
                            <p>{activePlace.description}</p>
                            <p>Rating: {activePlace.rating}</p>
                            <p>Our Rating: {activePlace.ourRating}</p>

                            
                        </div>
                    </InfoWindow>
                )}
            </Map>
            <h1>Hello, world!</h1>
        </APIProvider>
    );
};

const PoiMarkers = (props: { pois: Poi[], onMarkerClick: (poi: Poi) => void }) => {
    return (
        <>
            {props.pois.map((poi: Poi) => (
                <AdvancedMarker
                    key={poi.key} 
                    position={poi.location}
                    onClick={() => props.onMarkerClick(poi)} // Set the clicked place
                >
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);

export default App;

