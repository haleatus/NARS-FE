"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Ambulance } from "@/core/interface/ambulance.interface";

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

const GoogleMap: React.FC<MapComponentProps> = ({
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

  const locationOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    console.error("Error getting location:", error);
    const fallbackPos = new google.maps.LatLng(27.7172, 85.324);
    setUserLocation(fallbackPos);
    return fallbackPos;
  };

  const clearCurrentRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      directionsRenderer.setMap(map);
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

        if (map) {
          map.panTo(newUserPos);
        }
      },
      handleLocationError,
      locationOptions
    );

    setWatchId(id);
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const showDirections = () => {
    if (
      !userLocation ||
      !destination ||
      !directionsService ||
      !directionsRenderer
    )
      return;

    directionsService.route(
      {
        origin: userLocation,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          let bestRoute = result.routes.reduce((best, route) =>
            route.legs[0].duration &&
            best.legs[0].duration &&
            route.legs[0].duration.value < best.legs[0].duration.value
              ? route
              : best
          );

          directionsRenderer.setMap(map);
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed due to", status);
        }
      }
    );
  };

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
  }, [apiKey]);

  const initializeMap = async () => {
    if (!mapRef.current || map) return;

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            locationOptions
          );
        }
      );

      const userPos = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );

      setUserLocation(userPos);

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: userPos,
        zoom: 16,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
      });
      setMap(mapInstance);

      const marker = new google.maps.Marker({
        position: userPos,
        map: mapInstance,
        title: "Your Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#2563eb",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        },
        zIndex: 999,
      });
      setUserMarker(marker);

      setDirectionsService(new google.maps.DirectionsService());
      const renderer = new google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#2563eb",
          strokeWeight: 5,
        },
      });
      setDirectionsRenderer(renderer);

      mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          if (destinationMarker) {
            destinationMarker.setMap(null);
          }

          clearCurrentRoute();

          setDestination({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });

          const newMarker = new google.maps.Marker({
            position: event.latLng,
            map: mapInstance,
            title: "Selected Destination",
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new google.maps.Size(40, 40),
            },
            animation: google.maps.Animation.DROP,
          });

          setDestinationMarker(newMarker);
        }
      });

      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(
          searchInputRef.current
        );
        autocomplete.bindTo("bounds", mapInstance);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          if (destinationMarker) {
            destinationMarker.setMap(null);
          }

          clearCurrentRoute();

          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(17);

          setDestination({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });

          const newMarker = new google.maps.Marker({
            position: place.geometry.location,
            map: mapInstance,
            title: "Selected Destination",
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new google.maps.Size(40, 40),
            },
            animation: google.maps.Animation.DROP,
          });

          setDestinationMarker(newMarker);
        });
      }

      startLocationTracking();
      updateAmbulanceMarkers(mapInstance);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const updateAmbulanceMarkers = (mapInstance: google.maps.Map) => {
    ambulanceMarkers.forEach((marker) => marker.setMap(null));

    const newMarkers: google.maps.Marker[] = ambulances.map((ambulance) => {
      const ambulanceMarker = new google.maps.Marker({
        position: {
          lat: parseFloat(ambulance.location.latitude),
          lng: parseFloat(ambulance.location.longitude),
        },
        map: mapInstance,
        title: `Ambulance - ${ambulance._id}`,
        icon: {
          url: "/ambulance-icon.svg",
          scaledSize: new google.maps.Size(32, 32),
        },
        animation: google.maps.Animation.DROP,
      });

      ambulanceMarker.addListener("click", () => {
        if (destinationMarker) {
          destinationMarker.setMap(null);
        }

        clearCurrentRoute();

        setDestination({
          lat: parseFloat(ambulance.location.latitude),
          lng: parseFloat(ambulance.location.longitude),
        });

        const newMarker = new google.maps.Marker({
          position: {
            lat: parseFloat(ambulance.location.latitude),
            lng: parseFloat(ambulance.location.longitude),
          },
          map: mapInstance,
          title: "Selected Destination",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40),
          },
          animation: google.maps.Animation.DROP,
        });

        setDestinationMarker(newMarker);
      });

      return ambulanceMarker;
    });

    setAmbulanceMarkers(newMarkers);
  };

  useEffect(() => {
    if (map) updateAmbulanceMarkers(map);
  }, [ambulances, map]);

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto relative shadow-lg">
      <div className="space-y-4">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a location..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {destination && (
          <button
            className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md"
            onClick={showDirections}
          >
            <span>Show Best Route</span>
          </button>
        )}
        <div
          ref={mapRef}
          className="w-full h-[500px] rounded-lg overflow-hidden shadow-md border border-gray-200"
        />
      </div>
    </Card>
  );
};

export default GoogleMap;
