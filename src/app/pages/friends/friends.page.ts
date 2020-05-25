import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IonSlides, Events } from '@ionic/angular';

import { FriendsService } from 'src/app/services/friends.service';
import { ThemeService } from 'src/app/services/theme.service';

import { Friend } from 'src/app/models/friends.model';
import { Router, ActivatedRoute } from '@angular/router';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  @ViewChild('slider', {static: false}) slider: IonSlides;

  public favActive = true;

  slideOpts = {
    initialSlide: 0,
    speed: 200,
    zoom: true,
    centeredSlides: true,
    slidesPerView: 3.5
  };

  constructor(
    public translate: TranslateService,
    public theme: ThemeService,
    private route: ActivatedRoute,
    public friendsService: FriendsService,
    private router: Router,
    private events: Events
  ) { 
  }

  ngOnInit() {
    // Handle special commands such as "add a friend"
    this.events.subscribe("handleaddfriend", (params)=>{
      let friendToAdd = params.addFriend;
      if (friendToAdd) {
        this.friendsService.addFriendByIntent(friendToAdd);
      }
    })
  }

  ionViewWillEnter() {
    console.log("Friends list screen will enter");
    titleBarManager.setTitle(this.translate.instant('contacts'));

    appManager.setVisible("show");
  }

  ionViewDidEnter() {
    console.log("Friends list screen did enter");
    this.getActiveSlide();
  }

  async getActiveSlide() {
    await this.friendsService.getStoredDIDs().then(() => {
      if(this.friendsService._friends.length > 0) {
        this.slider.getActiveIndex().then((index) => {
          this.friendsService.activeSlide = this.friendsService._friends[index];
          console.log('Active slide', this.friendsService.activeSlide);
        });
      } else {
        return;
      }
    });
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

  getFavorites(): Friend[] {
    return this.friendsService._friends.filter((friend) => friend.isFav === true);
  }

  slideChanged() {
    this.slider.getActiveIndex().then((index) => {
      this.friendsService.activeSlide = this.friendsService._friends[index];
      console.log(this.friendsService.activeSlide);
    });
  }
}
