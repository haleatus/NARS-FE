"use client";

import { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Ambulance } from "@/core/interface/ambulance.interface";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapProps {
  ambulanceData: Ambulance[];
}

const GoogleMapComponentV2: React.FC<MapProps> = ({ ambulanceData }) => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [searchLngLat, setSearchLngLat] = useState<LatLng | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Geolocation error:", error)
    );
  }, []);

  if (!isLoaded) return <div className="loading">Loading...</div>;

  const center: LatLng = currentLocation || { lat: 27.7172, lng: 85.324 };

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place || !place.geometry || !place.geometry.location) return;

    setSelectedPlace(place);
    setSearchLngLat({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setCurrentLocation(null);
  };

  const handleGetLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedPlace(null);
          setSearchLngLat(null);
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Geolocation error:", error)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="map-container">
      {/* Search Box */}
      <div className="search-box-container">
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
          options={{ fields: ["address_components", "geometry", "name"] }}
        >
          <input
            className="search-box"
            type="text"
            placeholder="Search for a location"
          />
        </Autocomplete>

        <button className="get-location-btn" onClick={handleGetLocationClick}>
          Get My Location
        </button>
      </div>

      {/* Google Map */}
      <GoogleMap
        zoom={currentLocation || selectedPlace ? 16 : 12}
        center={currentLocation || searchLngLat || center}
        mapContainerClassName="map"
        mapContainerStyle={{ width: "100%", height: "80vh" }}
      >
        {/* Selected Place Marker */}
        {selectedPlace && searchLngLat && <Marker position={searchLngLat} />}

        {/* User's Current Location Marker */}
        {currentLocation && (
          <Marker position={currentLocation} icon="/user-location.svg" />
        )}

        {/* Plot Ambulance Data */}
        {ambulanceData.map((ambulance) => (
          <Marker
            key={ambulance._id}
            position={{
              lat: Number(ambulance.location.latitude), // Ensure it's a number
              lng: Number(ambulance.location.longitude), // Pass longitude correctly
            }}
            icon={{
              url: "/hospital-icon.svg",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        ))}
      </GoogleMap>

      {/* Styles */}
      <style jsx>{`
        .map-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          width: 100%;
          max-width: 1200px;
          margin: auto;
        }

        .search-box-container {
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 10px;
          width: 90%;
          max-width: 600px;
        }

        .search-box {
          flex-grow: 1;
          padding: 12px;
          font-size: 16px;
          border: 2px solid #ccc;
          border-radius: 8px;
          outline: none;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .get-location-btn {
          padding: 12px 15px;
          font-size: 16px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .get-location-btn:hover {
          background-color: #2563eb;
        }

        .map {
          width: 100%;
          height: 80vh;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .loading {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default GoogleMapComponentV2;
