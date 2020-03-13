import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FriendsService } from './services/friends.service';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private navController: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private friendsService: FriendsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.friendsService.init();
      this.splashScreen.hide();

      titleBarManager.setBackgroundColor("#FFFFFF");
      titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.DARK);

      this.navController.navigateRoot("/friends");
    });
  }
}
