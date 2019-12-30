import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      { path: 'friends', loadChildren: '../friends/friends.module#FriendsPageModule' },
      { path: 'addFriend', loadChildren: '../add-friend/add-friend.module#AddFriendPageModule' },
      { path: 'friend-confirmation', loadChildren: '../friend-confirmation/friend-confirmation.module#FriendConfirmationPageModule' },
      { path: ':friendId', loadChildren: '../friend-details/friend-details.module#FriendDetailsPageModule' },
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
