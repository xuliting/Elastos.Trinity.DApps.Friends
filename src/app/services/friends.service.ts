import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PopoverController, ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { StorageService } from 'src/app/services/storage.service';
import { Friend } from '../models/friends.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let didManager: DIDPlugin.DIDManager;

let managerService: any;

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private _friends: Friend[] = [
     {
      id: '1',
      name: 'Chad Racelis',
      email: 'chad@elastos.com',
      bio: 'Hi I\'m Chad, the DApp Dev',
      imageUrl: 'https://chadracelis.github.io/resume/img/profile.jpg',
      ApplicationProfileCredential: [
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
      email: 'ben@elastos.com',
      bio: 'Hi I\'m Ben, the Tech Lead',
      imageUrl: 'https://avatars2.githubusercontent.com/u/7567594?s=400&v=4',
      ApplicationProfileCredential: [
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
      email: 'martin@elastos.com',
      bio: 'Hi I\'m Martin, the Designer',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/10/07/14/50/knight-2826704_1280.jpg',
      ApplicationProfileCredential: [
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
    private router: Router,
    private http: HttpClient,
    private popover: PopoverController,
    public toastController: ToastController,
    private storageService: StorageService,
  ) {
    managerService = this;
  }

  // Initial render //
  init() {
    this.getStoredDIDs();
    console.log("AppmanagerService init");

    // Load app manager only on real device, not in desktop browser - beware: ionic 4 bug with "desktop" or "android"/"ios"
    if (this.platform.platforms().indexOf("cordova") >= 0) {
        console.log("Listening to intent events")
        appManager.setIntentListener(
          this.onReceiveIntent
        );
    }
  }

  // Listen to intent //
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

  // Direct to friend-confirmation //
  showConfirm(did) {
    let props: NavigationExtras = {
      queryParams: {
        did: did
      }
    }
    this.router.navigate(['menu/friend-confirmation'], props);
  }

  // Add DID if confirmed from friend-confirmation //
  addFriend = (did) => {
    this._friends.push(did);
    this.storageService.setDID(did);
    console.log('Friends updated', this._friends);
    this.friendAdded(did);
  }

  // Delete DID id deleted from friends list //
  deleteFriend = (did) => {
    console.log('Deleting friend', did);
  }

  // Confirmation alerts //
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

  // Store Friend DID //
  getStoredDIDs = () => {
    this.storageService.getDID().then(data => {
      console.log('Fetching stored DIDs', data);
      this._friends = this._friends.concat(data);
    });
  }

  // Call install app from friend-details //
 /*  async installApp(dapp) {
    // Download the file
    const epkPath = await this.downloadDapp(dapp);
    console.log("EPK file downloaded and saved to " + epkPath);

    // Ask the app installer to install the DApp
    return appManager.sendIntent(
      'appinstall',
      { url: epkPath, dappStoreServerAppId: dapp._id },
      () => {
        console.log('App installed');
        return true;
      }, (err) => {
        console.log('App install failed', err)
        return false;
      }
    );
  }

  downloadDapp(app) {
    console.log("App download starting...");

    return new Promise((resolve, reject) => {
      // Download EPK file as blob
      this.http.get('https://dapp-store.elastos.org/apps/'+app._id+'/download', {
        responseType: 'arraybuffer'} ).subscribe(async response => {
        console.log("Downloaded", response);
        let blob = new Blob([response], { type: "application/octet-stream" });
        console.log("Blob", blob);

        // Save to a temporary location
        let filePath = await this._savedDownloadedBlobToTempLocation(blob);

        resolve(filePath);
      });
    });
  }

  _savedDownloadedBlobToTempLocation(blob) {
    let fileName = "appinstall.epk"
    console.log('Cordova file directory' + cordova.file.dataDirectory);

    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (dirEntry: DirectoryEntry) => {
          dirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
            console.log("Downloaded file entry", fileEntry);
            fileEntry.createWriter((fileWriter) => {
              fileWriter.write(blob);
              resolve("trinity:///data/"+fileName);
            }, (err) => {
              console.error("createWriter ERROR - "+JSON.stringify(err));
              reject(err);
            });
          }, (err) => {
            console.error("getFile ERROR - "+JSON.stringify(err));
            reject(err);
          });
      }, (err) => {
        console.error("resolveLocalFileSystemURL ERROR - "+JSON.stringify(err));
        reject(err);
      });
    });
  } */

    // Another option for friend-confirmation //
   /* async showPopover(did) {
    const _popover = await this.popover.create({
      component: FriendConfirmationPage,
      componentProps: {
        _did: did
      },
      translucent: true
    });
    return await _popover.present();
  } */
}
