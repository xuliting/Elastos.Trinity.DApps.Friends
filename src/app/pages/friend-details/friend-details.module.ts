import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendDetailsPage } from './friend-details.page';
import { RoundedActionButtonComponent } from 'src/app/components/rounded-action-button/rounded-action-button.component';
import { SharedModule } from 'src/app/modules/shared.module';

const routes: Routes = [
  {
    path: '',
    component: FriendDetailsPage
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
    FriendDetailsPage,
    RoundedActionButtonComponent,
  ]
})
export class FriendDetailsPageModule {}
