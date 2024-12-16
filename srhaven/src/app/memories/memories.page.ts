import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-memories',
  templateUrl: './memories.page.html',
  styleUrls: ['./memories.page.scss'],
})
export class MemoriesPage {
  memoryImages: string[] = [];
  userEmail: string = '';

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private http: HttpClient,
    private translate: TranslateService
  ) {
    // Retrieve the selected language
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.use(savedLanguage);

    // Retrieve the logged-in user's email
    this.userEmail = localStorage.getItem('userEmail') || '';
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  async uploadPicture() {
    const actionSheet = await this.actionSheetController.create({
      header: this.translate.instant('MEMORIES.CHOOSE_IMAGE'),
      buttons: [
        {
          text: this.translate.instant('MEMORIES.SELECT_FROM_GALLERY'),
          handler: () => {
            this.selectImageFromGallery();
          },
        },
        {
          text: this.translate.instant('MEMORIES.CANCEL'),
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async selectImageFromGallery() {
    try {
      const photo = await Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        width: 800,
      });

      await this.uploadImage(photo);
    } catch (error) {
      console.error(this.translate.instant('MEMORIES.IMAGE_ERROR'), error);
    }
  }

  async uploadImage(photo: any) {
    try {
      const formData = new FormData();
      const imageFile = await fetch(photo.webPath);
      const imageBlob = await imageFile.blob();
      formData.append('image', imageBlob, 'image.jpg');
      formData.append('email', this.userEmail);

      await this.http.post('http://localhost:5000/api/upload', formData).toPromise();
      this.loadMemories();
    } catch (error) {
      console.error(this.translate.instant('MEMORIES.UPLOAD_ERROR'), error);
    }
  }

  async loadMemories() {
    try {
      const memories = await this.http.get<any>(`http://localhost:5000/api/memories/${this.userEmail}`).toPromise();
      this.memoryImages = memories.map((memory: any) => memory.image);
    } catch (error) {
      console.error(this.translate.instant('MEMORIES.FETCH_ERROR'), error);
    }
  }

  ngOnInit() {
    this.loadMemories();
  }
}
