declare namespace google {
    export namespace maps {
      class Map {
        constructor(element: HTMLElement, options: MapOptions);
        setCenter(latLng: LatLngLiteral): void;
        setZoom(zoom: number): void;
  
        // AddListener method for handling events on the map
        addListener(eventName: string, handler: (event: any) => void): void;
      }
  
      interface MapOptions {
        center: LatLngLiteral;
        zoom: number;
      }
  
      class Marker {
        constructor(options: MarkerOptions);
        setMap(map: Map | null): void;
  
        // AddListener method for handling events on the marker
        addListener(eventName: string, handler: (event: any) => void): void;
      }
  
      interface MarkerOptions {
        position: LatLngLiteral;
        map?: Map;
        title?: string;
  
        // Support for custom icons
        icon?: string | Icon;
      }
  
      interface Icon {
        url: string;
        size?: Size;
        scaledSize?: Size;
      }
  
      interface Size {
        width: number;
        height: number;
        equals(other: Size): boolean;
      }
  
      class Size {
        constructor(width: number, height: number);
        equals(other: Size): boolean;
      }
  
      interface LatLngLiteral {
        lat: number;
        lng: number;
      }
  
      class InfoWindow {
        constructor(options?: InfoWindowOptions);
        setContent(content: string | Node): void;
        open(map: Map, anchor?: Marker): void;
        close(): void;
      }
  
      interface InfoWindowOptions {
        content?: string | Node;
        position?: LatLngLiteral;
      }
  
      class Geocoder {
        geocode(
          request: GeocoderRequest,
          callback: (results: GeocoderResult[], status: GeocoderStatus) => void
        ): void;
      }
  
      interface GeocoderRequest {
        address?: string;
        location?: LatLngLiteral;
      }
  
      interface GeocoderResult {
        formatted_address: string;
        geometry: {
          location: LatLngLiteral;
        };
      }
  
      type GeocoderStatus =
        | 'OK'
        | 'ZERO_RESULTS'
        | 'OVER_QUERY_LIMIT'
        | 'REQUEST_DENIED'
        | 'INVALID_REQUEST';
  
      class Polyline {
        constructor(options: PolylineOptions);
        setMap(map: Map | null): void;
      }
  
      interface PolylineOptions {
        path: LatLngLiteral[];
        map?: Map;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
      }
  
      class LatLng {
        constructor(lat: number, lng: number);
      }
    }
  }
  