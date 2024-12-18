import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  userEmail: string = '';
  memories: any[] = []; // To store memory data from backend

  //predefined list of places
  predefinedPlaces: { lat: number; lng: number; title: string }[] = [
    { lat: 40.7128, lng: -74.0060, title: 'New York City' },
    { lat: 34.0522, lng: -118.2437, title: 'Los Angeles' },
    { lat: 51.5074, lng: -0.1278, title: 'London' },
    { lat: 48.8566, lng: 2.3522, title: 'Paris' },
    { lat: 35.6895, lng: 139.6917, title: 'Tokyo' },
    { lat: 28.6139, lng: 77.209, title: 'Delhi' },
  ];

  constructor(private http: HttpClient, private router: Router) {}

  async ngOnInit() {
    // Retrieve the logged-in user's email from localStorage
    this.userEmail = localStorage.getItem('email') || '';
    if (!this.userEmail) {
      console.error('No email found in localStorage. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    // Initialize Google Maps Loader with the API key
    const loader = new Loader({
      apiKey: 'AIzaSyAQRBuMtWmueWVCxE_W5OF43LuqyRb9ffk',
      version: 'weekly',
    });

    try {
      // Get user's current location
      const position = await Geolocation.getCurrentPosition();
      this.currentLat = position.coords.latitude;
      this.currentLng = position.coords.longitude;

      loader.load().then(() => {
        // Initialize Google Map API
        const mapOptions: google.maps.MapOptions = {
          center: { lat: this.currentLat, lng: this.currentLng },
          zoom: 5,
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        // Add Current Location Marker (red)
        this.addMarker(
          { lat: this.currentLat, lng: this.currentLng },
          'You are here!',
          'https://maps.google.com/mapfiles/kml/paddle/red-blank.png'
        );

        // Add Predefined Location Markers (green)
        this.predefinedPlaces.forEach((place) => {
          this.addMarker(
            { lat: place.lat, lng: place.lng },
            place.title,
            'https://maps.google.com/mapfiles/kml/paddle/grn-blank.png'
          );
        });

        // Fetch Memories (Locations from Database)
        this.loadMemories();
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  // Fetch memories with GPS coordinates from the backend
  async loadMemories() {
    try {
      const response = await this.http
        .get<any>(`http://localhost:5000/api/memories/${this.userEmail}`)
        .toPromise();

      this.memories = response.memories;

      const memoryIcon = 'https://maps.google.com/mapfiles/kml/paddle/blu-blank.png';

      this.memories.forEach((memory) => {
        if (memory.gpsCoordinates !== 'Not available') {
          const [latitude, longitude] = memory.gpsCoordinates
            .replace('Latitude: ', '')
            .replace('Longitude: ', '')
            .split(',')
            .map(Number);

          this.addMarker(
            { lat: latitude, lng: longitude },
            memory.place || 'Memory Location',
            memoryIcon
          );
        }
      });
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  }

  // Function to add a marker to the map
  addMarker(position: { lat: number; lng: number }, title: string, iconUrl: string) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(32, 32),
      },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="font-size:14px; font-weight:bold;">${title}</div>`,
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
  }
}
