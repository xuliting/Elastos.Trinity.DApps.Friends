import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InitPage } from './pages/init/init.page';

const routes: Routes = [
  { path: '', component: InitPage },
  { path: 'friends', loadChildren: './pages/friends/friends.module#FriendsPageModule' },
  { path: 'add', loadChildren: './pages/add/add.module#AddPageModule' },
  { path: 'confirm', loadChildren: './pages/confirm/confirm.module#ConfirmPageModule' },
  { path: 'customize', loadChildren: './pages/customize/customize.module#CustomizePageModule' },
  { path: 'invite', loadChildren: './pages/invite/invite.module#InvitePageModule' },
  { path: 'friends/:friendId', loadChildren: './pages/friend-details/friend-details.module#FriendDetailsPageModule' },
  { path: 'splash', loadChildren: './pages/splash/splash.module#SplashPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
