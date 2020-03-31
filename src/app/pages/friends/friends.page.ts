import { Component, OnInit } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PopoverController } from '@ionic/angular';
import { NoFriendsPage } from './no-friends/no-friends.page';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  friendsLoaded = true;

  constructor(
    private popover: PopoverController,
    public friendsService: FriendsService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    titleBarManager.setTitle('Contacts');
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
    this.checkForFriends();
  }

  async checkForFriends() {
    await this.friendsService.getStoredDIDs().then((friends) => {
      console.log('My friends', friends);
      if(this.friendsService._friends.length > 0) {
          return;
      } else {
        this.alertNoFriends();
      }
    });
  }

  async alertNoFriends() {
    const popover = await this.popover.create({
      mode: 'ios',
      cssClass: 'no-friends',
      component: NoFriendsPage
    });

    return await popover.present();
  }
}
