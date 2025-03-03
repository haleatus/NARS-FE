/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { createAmbulanceRequestSchema } from "@/app/schema/user/ambulance-request";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Search } from "lucide-react";
import createAmbulanceRequest from "@/app/actions/user/ambulance-request/create-ambulance-request.action";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 27.7172,
  lng: 85.324,
};

const bagmatiBounds = {
  north: 28.3,
  south: 26.55,
  west: 84.0,
  east: 86.7,
};

interface CreateAmbulanceRequestFormProps {
  ambulanceId: string;
  accessToken: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  ambulanceNumber: string;
  ambulanceDriver: string;
}

export function CreateAmbulanceRequestFormV3({
  ambulanceId,
  accessToken,
  onSuccess,
  onCancel,
  ambulanceNumber,
  ambulanceDriver,
}: CreateAmbulanceRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [formData, setFormData] = useState({
    ambulance: ambulanceId,
    hospital_location: {
      latitude: "",
      longitude: "",
    },
  });

  // Initialize the map
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !map &&
      mapRef.current &&
      !isMapLoaded
    ) {
      // Check if Google Maps API is loaded
      if (window.google && window.google.maps) {
        initMap();
      } else {
        // Load Google Maps API if not already loaded
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      }
    }
  }, [map, isMapLoaded]);

  const initMap = () => {
    if (!mapRef.current) return;

    const newMap = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 14,
      restriction: {
        latLngBounds: bagmatiBounds,
        strictBounds: true,
      },
    });

    newMap.addListener("click", (event: google.maps.MapMouseEvent) => {
      handleMapClick(event);
    });

    setMap(newMap);
    setPlacesService(new google.maps.places.PlacesService(newMap));
    setIsMapLoaded(true);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();

      // Clear previous marker if exists
      clearMarkers();

      // Create a new marker
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
      });

      setSelectedHospital({
        latitude,
        longitude,
        name: "Selected Location",
        marker,
      });

      setFormData({
        ...formData,
        hospital_location: {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        },
      });
    }
  };

  const clearMarkers = () => {
    if (selectedHospital && selectedHospital.marker) {
      selectedHospital.marker.setMap(null);
    }

    // Clear search result markers
    searchResults.forEach((result) => {
      if (result.marker) {
        result.marker.setMap(null);
      }
    });
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!placesService || !map || !searchQuery.trim()) return;

    const request = {
      query: `hospital ${searchQuery}`,
      bounds: map.getBounds() || undefined,
      location: map.getCenter() || undefined,
      radius: 5000,
      type: ["hospital", "health"],
    };

    placesService.textSearch(
      { ...request, type: "hospital" },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Clear previous markers
          clearMarkers();

          // Create markers for search results
          const mappedResults = results.map((place) => {
            const marker = new google.maps.Marker({
              position: place.geometry?.location,
              map: map,
              title: place.name,
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              },
            });

            // Add click listener to each marker
            marker.addListener("click", () => {
              if (place.geometry?.location) {
                const latitude = place.geometry.location.lat();
                const longitude = place.geometry.location.lng();

                clearMarkers();

                const selectedMarker = new google.maps.Marker({
                  position: { lat: latitude, lng: longitude },
                  map: map,
                });

                setSelectedHospital({
                  latitude,
                  longitude,
                  name: place.name,
                  marker: selectedMarker,
                });

                setFormData({
                  ...formData,
                  hospital_location: {
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                  },
                });
              }
            });

            return {
              ...place,
              latitude: place.geometry?.location?.lat(),
              longitude: place.geometry?.location?.lng(),
              marker,
            };
          });

          setSearchResults(mappedResults);

          // Center map and adjust zoom to show all results
          if (mappedResults.length > 0 && map) {
            const bounds = new google.maps.LatLngBounds();
            mappedResults.forEach((result) => {
              if (result.geometry?.location) {
                bounds.extend(result.geometry.location);
              }
            });
            map.fitBounds(bounds);
          }
        } else {
          toast.error("No hospitals found");
        }
      }
    );
  };

  const selectSearchResult = (result: any) => {
    if (result.geometry?.location) {
      // Center the map on the selected location
      map?.panTo({ lat: result.latitude, lng: result.longitude });
      map?.setZoom(16);

      // Clear previous markers
      clearMarkers();

      // Create a new marker
      const marker = new google.maps.Marker({
        position: { lat: result.latitude, lng: result.longitude },
        map: map,
      });

      setSelectedHospital({
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        marker,
      });

      setFormData({
        ...formData,
        hospital_location: {
          latitude: result.latitude.toString(),
          longitude: result.longitude.toString(),
        },
      });

      // Clear search results after selection
      setSearchResults([]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      createAmbulanceRequestSchema.parse(formData);
      const result = await createAmbulanceRequest({
        accessToken,
        createAmbulanceRequestData: formData,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Ambulance request created successfully");
      onSuccess?.();
    } catch (error: any) {
      if (error.errors) {
        const validationErrors: { [key: string]: string } = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
          validationErrors[path] = err.message;
        });
        setErrors(validationErrors);
        toast.error("Validation Error: Please check the form for errors");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto font-sans max-h-[calc(100vh-5rem)] overflow-y-auto">
      <CardHeader>
        <CardTitle>Create Ambulance Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="ambulance" value={ambulanceId} />

          {/* Display selected ambulance */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Selected Ambulance</p>
            <p className="font-medium">{ambulanceDriver}</p>
            <p className="font-medium">{ambulanceNumber}</p>
          </div>

          {/* Hospital Search - Now a div instead of a form */}
          <div className="space-y-2">
            <h3 className="font-medium">Search for Hospital</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for hospitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <Button type="button" size="sm" onClick={() => handleSearch()}>
                <Search className="w-4 h-4 mr-1" />
                Search
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                <p className="text-sm font-medium mb-1">Search Results:</p>
                <ul className="space-y-1">
                  {searchResults.map((result, index) => (
                    <li key={index}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left text-sm py-1 h-auto"
                        onClick={() => selectSearchResult(result)}
                      >
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{result.name}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Google Map for Hospital Selection */}
          <div className="space-y-4">
            <h3 className="font-medium">Select Hospital Location</h3>
            <p className="text-sm text-muted-foreground">
              Click on the map to select a location or search for a hospital
              above
            </p>
            <div
              ref={mapRef}
              style={mapContainerStyle}
              className="rounded-md border border-input"
            ></div>

            {selectedHospital ? (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{selectedHospital.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Latitude: {selectedHospital.latitude.toFixed(6)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Longitude: {selectedHospital.longitude.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Please select a hospital by searching or clicking on the map
                </p>
              </div>
            )}
            {errors["hospital_location"] && (
              <p className="text-red-500 text-sm">
                {errors["hospital_location"]}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedHospital}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Request"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
