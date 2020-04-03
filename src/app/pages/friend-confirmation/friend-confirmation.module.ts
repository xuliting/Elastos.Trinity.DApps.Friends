import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendConfirmationPage } from './friend-confirmation.page';
import { SharedModule } from 'src/app/modules/shared.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: FriendConfirmationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FriendConfirmationPage]
})
export class FriendConfirmationPageModule {}
