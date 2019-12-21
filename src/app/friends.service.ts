
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;
let managerService = null;


@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  _friends: any = [
     {
      id: '1',
      name: 'Chad Racelis',
      bio: 'Hi I\'m Chad, the DApp Dev',
      imageUrl: 'https://scontent.fzty1-2.fna.fbcdn.net/v/t1.0-9/36755312_10155874906223877_271971953546362880_n.jpg?_nc_cat=101&_nc_oc=AQnLF6QYXEJlb-5_cd3MjEoJ469zNDGkmS3xDp-S8NJ2RI9Lm8ruHr-eHd3-A_S75P6-OGLjUhYoSo_AQDnngtwU&_nc_ht=scontent.fzty1-2.fna&oh=b294667cc475647f68d0e2c507cf05af&oe=5E3FB7B0',
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

  onReceiveIntent(ret) {
    console.log("Intent received", ret);
    managerService.handledIntentId = ret.intentId;
    switch (ret.action) {
      case "handlescannedcontent_did":
        console.log('Incoming friend requests', ret);
        this.addFriend(ret.params.data);
    }
  }

  addFriend(friend) {
    this._friends.push(friend);
  }
}
