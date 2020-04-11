import { Component, OnInit } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';
import { PopoverController } from '@ionic/angular';
import { NoFriendsPage } from './no-friends/no-friends.page';
import { TranslateService } from '@ngx-translate/core';
import { OptionsComponent } from 'src/app/components/options/options.component';
import { NavigationExtras, Router } from '@angular/router';
import { Friend } from 'src/app/models/friends.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  public friendsLoaded = true;
  public favActive = true;

  constructor(
    private popover: PopoverController,
    private router: Router,
    public translate: TranslateService,
    public friendsService: FriendsService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant('contacts'));
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
    // this.checkForFriends();
  }

  firstContact(): boolean {
    if (
      this.friendsService._friends.length === 1 &&
      this.friendsService._friends[0].id === 'did:elastos'
    ) {
      return true;
    } else {
      return false;
    }
  }

  openScanner() {
    appManager.sendIntent("scanqrcode", {}, {}, (res) => {
      console.log("Got scan result", res);
      this.friendsService.addFriendByIntent(res.result.scannedContent);
    }, (err: any)=>{
      console.error(err);
    })
  }

  customizeFriend(friend: Friend) {
    this.friendsService.inProfileView = false;
    let props: NavigationExtras = {
      queryParams: {
        didId: friend.id,
        didName: friend.name,
        didGender: friend.gender,
        didNote: friend.note,
        didImage: friend.imageUrl
      }
    }
    this.router.navigate(['/custom-name'], props);
  }

  async showOptions(ev: any, friend: Friend) {
    const popover = await this.popover.create({
      mode: 'ios',
      component: OptionsComponent,
      cssClass: 'options',
      event: ev,
      componentProps: {
        friend: friend
      },
      translucent: false
    });
    return await popover.present();
  }

  getFavorites(): Friend[] {
    return this.friendsService._friends.filter((friend) => friend.isFav === true);
  }

  /**************************************OLD DESIGN*********************************************************/
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
