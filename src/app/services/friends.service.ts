import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PopoverController, ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { StorageService } from 'src/app/services/storage.service';
import { Friend } from '../models/friends.model';
import { DID } from '../models/did.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let didManager: DIDPlugin.DIDManager;

let managerService: any;

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private _DID: DID;
  private _DIDs: DID[] = [];
  private _friends: Friend[] = [
     {
      id: '1',
      name: 'Chad Racelis',
      email: 'chad@elastos.com',
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
        this.friendScanned(ret.params.data);
        // this.showPopover(ret.params.data);
    }
  }

  // Add friend by scanning
  async friendScanned(did) {
    console.log('Scanned', did);
    let didDocument = await this.resolveDIDDocument(did);
    console.log('DID document', didDocument);
    this.showConfirm(didDocument);
  }

  // Direct to friend-confirmation //
  showConfirm = (did) => {
    console.log('Confirm or deny?', did);
    this._DID = did;
    let props: NavigationExtras = {
      queryParams: {
        did: did.verifiableCredential.name = 'Chad Racelis'
      }
    }
    this.router.navigate(['menu/friend-confirmation'], props);
  }

  // Add DID if confirmed from friend-confirmation //
  addFriend = () => {
    let fakeDID = this._DID = {
      clazz: 11,
      id: {
        storeId: 'abc',
        didString: 'did:elastos:fakeDID'
      },
      created: 'october',
      updated: 'december',
      verifiableCredential: {
        id: '123',
        name: 'Chad Racelis',
        email: 'chad@elastos.com',
        imageUrl: 'www.chad.com',
        ApplicationProfileCredential: [{appName: 'app1'}, {appName: 'app2'}, {appName: 'app3'}]
      },
      publicKey: 123,
      authentication: 123,
      authorization: 123,
      expires: 123,
      storeId: 'abc',
    }
    this._friends = this.friends.concat(fakeDID.verifiableCredential);
    this.storageService.setDID(this._DIDs = this._DIDs.concat(fakeDID));
    console.log('Friends updated', this._friends);
    this.friendAdded(this._DID.verifiableCredential.name = 'Chad Racelis');
  }

  // Delete DID matching profile credentials from friends list //
  deleteFriend(friend: Friend) {
    console.log('Deleting friend', friend);
    this._DIDs = this._DIDs.filter(did => did.verifiableCredential !== friend);
    this.storageService.setDID(this._DIDs);
    this.friendDeleted(friend);
    return this._friends = this._friends.filter(_friend => _friend !== friend);
  }

  // Alerts //
  async friendAdded(didName: string) {
    const toast = await this.toastController.create({
      message: didName + ' was added',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async friendDenied(didName: string) {
    const toast = await this.toastController.create({
      message: 'Denied friend ' + didName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async didResolveErr(err: string) {
    const toast = await this.toastController.create({
      message: 'There was an error: ' + err,
      color: "primary",
      duration: 6000.
    });
    toast.present();
  }

  async friendDeleted(friend: Friend) {
    const toast = await this.toastController.create({
      message: friend.name + ' was deleted',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  // Store Friend DID //
  getStoredDIDs = () => {
    this.storageService.getDID().then(res => {
      console.log('Fetching stored DIDs', res);
      if(res.length > 0) {
        this._DIDs = this._DIDs.concat(res);
        res.map(did => {
          this._friends = this._friends.concat(did.verifiableCredential);
        })
        console.log('DIDs stored', this._DIDs, this._friends);
      }
    });
  }

  /*
   * From a DID string, tries to resolve the published DID document from the DID sidechain.
   * That DID document may or may not include BasicProfileCredential types credentials such as "name",
   * "email","telephone", and also ApplicationProfileCredential type credentials that have earlier been registered
   * through "registerapplicationprofile" intents, by the DID app, on request from third party apps. This
   * is where we can retrieve public app profile information for a "user" (DID).
   */
  resolveDIDDocument(didString: DIDPlugin.DIDString): Promise<DIDPlugin.DIDDocument> {
    console.log('DID string', didString);
    return new Promise((resolve, reject)=>{
      didManager.resolveDidDocument(didString, true, (didDocument: DIDPlugin.DIDDocument)=>{
        console.log("DIDDocument resolved for DID "+didString, didDocument);
        resolve(didDocument);
      }, (err: any)=>{
        console.error("DIDDocument resolving error", err);
        this.didResolveErr(err.message);
        // TODO: handle this.
        reject();
      });
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
