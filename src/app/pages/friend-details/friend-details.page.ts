import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController, PopoverController } from '@ionic/angular';

import { FriendsService } from 'src/app/services/friends.service';
import { Friend } from 'src/app/models/friends.model';

import { WarningPage } from './warning/warning.page';
import { Warning2Page } from './warning2/warning2.page';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.page.html',
  styleUrls: ['./friend-details.page.scss'],
})
export class FriendDetailsPage implements OnInit {

  friend: Friend;

  constructor(
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private popover: PopoverController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('friendId')) {
        this.navCtrl.navigateBack('/friends');
        return;
      }
      this.friend = this.friendsService.getFriend(paramMap.get('friendId'));
      console.log(this.friend);
    });
  }

  customizeFriend() {
    let props: NavigationExtras = {
      queryParams: {
        didId: this.friend.id,
        didName: this.friend.name,
        didGender: this.friend.gender,
        didNote: this.friend.note,
        didImage: this.friend.imageUrl
      }
    }
    this.router.navigate(['/custom-name'], props);
  }

  showWarning(friend: Friend) {
    this.alertDelete(friend);
    this.deleteConfirm(friend);
  }

  async alertDelete(friend: Friend) {
    const popover = await this.popover.create({
      mode: 'ios',
      cssClass: 'warning',
      component: WarningPage,
      componentProps: {
        friend: friend
      }
    });
    return await popover.present();
  }

  async deleteConfirm(friend: Friend) {
    const popover = await this.popover.create({
      mode: 'ios',
      cssClass: '_warning',
      component: Warning2Page,
      componentProps: {
        friend: friend
      }
    });

    popover.onDidDismiss().then(() => {
      this.popover.dismiss();
    })

    return await popover.present();
  }

  discoverApp(app) {
    console.log('Installing..', app);
    // this.friendsService.installApp(app);
  }

  startApp(id) {
    this.friendsService.startApp(id);
  }

  closeApp() {
    appManager.close();
  }
}
