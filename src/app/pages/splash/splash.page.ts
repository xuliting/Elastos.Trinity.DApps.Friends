import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(
    private navController: NavController,
    public modalController: ModalController,
    public splashScreen: SplashScreen
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.splashScreen.hide();
    this.navController.navigateRoot("/friends");

    setTimeout(() => {
      this.modalController.dismiss();
    }, 3000);
  }

}
