import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.page.html',
  styleUrls: ['./journey.page.scss'],
})
export class JourneyPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  map!: google.maps.Map;
  currentLat!: number;
  currentLng!: number;

  visitedPlaces: { lat: number; lng: number; title: string }[] = [
    { lat: 40.7128, lng: -74.0060, title: 'New York City' },
    { lat: 34.0522, lng: -118.2437, title: 'Los Angeles' },
    { lat: 51.5074, lng: -0.1278, title: 'London' },
    { lat: 48.8566, lng: 2.3522, title: 'Paris' },
    { lat: 35.6895, lng: 139.6917, title: 'Tokyo' },
    { lat: 28.6139, lng: 77.209, title: 'Delhi' },
    { lat: 55.7558, lng: 37.6173, title: 'Moscow' },
    { lat: 41.9028, lng: 12.4964, title: 'Rome' },
    { lat: 39.9042, lng: 116.4074, title: 'Beijing' },
    { lat: 37.7749, lng: -122.4194, title: 'San Francisco' },
  ];

  constructor() {}

  async ngOnInit() {
    const loader = new Loader({
      apiKey: 'AIzaSyAQRBuMtWmueWVCxE_W5OF43LuqyRb9ffk', // Replace with your Google Maps API key
      version: 'weekly',
    });

    try {
      const position = await Geolocation.getCurrentPosition();
      this.currentLat = position.coords.latitude;
      this.currentLng = position.coords.longitude;

      loader.load().then(() => {
        const mapOptions: google.maps.MapOptions = {
          center: { lat: this.currentLat, lng: this.currentLng },
          zoom: 5,
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        const currentLocationIcon: google.maps.Icon = {
          url: 'https://maps.google.com/mapfiles/kml/paddle/red-blank.png',
          scaledSize: new google.maps.Size(32, 32), // Properly defined scaledSize
        };

        const currentLocationInfo = new google.maps.InfoWindow({
          content: '<div style="font-size:14px; font-weight:bold;">Current Location</div>',
        });

        const currentLocationMarker = new google.maps.Marker({
          position: { lat: this.currentLat, lng: this.currentLng },
          map: this.map,
          title: 'You are here!',
          icon: currentLocationIcon,
        });

        currentLocationMarker.addListener('click', () => {
          currentLocationInfo.open(this.map, currentLocationMarker);
        });

        currentLocationInfo.open(this.map, currentLocationMarker);

        const visitedPlaceIcon: google.maps.Icon = {
          url: 'https://maps.google.com/mapfiles/kml/paddle/grn-blank.png',
          scaledSize: new google.maps.Size(32, 32), // Properly defined scaledSize
        };

        this.visitedPlaces.forEach((place) => {
          const visitedMarker = new google.maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            map: this.map,
            title: place.title,
            icon: visitedPlaceIcon,
          });

          const visitedPlaceInfo = new google.maps.InfoWindow({
            content: `<div style="font-size:14px; font-weight:bold;">${place.title}</div>`,
          });

          visitedMarker.addListener('click', () => {
            visitedPlaceInfo.open(this.map, visitedMarker);
          });
        });
      });
    } catch (error) {
      console.error('Error getting location', error);
    }
  }
}
