// src/types/global.d.ts
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => google.maps.places.AutocompleteService;
          PlacesService: new (node: HTMLElement) => google.maps.places.PlacesService;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            OVER_QUERY_LIMIT: string;
            REQUEST_DENIED: string;
            INVALID_REQUEST: string;
            NOT_FOUND: string;
          };
        };
      };
    };
  }

  namespace google {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }

      namespace places {
        interface AutocompletePrediction {
          description: string;
          place_id: string;
          structured_formatting: {
            main_text: string;
            secondary_text: string;
          };
        }

        interface PlaceDetailsRequest {
          placeId: string;
          fields: string[];
        }

        interface PlaceResult {
          place_id: string;
          name: string;
          formatted_address: string;
          geometry: {
            location: LatLng;
            viewport: any;
          };
        }

        interface AutocompleteRequest {
          input: string;
          types?: string[];
          componentRestrictions?: {
            country: string | string[];
          };
        }

        class AutocompleteService {
          getPlacePredictions(
            request: AutocompleteRequest,
            callback: (predictions: AutocompletePrediction[] | null, status: string) => void
          ): void;
        }

        class PlacesService {
          constructor(node: HTMLElement);
          getDetails(
            request: PlaceDetailsRequest,
            callback: (result: PlaceResult | null, status: string) => void
          ): void;
        }

        enum PlacesServiceStatus {
          OK = 'OK',
          ZERO_RESULTS = 'ZERO_RESULTS',
          OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
          REQUEST_DENIED = 'REQUEST_DENIED',
          INVALID_REQUEST = 'INVALID_REQUEST',
          NOT_FOUND = 'NOT_FOUND'
        }
      }
    }
  }
}

export {};