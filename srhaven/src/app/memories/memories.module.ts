import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoriesPageRoutingModule } from './memories-routing.module';

import { MemoriesPage } from './memories.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoriesPageRoutingModule,
    TranslateModule
  ],
  declarations: [MemoriesPage]
})
export class MemoriesPageModule {}
