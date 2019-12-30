import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'friends', pathMatch: 'full' },
  { path: 'friends', loadChildren: './pages/friends/friends.module#FriendsPageModule' },
  { path: 'addFriend', loadChildren: './pages/add-friend/add-friend.module#AddFriendPageModule' },
  { path: 'friend-confirmation', loadChildren: './pages/friend-confirmation/friend-confirmation.module#FriendConfirmationPageModule' },
  { path: ':friendId', loadChildren: './pages/friend-details/friend-details.module#FriendDetailsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
