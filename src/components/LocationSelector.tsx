import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { getAxiosInstance } from "@Components/Editor/SunEditor/utils";
const axios = getAxiosInstance();

const MAP_API_KEY = `AIzaSyDo3yn8HpM1uCVw99j2O2WGLgZQmp-c12c`;

interface Location {
  lat: number;
  lng: number;
  label: string;
}

interface LocationAutocompleteProps {
  onLocationChange?: (location: Location) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  onLocationChange,
}) => {
  const handleSelect = async (value: any) => {
    if (value && value.value && value.value.place_id && onLocationChange) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${value.value.place_id}&key=${MAP_API_KEY}`
        );

        if (
          response.data &&
          response.data.result &&
          response.data.result.geometry &&
          response.data.result.geometry.location
        ) {
          const location = {
            lat: response.data.result.geometry.location.lat,
            lng: response.data.result.geometry.location.lng,
            label: value.value.description,
          };
          onLocationChange(location);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    }
  };
  //   Node Backend: If you have a backend server, you could create an API endpoint in your backend that interacts with the Google Maps services. This is more secure (as you're not exposing your API key

  return (
    <GooglePlacesAutocomplete
      apiKey={MAP_API_KEY}
      selectProps={{
        onChange: handleSelect,
      }}
    />
  );
};

export default LocationAutocomplete;
