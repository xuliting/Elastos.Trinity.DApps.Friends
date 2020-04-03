import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PickFriendPage } from './pick-friend.page';
import { SharedModule } from 'src/app/modules/shared.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: PickFriendPage
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
  declarations: [PickFriendPage]
})
export class PickFriendPageModule {}
