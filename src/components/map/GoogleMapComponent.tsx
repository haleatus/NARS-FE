"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Search } from "lucide-react";
import type { Ambulance } from "@/core/interface/ambulance.interface";

interface MapComponentProps {
  apiKey: string;
  ambulances?: Ambulance[];
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const GoogleMapComponent: React.FC<MapComponentProps> = ({
  apiKey,
  ambulances = [],
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
  );
  const [destination, setDestination] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [destinationMarker, setDestinationMarker] =
    useState<google.maps.Marker | null>(null);
  const [ambulanceMarkers, setAmbulanceMarkers] = useState<
    google.maps.Marker[]
  >([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(
    null
  );

  // Initialize map when component mounts
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }

      window.initMap = () => {
        initializeMap();
      };

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,routes&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [apiKey, watchId]);

  // Update ambulance markers when ambulances prop changes
  useEffect(() => {
    if (map) updateAmbulanceMarkers(map);
  }, [map]);

  const initializeMap = async () => {
    if (!mapRef.current || map) return;
    setIsLoading(true);

    try {
      // Get user's current position
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        }
      );

      const userPos = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );

      setUserLocation(userPos);

      // Create map instance
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: userPos,
        zoom: 15,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      });

      setMap(mapInstance);

      // Create user marker
      const marker = new google.maps.Marker({
        position: userPos,
        map: mapInstance,
        title: "Your Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        },
        zIndex: 999,
      });
      setUserMarker(marker);

      // Set up directions service
      setDirectionsService(new google.maps.DirectionsService());
      const renderer = new google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#3b82f6",
          strokeWeight: 5,
          strokeOpacity: 0.7,
        },
        panel: null, // Make sure no directions panel is set
      });
      setDirectionsRenderer(renderer);

      // Set up map click handler
      mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          handleDestinationChange({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });
        }
      });

      // Set up search autocomplete
      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(
          searchInputRef.current
        );
        autocomplete.bindTo("bounds", mapInstance);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(17);

          handleDestinationChange({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        });
      }

      // Start tracking user location
      startLocationTracking();

      // Add ambulance markers
      updateAmbulanceMarkers(mapInstance);

      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setIsLoading(false);

      // Fallback to a default location if geolocation fails
      const fallbackPos = new google.maps.LatLng(27.7172, 85.324);
      setUserLocation(fallbackPos);

      if (mapRef.current) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: fallbackPos,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        setMap(mapInstance);
        updateAmbulanceMarkers(mapInstance);
      }
    }
  };

  const startLocationTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newUserPos = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        setUserLocation(newUserPos);

        if (userMarker) {
          userMarker.setPosition(newUserPos);
        }
      },
      (error) => console.error("Error tracking location:", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    setWatchId(id);
  };

  const handleDestinationChange = (
    newDestination: google.maps.LatLngLiteral
  ) => {
    // Clear previous destination marker
    if (destinationMarker) {
      destinationMarker.setMap(null);
    }

    // Clear previous route
    if (directionsRenderer) {
      directionsRenderer.setDirections(null);
    }

    setDestination(newDestination);
    setSelectedAmbulance(null);

    // Create new destination marker
    if (map) {
      const newMarker = new google.maps.Marker({
        position: newDestination,
        map: map,
        title: "Selected Destination",
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new google.maps.Size(32, 32),
        },
        animation: google.maps.Animation.DROP,
      });

      setDestinationMarker(newMarker);
    }
  };

  const updateAmbulanceMarkers = (mapInstance: google.maps.Map) => {
    // Clear existing ambulance markers
    ambulanceMarkers.forEach((marker) => marker.setMap(null));

    // Create new ambulance markers
    const newMarkers: google.maps.Marker[] = ambulances.map((ambulance) => {
      const position = {
        lat: Number.parseFloat(ambulance.location.latitude),
        lng: Number.parseFloat(ambulance.location.longitude),
      };

      const ambulanceMarker = new google.maps.Marker({
        position: position,
        map: mapInstance,
        title: `${ambulance.driver_name} - ${ambulance.ambulance_number}`,
        icon: {
          url: "/ambulance-icon.svg",
          scaledSize: new google.maps.Size(28, 28),
        },
      });

      // Create info window for ambulance details
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${ambulance.ambulance_number}</div>
            <div>Driver: ${ambulance.driver_name}</div>
            <div>Contact: ${ambulance.contact}</div>
            <div>Status: ${ambulance.status}</div>
          </div>
        `,
      });

      // Add click listener to ambulance marker
      ambulanceMarker.addListener("click", () => {
        // Close any open info windows
        newMarkers.forEach((marker) => {
          const markerInfoWindow = marker.get("infoWindow");
          if (markerInfoWindow) markerInfoWindow.close();
        });

        // Open this info window
        infoWindow.open(mapInstance, ambulanceMarker);

        // Set selected ambulance
        setSelectedAmbulance(ambulance);

        // Set destination to ambulance location
        handleDestinationChange(position);
      });

      // Store info window reference with marker
      ambulanceMarker.set("infoWindow", infoWindow);

      return ambulanceMarker;
    });

    setAmbulanceMarkers(newMarkers);
  };

  const showDirections = () => {
    if (
      !userLocation ||
      !destination ||
      !directionsService ||
      !directionsRenderer
    ) {
      console.error("Missing required elements for directions");
      return;
    }

    directionsService.route(
      {
        origin: userLocation.toJSON(),
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log("Directions received:", result);
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed due to", status);
        }
      }
    );
  };

  const centerOnUserLocation = () => {
    if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(15);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search for a location..."
              className="pl-10 pr-4 py-2 h-10 w-full"
            />
          </div>

          {/* Map container */}
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-[360px] rounded-md overflow-hidden"
            />

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Map controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full shadow-md bg-white hover:bg-gray-100"
                onClick={centerOnUserLocation}
              >
                <MapPin className="h-5 w-5 text-primary" />
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          {destination && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {selectedAmbulance ? (
                  <div className="font-medium">
                    Selected: {selectedAmbulance.ambulance_number} (
                    {selectedAmbulance.status})
                  </div>
                ) : (
                  <div className="font-medium">Destination selected</div>
                )}
              </div>
              <Button
                onClick={showDirections}
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                <span>Show Best Route</span>
              </Button>
            </div>
          )}

          {/* Ambulance count indicator */}
          {ambulances.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {ambulances.length} ambulance{ambulances.length !== 1 ? "s" : ""}{" "}
              available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapComponent;
