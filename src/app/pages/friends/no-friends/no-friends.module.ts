import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { NoFriendsPage } from './no-friends.page';
import { SharedModule } from 'src/app/modules/shared.module';

const routes: Routes = [
  {
    path: '',
    component: NoFriendsPage
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
  declarations: [NoFriendsPage]
})
export class NoFriendsPageModule {}
