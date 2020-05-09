import { Component, ViewChild } from '@angular/core';

import { Platform, NavController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FriendsService } from './services/friends.service';
import { Router } from '@angular/router';
import { SplashPage } from './pages/splash/splash.page';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, {static: true}) routerOutlet: IonRouterOutlet;

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private friendsService: FriendsService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.navController.navigateRoot("/friends");
      this.friendsService.init();
      this.splashScreen.hide();

      // this.splash();

      this.setupBackKeyNavigation();
    });
  }

  async splash() {
    const splash = await this.modalController.create({ component: SplashPage});
    return await splash.present();
  }

  /**
   * Listen to back key events. If the default router can go back, just go back.
   * Otherwise, exit the application.
   */
  setupBackKeyNavigation() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else {
        navigator['app'].exitApp();
      }
    });
  }
}
