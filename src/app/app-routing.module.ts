import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { FriendsPageModule } from './pages/friends/friends.module';
import { AddFriendPageModule } from './pages/add-friend/add-friend.module';
import { FriendConfirmationPageModule } from './pages/friend-confirmation/friend-confirmation.module';
import { FriendDetailsPageModule } from './pages/friend-details/friend-details.module';
import { WarningPageModule } from './pages/friend-details/warning/warning.module';
import { Warning2PageModule } from './pages/friend-details/warning2/warning2.module';

const routes: Routes = [
  { path: '', redirectTo: 'friends', pathMatch: 'full' },
  { path: 'friends', loadChildren: () => FriendsPageModule },
  { path: 'addFriend', loadChildren: () => AddFriendPageModule},
  { path: 'friend-confirmation', loadChildren: () => FriendConfirmationPageModule },
  { path: ':friendId', loadChildren: () => FriendDetailsPageModule },
];

@NgModule({
  imports: [
    WarningPageModule,
    Warning2PageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
