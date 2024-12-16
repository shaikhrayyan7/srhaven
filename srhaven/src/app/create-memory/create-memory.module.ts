import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateMemoryPageRoutingModule } from './create-memory-routing.module';
import { CreateMemoryPage } from './create-memory.page';
import { DatePipe } from '@angular/common';  // Import DatePipe

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMemoryPageRoutingModule
  ],
  declarations: [CreateMemoryPage],
  providers: [DatePipe]  // Provide DatePipe here
})
export class CreateMemoryPageModule {}
