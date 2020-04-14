import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'friends', loadChildren: './pages/friends/friends.module#FriendsPageModule' },
  { path: 'add', loadChildren: './pages/add/add.module#AddPageModule' },
  { path: 'confirm', loadChildren: './pages/confirm/confirm.module#ConfirmPageModule' },
  { path: 'customize', loadChildren: './pages/customize/customize.module#CustomizePageModule' },
  { path: 'invite', loadChildren: './pages/invite/invite.module#InvitePageModule' },
  { path: 'friends/:friendId', loadChildren: './pages/friend-details/friend-details.module#FriendDetailsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
