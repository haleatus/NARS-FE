/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "@/hooks/use-google-maps";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSearch as Search } from "react-icons/fa";
import { Ambulance } from "@/core/interface/ambulance.interface";

interface MapComponentProps {
  apiKey: string;
  ambulances?: Ambulance[];
}

declare global {
  interface Window {
    google: typeof google;
  }
}

const GoogleMapComponent: React.FC<MapComponentProps> = ({
  apiKey,
  ambulances = [],
}) => {
  const { isLoaded } = useGoogleMaps(apiKey);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
  );
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<
    google.maps.GeocoderResult[]
  >([]);
  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.LatLng | null>(null);

  // Refs to store markers (better than state for immediate access)
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const clickMarkerRef = useRef<google.maps.Marker | null>(null);
  const searchMarkerRef = useRef<google.maps.Marker | null>(null);
  const ambulanceMarkersRef = useRef<google.maps.Marker[]>([]);
  const userCircleRef = useRef<google.maps.Circle | null>(null);

  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(
    null
  );
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize map and services
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 27.7172, lng: 85.324 },
      zoom: 14,
    });

    setMap(mapInstance);
    setDirectionsService(new window.google.maps.DirectionsService());
    const rendererInstance = new window.google.maps.DirectionsRenderer({
      map: mapInstance,
      suppressMarkers: true, // Don't show default markers
    });
    setDirectionsRenderer(rendererInstance);
    autocompleteRef.current =
      new window.google.maps.places.AutocompleteService();

    // Get user location and create blue circle
    navigator.geolocation.getCurrentPosition((position) => {
      const userLatLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      setUserLocation(userLatLng);

      // Add blue marker for user location
      userMarkerRef.current = new google.maps.Marker({
        position: userLatLng,
        map: mapInstance,
        title: "Your Location",
        icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
        zIndex: 1000, // Keep on top
      });

      // Add blue circle
      userCircleRef.current = new google.maps.Circle({
        strokeColor: "#4285F4",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#4285F4",
        fillOpacity: 0.35,
        map: mapInstance,
        center: userLatLng,
        radius: 100, // 100 meters radius
      });

      // Center map on user location
      mapInstance.setCenter(userLatLng);
    });

    // Add click listener for map
    mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
      // Clear existing click marker
      if (clickMarkerRef.current) {
        clickMarkerRef.current.setMap(null);
        clickMarkerRef.current = null;
      }

      // Clear existing search marker
      if (searchMarkerRef.current) {
        searchMarkerRef.current.setMap(null);
        searchMarkerRef.current = null;
      }

      // Create new marker
      if (event.latLng) {
        clickMarkerRef.current = new google.maps.Marker({
          position: event.latLng,
          map: mapInstance,
          title: "Selected Location",
          animation: google.maps.Animation.DROP,
        });
        setSelectedLocation(event.latLng);
      }
    });

    return () => {
      // Clean up all markers and overlays when component unmounts
      if (directionsRenderer) directionsRenderer.setMap(null);
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
      if (clickMarkerRef.current) clickMarkerRef.current.setMap(null);
      if (searchMarkerRef.current) searchMarkerRef.current.setMap(null);
      if (userCircleRef.current) userCircleRef.current.setMap(null);

      ambulanceMarkersRef.current.forEach((marker) => marker.setMap(null));
      ambulanceMarkersRef.current = [];
    };
  }, [isLoaded]);

  // Handle ambulance markers
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clean up previous ambulance markers
    ambulanceMarkersRef.current.forEach((marker) => marker.setMap(null));
    ambulanceMarkersRef.current = [];

    // Create new ambulance markers
    const newAmbulanceMarkers = ambulances.map((ambulance) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          Number(ambulance.location.latitude),
          Number(ambulance.location.longitude)
        ),
        map,
        icon: "/ambulance-icon.svg",
        title: ambulance.ambulance_number,
      });

      // Add click listener to each ambulance marker
      marker.addListener("click", () => {
        // Clear existing click marker
        if (clickMarkerRef.current) {
          clickMarkerRef.current.setMap(null);
          clickMarkerRef.current = null;
        }

        // Clear existing search marker
        if (searchMarkerRef.current) {
          searchMarkerRef.current.setMap(null);
          searchMarkerRef.current = null;
        }

        const position = marker.getPosition();
        setSelectedLocation(position || null);
        if (userLocation && position) {
          calculateAndDisplayRoute(userLocation, position);
        }
      });

      return marker;
    });

    ambulanceMarkersRef.current = newAmbulanceMarkers;

    return () => {
      // Clean up ambulance markers when effect re-runs
      ambulanceMarkersRef.current.forEach((marker) => marker.setMap(null));
      ambulanceMarkersRef.current = [];
    };
  }, [isLoaded, map, ambulances]);

  // Places autocomplete for search input
  useEffect(() => {
    if (!searchInput || !autocompleteRef.current) return;

    // Clear previous results when search input changes
    setSearchResults([]);

    // Debounce input to avoid too many API calls
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      autocompleteRef.current?.getPlacePredictions(
        { input: searchInput },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            // Convert predictions to GeocoderResult format
            const geocoder = new google.maps.Geocoder();
            const results: google.maps.GeocoderResult[] = [];

            // Use Promise.all to handle multiple async geocode requests
            Promise.all(
              predictions.map(
                (prediction) =>
                  new Promise<void>((resolve) => {
                    geocoder.geocode(
                      { placeId: prediction.place_id },
                      (geoResults, geoStatus) => {
                        if (geoStatus === "OK" && geoResults) {
                          results.push(...geoResults);
                        }
                        resolve();
                      }
                    );
                  })
              )
            ).then(() => {
              setSearchResults(results);
            });
          }
        }
      );
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchInput]);

  const handleSearch = () => {
    if (!map || !searchInput) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === "OK" && results) {
        setSearchResults(results);
      }
    });
  };

  const handleSelectLocation = (location: google.maps.LatLng) => {
    if (!map) return;

    setSearchResults([]);
    map.setCenter(location);

    // Clear existing click marker
    if (clickMarkerRef.current) {
      clickMarkerRef.current.setMap(null);
      clickMarkerRef.current = null;
    }

    // Clear existing search marker
    if (searchMarkerRef.current) {
      searchMarkerRef.current.setMap(null);
      searchMarkerRef.current = null;
    }

    // Create new search marker
    searchMarkerRef.current = new google.maps.Marker({
      position: location,
      map,
      title: "Search Location",
      animation: google.maps.Animation.DROP,
    });

    setSelectedLocation(location);

    // If user location is available, show route
    if (userLocation) {
      calculateAndDisplayRoute(userLocation, location);
    }
  };

  const calculateAndDisplayRoute = (
    origin: google.maps.LatLng,
    destination: google.maps.LatLng
  ) => {
    if (!directionsService || !directionsRenderer) return;

    // Clear previous directions
    directionsRenderer.setDirections({ routes: [] });

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(response);
        }
      }
    );
  };

  const handleRoute = () => {
    if (!userLocation || !selectedLocation) return;
    calculateAndDisplayRoute(userLocation, selectedLocation);
  };

  return (
    <div className="w-full h-screen relative">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search location"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="text-lg" />
          </Button>
        </div>
        {searchResults.length > 0 && (
          <div className="bg-white p-2 rounded-lg shadow-md max-h-48 overflow-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                onClick={() => handleSelectLocation(result.geometry.location)}
              >
                {result.formatted_address}
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={handleRoute}
          disabled={!selectedLocation || !userLocation}
        >
          Show Route
        </Button>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
