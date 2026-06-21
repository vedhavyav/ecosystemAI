'use client';

import { FootprintResult } from '@/engine/types';
import { MapPin, BatteryCharging, LeafyGreen, Loader2, Map as MapIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMapsLibrary,
  useMap,
} from '@vis.gl/react-google-maps';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

type Props = {
  result: FootprintResult;
};

// Sub-component that actually uses the map instance
function MapInner({
  showEV,
  showVegan,
  center,
}: {
  showEV: boolean;
  showVegan: boolean;
  center: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!placesLibrary || !map || !(placesLibrary as any).Place) return;

    const typeKeyword = showEV ? 'EV Charging Station' : showVegan ? 'Vegan Restaurant' : 'Park';

    async function fetchPlaces() {
      try {
        // Note: Field selection is required in the new API for performance/billing.
        // But since we use searchByText, we can request basic fields if needed,
        // though the JS SDK `searchByText` handles it.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Place = (placesLibrary as any).Place;
        const { places } = await Place.searchByText({
          fields: ['displayName', 'location'],
          textQuery: typeKeyword,
          locationBias: { radius: 5000, center: center },
          maxResultCount: 10,
        });

        if (places && places.length > 0) {
          // Map to match our expected format for backwards compatibility in the UI
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedPlaces = places.map((p: any) => ({
            geometry: { location: p.location },
            name: p.displayName,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          })) as any;
          setPlaces(formattedPlaces);
        } else {
          setPlaces([]);
        }
      } catch (err) {
        console.error('Places API Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, [placesLibrary, map, center, showEV, showVegan]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-20">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Finding live locations near you...</p>
        </div>
      )}

      {places.map(
        (place, i) =>
          place.geometry?.location && (
            <AdvancedMarker
              key={i}
              position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}
              title={place.name}
            >
              <div className="relative group cursor-pointer transform hover:scale-110 transition-transform">
                <MapPin
                  className={`w-10 h-10 ${showEV ? 'text-blue-600 fill-blue-100' : 'text-emerald-600 fill-emerald-100'}`}
                />
                {showEV ? (
                  <BatteryCharging className="w-4 h-4 text-blue-700 absolute top-2 left-3" />
                ) : (
                  <LeafyGreen className="w-4 h-4 text-emerald-700 absolute top-2 left-3" />
                )}
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity z-50">
                  {place.name}
                </div>
              </div>
            </AdvancedMarker>
          )
      )}
    </>
  );
}

export default function LocalImpactMap({ result }: Props) {
  const { transportation, diet } = result.categories;
  const showEV = transportation > 1000;
  const showVegan = diet > 1500;

  const [userLocation, setUserLocation] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India center
  const [geoLocating, setGeoLocating] = useState(() => {
    return typeof window !== 'undefined' && !!navigator.geolocation;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGeoLocating(false);
        },
        () => {
          setGeoLocating(false); // Fallback to default if denied
        }
      );
    }
  }, []);

  if (geoLocating) {
    return (
      <div className="w-full bg-slate-100 rounded-[2rem] overflow-hidden shadow-inner relative min-h-[400px] border border-slate-200 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Requesting location access...</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[2rem] overflow-hidden shadow-inner relative min-h-[400px] border border-slate-200 contain-content">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md flex items-center gap-2 border border-slate-200 pointer-events-none">
        <MapIcon className="w-4 h-4 text-emerald-700" />
        <span className="text-sm font-bold text-slate-700">
          {showEV ? 'Nearby EV Chargers' : showVegan ? 'Nearby Plant-based Spots' : 'Nearby Parks'}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-[280px] border border-slate-200 pointer-events-none">
        <h4 className="font-bold text-slate-800 mb-2">Local Environment</h4>
        <div className="flex flex-col gap-2 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Air Quality Index:</span>
            <span
              className={`font-bold ${result.localData.regionalAirQualityIndex > 100 ? 'text-orange-500' : 'text-emerald-600'}`}
            >
              {result.localData.regionalAirQualityIndex} AQI
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Grid Emission Factor:</span>
            <span className="font-bold text-slate-800">
              {result.localData.dynamicGridFactor} kg/kWh
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultZoom={13}
            defaultCenter={userLocation}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            style={{ width: '100%', height: '100%' }}
          >
            <MapInner showEV={showEV} showVegan={showVegan} center={userLocation} />

            <AdvancedMarker position={userLocation} title="You are here">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
            </AdvancedMarker>
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
