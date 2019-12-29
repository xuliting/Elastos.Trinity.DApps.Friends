import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Warning2Page } from './warning2.page';
import { DIDButtonComponent } from 'src/app/components/did-button/did-button.component';
import { SharedModule } from 'src/app/modules/shared.module';

const routes: Routes = [
  {
    path: '',
    component: Warning2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    Warning2Page,
  ]
})
export class Warning2PageModule {}
