
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PopoverController, ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

declare let appManager: AppManagerPlugin.AppManager;
let managerService: any;

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  _friends: any = [
     {
      id: '1',
      name: 'Chad Racelis',
      bio: 'Hi I\'m Chad, the DApp Dev',
      imageUrl: 'https://chadracelis.github.io/resume/img/profile.jpg',
      appList: [
        {
          appName: 'DefaceBook'
        },
        {
          appName: 'DexiFi'
        },
        {
          appName: 'WhatsDApp'
        },
        {
          appName: 'Dalibaba'
        }
      ]
    },
    {
      id: '2',
      name: 'Benjamin Piette',
      bio: 'Hi I\'m Ben, the Tech Lead',
      imageUrl: 'https://avatars2.githubusercontent.com/u/7567594?s=400&v=4',
      appList: [
        {
          appName: 'Dweeeter'
        },
        {
          appName: 'CashDApp'
        },
        {
          appName: 'DeChat'
        },
        {
          appName: 'Damazon'
        }
      ]
    },
    {
      id: '3',
      name: 'Martin Knight',
      bio: 'Hi I\'m Martin, the Designer',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/10/07/14/50/knight-2826704_1280.jpg',
      appList: [
        {
          appName: 'SnapDapp'
        },
        {
          appName: 'DeTube'
        },
        {
          appName: 'DeMessage'
        },
        {
          appName: 'DeBay'
        }
      ]
    },
  ];

  get friends() {
    return [...this._friends];
  }

  getFriend(id: string) {
    return {...this._friends.find(friend => friend.id === id)};
  }

  constructor(
    private platform: Platform,
    private popover: PopoverController,
    private router: Router,
    public toastController: ToastController,
  ) {
    managerService = this;
  }

  init() {
    console.log("AppmanagerService init");

    // Load app manager only on real device, not in desktop browser - beware: ionic 4 bug with "desktop" or "android"/"ios"
    if (this.platform.platforms().indexOf("cordova") >= 0) {
        console.log("Listening to intent events")
        appManager.setIntentListener(
          this.onReceiveIntent
        );
    }
  }

  onReceiveIntent = (ret) => {
    console.log("Intent received", ret);
    managerService.handledIntentId = ret.intentId;
    switch (ret.action) {
      case "handlescannedcontent_did":
        console.log('Incoming friend requests', ret);
        this.showConfirm(ret.params.data);
        // this.showPopover(ret.params.data);
    }
  }

  showConfirm(did) {
    let props: NavigationExtras = {
      queryParams: {
        did: did
      }
    }
    this.router.navigate(['menu/friend-confirmation'], props);
  }

  addFriend = (did) => {
    this._friends.push(did);
    console.log('Friends updated', this._friends);
    this.friendAdded(did);
  }

  async friendAdded(did) {
    const toast = await this.toastController.create({
      message: did + ' was added',
      duration: 2000
    });
    toast.present();
  }

  async friendDenied(did) {
    const toast = await this.toastController.create({
      message: 'Denied friend ' + did,
      duration: 2000
    });
    toast.present();
  }

  /*
  async showPopover(did) {
    const _popover = await this.popover.create({
      component: AddFriendPage,
      componentProps: {
        _did: did
      },
      translucent: true
    });
    return await _popover.present();
  }
  */


}
