/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "@/hooks/use-google-maps";
import { UserAmbulanceRequestResponse } from "@/core/interface/user/ambulance-request";
import { FaAmbulance, FaHospital } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import ReactDOMServer from "react-dom/server";

interface MapComponentProps {
  apiKey: string;
  request: UserAmbulanceRequestResponse | null;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

// Function to convert a React icon to an SVG data URL
const getIcon = (
  Icon: React.ComponentType<{ size?: number; color?: string }>,
  color: string,
  size: number
) => {
  const svgString = ReactDOMServer.renderToString(
    React.createElement(Icon, { size: size, color: color })
  );
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgString);
};

const AmbulanceRouteMap: React.FC<MapComponentProps> = ({
  apiKey,
  request,
}) => {
  const { isLoaded } = useGoogleMaps(apiKey);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);

  const [
    directionsRendererAmbulanceToUser,
    setDirectionsRendererAmbulanceToUser,
  ] = useState<google.maps.DirectionsRenderer | null>(null);
  const [
    directionsRendererUserToHospital,
    setDirectionsRendererUserToHospital,
  ] = useState<google.maps.DirectionsRenderer | null>(null);

  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const ambulanceMarkerRef = useRef<google.maps.Marker | null>(null);
  const hospitalMarkerRef = useRef<google.maps.Marker | null>(null);

  // State to store user's current location
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
  );

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const initialCenter = userLocation || { lat: 27.7172, lng: 85.324 }; // Default Kathmandu

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 12,
    });

    setMap(mapInstance);
    setDirectionsService(new window.google.maps.DirectionsService());

    const rendererAmbulanceToUserInstance =
      new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "red", // Ambulance to User route color
        },
      });

    setDirectionsRendererAmbulanceToUser(rendererAmbulanceToUserInstance);

    const rendererUserToHospitalInstance =
      new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "blue", // User to Hospital route color
        },
      });
    setDirectionsRendererUserToHospital(rendererUserToHospitalInstance);

    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLatLng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );

            setUserLocation(userLatLng);

            // Update map center
            mapInstance.setCenter(userLatLng);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };
    getCurrentLocation();

    return () => {
      if (directionsRendererAmbulanceToUser)
        directionsRendererAmbulanceToUser.setMap(null);
      if (directionsRendererUserToHospital)
        directionsRendererUserToHospital.setMap(null);
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
      if (ambulanceMarkerRef.current) ambulanceMarkerRef.current.setMap(null);
      if (hospitalMarkerRef.current) hospitalMarkerRef.current.setMap(null);
    };
  }, [isLoaded]);

  useEffect(() => {
    if (
      !map ||
      !request?.data ||
      !directionsService ||
      !directionsRendererAmbulanceToUser ||
      !directionsRendererUserToHospital ||
      !userLocation
    ) {
      return;
    }

    const ambulanceLatLng = new google.maps.LatLng(
      parseFloat(request.data.ambulance.location.latitude),
      parseFloat(request.data.ambulance.location.longitude)
    );

    const userLatLng = userLocation;

    const hospitalLatLng = new google.maps.LatLng(
      parseFloat(request.data.hospital_location.latitude),
      parseFloat(request.data.hospital_location.longitude)
    );

    // Create markers *after* location data is available
    userMarkerRef.current = new google.maps.Marker({
      position: userLatLng,
      map: map,
      title: "User Location",
      icon: {
        url: getIcon(GoDotFill, "blue", 30),
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    ambulanceMarkerRef.current = new google.maps.Marker({
      position: ambulanceLatLng,
      map: map,
      title: "Ambulance Location",
      icon: {
        url: getIcon(FaAmbulance, "red", 30),
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    hospitalMarkerRef.current = new google.maps.Marker({
      position: hospitalLatLng,
      map: map,
      title: "Hospital Location",
      icon: {
        url: getIcon(FaHospital, "black", 30),
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    calculateAndDisplayRoutes(ambulanceLatLng, userLatLng, hospitalLatLng);

    return () => {
      if (ambulanceMarkerRef.current) ambulanceMarkerRef.current.setMap(null);
      if (hospitalMarkerRef.current) hospitalMarkerRef.current.setMap(null);
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    };
  }, [
    map,
    request,
    directionsService,
    directionsRendererAmbulanceToUser,
    directionsRendererUserToHospital,
    userLocation,
  ]);

  const calculateAndDisplayRoutes = (
    ambulanceLocation: google.maps.LatLng,
    userLocation: google.maps.LatLng,
    hospitalLocation: google.maps.LatLng
  ) => {
    if (
      !directionsService ||
      !directionsRendererAmbulanceToUser ||
      !directionsRendererUserToHospital
    )
      return;

    // Route from Ambulance to User
    directionsService.route(
      {
        origin: ambulanceLocation,
        destination: userLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && response) {
          directionsRendererAmbulanceToUser.setDirections(response);
        } else {
          console.error(
            "Directions request failed (ambulance to user) due to " + status,
            response
          );
        }
      }
    );

    // Route from User to Hospital
    directionsService.route(
      {
        origin: userLocation,
        destination: hospitalLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && response) {
          directionsRendererUserToHospital.setDirections(response);
        } else {
          console.error(
            "Directions request failed (user to hospital) due to " + status,
            response
          );
        }
      }
    );
  };

  return <div ref={mapRef} className="w-full h-full" />;
};

export default AmbulanceRouteMap;
