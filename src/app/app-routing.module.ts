import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FriendsPageModule } from './pages/friends/friends.module';
import { FriendDetailsPageModule } from './pages/friend-details/friend-details.module';
import { AddFriendPageModule } from './pages/add-friend/add-friend.module';

const routes: Routes = [
  { path: '', redirectTo: 'friends', pathMatch: 'full'},
  { path: 'friends', loadChildren: () => FriendsPageModule },
  { path: 'addFriend', loadChildren: () => AddFriendPageModule },
  { path: ':friendId', loadChildren: () => FriendDetailsPageModule },
];

@NgModule({
  imports: [
    FriendsPageModule,
    FriendDetailsPageModule,
    AddFriendPageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
