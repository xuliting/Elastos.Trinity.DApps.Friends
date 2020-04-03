import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { AddFriendPage } from './add-friend.page';
import { SharedModule } from 'src/app/modules/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AddFriendPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddFriendPage]
})
export class AddFriendPageModule {}
