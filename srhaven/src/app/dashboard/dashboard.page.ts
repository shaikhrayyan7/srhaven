import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  logout() {
    localStorage.removeItem('userToken'); // Clear the user token
    sessionStorage.clear();
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  capturedImage: string = '';
  recognition: any;
  isWebCameraOpen: boolean = false;

  // Map menu labels to their respective routes
  menuRoutes: { [key: string]: string } = {
    'MEMORIES': '/memories',
    'JOURNEY': '/journey',
    'PROFILE': '/profile',
    'BLOG': '/blog',
    'ABOUT': '/about',
  };

  constructor(
    private router: Router,
    private platform: Platform,
    private translate: TranslateService,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    // Apply the selected language from localStorage
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.use(savedLanguage);
  }

  ionViewWillEnter() {
    console.log(this.translate.instant('DASHBOARD.WELCOME_MESSAGE'));
    this.initializeSpeechRecognition();
  }

  async openCamera() {
    if (this.platform.is('hybrid')) {
      try {
        const photo = await Camera.getPhoto({
          quality: 100,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          width: 800,
        });
        this.capturedImage = photo.webPath || '';
        this.router.navigate(['/create-memory'], {
          queryParams: { imageUrl: this.capturedImage, date: new Date().toLocaleString() },
        });
      } catch (error) {
        console.error(this.translate.instant('DASHBOARD.CAMERA_ERROR'), error);
      }
    } else {
      this.openWebCamera();
    }
  }

  openWebCamera() {
    console.log('Attempting to access webcam...');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia is supported');
      this.isWebCameraOpen = true;
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          console.log('Webcam stream obtained:', stream);
          const videoElement = document.querySelector('video') as HTMLVideoElement;
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch((err) => {
          console.error('Error accessing webcam:', err);
          alert(this.translate.instant('DASHBOARD.WEBCAM_UNSUPPORTED'));
        });
    } else {
      console.error('getUserMedia is not supported in this browser.');
      alert(this.translate.instant('DASHBOARD.WEBCAM_UNSUPPORTED'));
    }
  }
  

  captureImageFromWebCamera() {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const capturedImage = canvas.toDataURL('image/png');
      this.router.navigate(['/create-memory'], {
        queryParams: { imageUrl: capturedImage, date: new Date().toLocaleString() },
      });
      this.closeCamera();
    }
  }

  closeCamera() {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      const stream = videoElement.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
    this.isWebCameraOpen = false;
  }

  onMenuItemClick(route: string) {
    this.router.navigate([route]);
  }

  initializeSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = this.translate.currentLang;
      this.recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        this.handleSpeechCommand(command);
      };
    }
  }

  startListening() {
    this.recognition?.start();
  }

  handleSpeechCommand(command: string) {
    const matchedRoute = Object.keys(this.menuRoutes).find(label =>
      command.includes(label.toLowerCase())
    );
    if (matchedRoute) {
      this.router.navigate([this.menuRoutes[matchedRoute]]);
    }
  }

  // logout() {
  //   this.authService.logout(); // Clear user session
  //   this.router.navigate(['/login'], { state: { clearFields: true } }); // Pass state to clear fields
  // }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: this.translate.instant('LOGOUT.CONFIRM_HEADER') || 'Confirm Logout',
      message: this.translate.instant('LOGOUT.CONFIRM_MESSAGE') || 'Are you sure you want to log out?',
      buttons: [
        {
          text: this.translate.instant('LOGOUT.CANCEL') || 'Cancel',
          role: 'cancel',
        },
        {
          text: this.translate.instant('LOGOUT.CONFIRM') || 'Logout',
          handler: () => {
            this.logout();
          },
        },
      ],
    });
    await alert.present();
  }

  logout() {
    this.authService.logout(); // Clear user session
    this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home']);
    });
  }
  

}
