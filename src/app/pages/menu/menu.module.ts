import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';
import { FriendsPageModule } from '../friends/friends.module';
import { AddFriendPageModule } from '../add-friend/add-friend.module';
import { FriendDetailsPageModule } from '../friend-details/friend-details.module';
import { FriendConfirmationPageModule } from '../friend-confirmation/friend-confirmation.module';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      { path: 'friends', loadChildren: () => FriendsPageModule },
      { path: 'addFriend', loadChildren: () => AddFriendPageModule },
      { path: 'friend-confirmation', loadChildren: () => FriendConfirmationPageModule },
      { path: ':friendId', loadChildren: () => FriendDetailsPageModule},
    ]
  },
  {
    path: '',
    redirectTo: '/menu/friends'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
