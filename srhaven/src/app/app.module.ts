import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Import the new API

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ApiService } from './services/api.service'; // Import ApiService

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ApiService,
    provideHttpClient(withInterceptorsFromDi()), // Use the new provide-based API for HttpClient
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
