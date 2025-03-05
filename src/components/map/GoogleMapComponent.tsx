/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "@/hooks/use-google-maps";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSearch as Search } from "react-icons/fa";
import { FaHospital } from "react-icons/fa";
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
    {
      name: string;
      vicinity: string;
      location: google.maps.LatLng;
      placeId: string;
    }[]
  >([]);
  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.LatLng | null>(null);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);

  // Refs to store markers (better than state for immediate access)
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const clickMarkerRef = useRef<google.maps.Marker | null>(null);
  const searchMarkerRef = useRef<google.maps.Marker | null>(null);
  const ambulanceMarkersRef = useRef<Map<string, google.maps.Marker>>(
    new Map()
  );
  const hospitalMarkersRef = useRef<google.maps.Marker[]>([]);
  const userCircleRef = useRef<google.maps.Circle | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );
  const [trafficLayer, setTrafficLayer] =
    useState<google.maps.TrafficLayer | null>(null);

  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Nepal boundaries (approximately)
  const NEPAL_BOUNDS = {
    north: 30.45,
    south: 26.35,
    east: 88.2,
    west: 80.05,
  };

  // Initialize map and services
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 27.7172, lng: 85.324 }, // Kathmandu
      zoom: 12,
      restriction: {
        latLngBounds: NEPAL_BOUNDS,
        strictBounds: false,
      },
    });

    setMap(mapInstance);
    setDirectionsService(new window.google.maps.DirectionsService());
    const rendererInstance = new window.google.maps.DirectionsRenderer({
      map: mapInstance,
      suppressMarkers: true, // Don't show default markers
    });
    setDirectionsRenderer(rendererInstance);

    // Initialize traffic layer
    const trafficLayerInstance = new google.maps.TrafficLayer();
    setTrafficLayer(trafficLayerInstance);

    // Initialize Places service for hospital search
    placesServiceRef.current = new google.maps.places.PlacesService(
      mapInstance
    );

    // Create info window for markers
    infoWindowRef.current = new google.maps.InfoWindow();

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

      // Reset selected ambulance
      setSelectedAmbulanceId(null);
      resetAmbulanceMarkers();

      // Close info window
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // Clear directions and hide traffic layer
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
      if (trafficLayer) {
        trafficLayer.setMap(null);
      }

      // Clear route information
      setRouteInfo(null);

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
      if (infoWindowRef.current) infoWindowRef.current.close();
      if (trafficLayer) trafficLayer.setMap(null);

      ambulanceMarkersRef.current.forEach((marker) => marker.setMap(null));
      ambulanceMarkersRef.current.clear();

      hospitalMarkersRef.current.forEach((marker) => marker.setMap(null));
      hospitalMarkersRef.current = [];
    };
  }, [isLoaded]);

  // Function to reset ambulance markers to default appearance
  const resetAmbulanceMarkers = () => {
    ambulanceMarkersRef.current.forEach((marker) => {
      marker.setIcon("/ambulance-icon.svg");
      marker.setZIndex(1);
    });
  };

  // Function to clear hospital markers
  const clearHospitalMarkers = () => {
    hospitalMarkersRef.current.forEach((marker) => marker.setMap(null));
    hospitalMarkersRef.current = [];
  };

  // Handle ambulance markers
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clean up previous ambulance markers
    ambulanceMarkersRef.current.forEach((marker) => marker.setMap(null));
    ambulanceMarkersRef.current.clear();

    // Create new ambulance markers
    ambulances.forEach((ambulance) => {
      const position = new google.maps.LatLng(
        Number(ambulance.location.latitude),
        Number(ambulance.location.longitude)
      );

      const marker = new google.maps.Marker({
        position,
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

        // Reset all ambulance markers first
        resetAmbulanceMarkers();

        // Set this ambulance as selected
        setSelectedAmbulanceId(ambulance._id);

        // Change this ambulance's marker to indicate selection
        marker.setIcon({
          url: "/ambulance-icon.svg",
          scaledSize: new google.maps.Size(40, 40), // Make it larger
        });
        marker.setZIndex(1001); // Put it on top

        // Show info window for selected ambulance
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(
            `<div class="p-2">
              <p><strong>Ambulance:</strong> ${ambulance.ambulance_number}</p>
              <p><strong>Status:</strong> ${ambulance.status || "Available"}</p>
            </div>`
          );
          infoWindowRef.current.open(map, marker);
        }

        setSelectedLocation(position);
        if (userLocation) {
          calculateAndDisplayRoute(userLocation, position);
        }
      });

      // Store the marker with ambulance ID
      ambulanceMarkersRef.current.set(ambulance._id, marker);
    });

    return () => {
      // Clean up ambulance markers when effect re-runs
      ambulanceMarkersRef.current.forEach((marker) => marker.setMap(null));
      ambulanceMarkersRef.current.clear();
    };
  }, [isLoaded, map, ambulances]);

  // Update ambulance markers if selection changes
  useEffect(() => {
    resetAmbulanceMarkers();

    if (
      selectedAmbulanceId &&
      ambulanceMarkersRef.current.has(selectedAmbulanceId)
    ) {
      const marker = ambulanceMarkersRef.current.get(selectedAmbulanceId);
      if (marker) {
        marker.setIcon({
          url: "/ambulance-icon.svg",
          scaledSize: new google.maps.Size(40, 40), // Make it larger
        });
        marker.setZIndex(1001); // Put it on top
      }
    }
  }, [selectedAmbulanceId]);

  // Search for hospitals in Nepal based on search input
  const searchHospitals = () => {
    if (!map || !placesServiceRef.current) return;

    setIsSearching(true);
    clearHospitalMarkers();

    // Get center for search (prefer user location or map center)
    const searchCenter = userLocation || map.getCenter();

    // Prepare the search request
    const request: google.maps.places.TextSearchRequest = {
      query: `${searchInput} hospital Nepal`,
      location: searchCenter,
      radius: 50000, // 50km radius
      region: "np", // Nepal country code
      type: "hospital",
    };

    placesServiceRef.current.textSearch(request, (results, status) => {
      setIsSearching(false);

      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Convert results to our format
        const formattedResults = results.map((place) => ({
          name: place.name || "",
          vicinity: place.formatted_address || "",
          location: place.geometry?.location || new google.maps.LatLng(0, 0),
          placeId: place.place_id || "",
        }));

        setSearchResults(formattedResults);

        // Create markers for each hospital
        formattedResults.forEach((hospital) => {
          const marker = new google.maps.Marker({
            position: hospital.location,
            map,
            title: hospital.name,
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new google.maps.Size(30, 30),
            },
          });

          // Add click listener to hospital marker
          marker.addListener("click", () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(
                `<div class="p-2">
                  <h3 class="font-bold">${hospital.name}</h3>
                  <p>${hospital.vicinity}</p>
                </div>`
              );
              infoWindowRef.current.open(map, marker);
            }

            // Set as selected location
            setSelectedLocation(hospital.location);

            // If user location is available, show route
            if (userLocation) {
              calculateAndDisplayRoute(userLocation, hospital.location);
            }
          });

          hospitalMarkersRef.current.push(marker);
        });

        // If we have results, fit the map to show all markers
        if (formattedResults.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          formattedResults.forEach((hospital) => {
            bounds.extend(hospital.location);
          });
          if (userLocation) {
            bounds.extend(userLocation);
          }
          map.fitBounds(bounds);
        }
      } else {
        // No results or error
        setSearchResults([]);
      }
    });
  };

  const handleSelectHospital = (hospital: {
    name: string;
    vicinity: string;
    location: google.maps.LatLng;
    placeId: string;
  }) => {
    if (!map) return;

    // Reset selected ambulance
    setSelectedAmbulanceId(null);
    resetAmbulanceMarkers();

    setSearchResults([]);
    map.setCenter(hospital.location);

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
      position: hospital.location,
      map,
      title: hospital.name,
      animation: google.maps.Animation.DROP,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    // Show info window
    if (infoWindowRef.current) {
      infoWindowRef.current.setContent(
        `<div class="p-2">
          <h3 class="font-bold">${hospital.name}</h3>
          <p>${hospital.vicinity}</p>
        </div>`
      );
      infoWindowRef.current.open(map, searchMarkerRef.current);
    }

    setSelectedLocation(hospital.location);

    // If user location is available, show route
    if (userLocation) {
      calculateAndDisplayRoute(userLocation, hospital.location);
    }
  };

  const calculateAndDisplayRoute = (
    origin: google.maps.LatLng,
    destination: google.maps.LatLng
  ) => {
    if (!directionsService || !directionsRenderer) return;

    // Clear previous directions by setting map to null
    directionsRenderer.setMap(null);

    // Reconnect to map
    if (map) {
      directionsRenderer.setMap(map);
    }

    // Show traffic layer
    trafficLayer?.setMap(map);

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(), // Current time
          trafficModel: google.maps.TrafficModel.BEST_GUESS, // Optimize for traffic
        },
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && response) {
          directionsRenderer.setDirections(response);

          // Extract distance and duration from the first route's first leg
          const route = response.routes[0];
          const leg = route.legs[0];

          if (leg) {
            setRouteInfo({
              distance: leg.distance?.text || "N/A",
              duration: leg.duration?.text || "N/A",
            });
          } else {
            setRouteInfo(null);
          }
        } else {
          trafficLayer?.setMap(null);
          setRouteInfo(null);
        }
      }
    );
  };

  const handleRoute = () => {
    if (!userLocation || !selectedLocation) return;
    calculateAndDisplayRoute(userLocation, selectedLocation);
  };

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-2 max-w-xs">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for hospitals in Nepal"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={searchHospitals}
            disabled={isSearching || !searchInput.trim()}
            className="min-w-fit"
          >
            {isSearching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            ) : (
              <>
                <FaHospital className="mr-1" />
                <Search className="text-lg" />
              </>
            )}
          </Button>
        </div>
        {searchResults.length > 0 && (
          <div className="bg-white p-2 rounded-lg shadow-md max-h-48 overflow-auto">
            {searchResults.map((hospital, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                onClick={() => handleSelectHospital(hospital)}
              >
                <div className="font-medium">{hospital.name}</div>
                <div className="text-xs text-gray-600">{hospital.vicinity}</div>
              </div>
            ))}
          </div>
        )}
        {selectedAmbulanceId && (
          <div className="bg-blue-50 p-2 rounded border border-blue-200 mb-2">
            <div className="font-medium">Selected Ambulance</div>
            <div className="text-sm">
              {ambulances.find((amb) => amb._id === selectedAmbulanceId)
                ?.ambulance_number || ""}
            </div>
          </div>
        )}
        {routeInfo && (
          <div className="bg-green-50 p-2 rounded border border-green-200 mb-2">
            <div className="font-medium">Route Information</div>
            <div className="text-sm">
              <p>Distance: {routeInfo.distance}</p>
              <p>Estimated Time: {routeInfo.duration}</p>
            </div>
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
