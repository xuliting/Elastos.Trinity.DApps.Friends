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

  private _friend: Friend = {
    id: '',
    name: '',
    gender: '',
    note: '',
    email: '',
    imageUrl: '',
    ApplicationProfileCredential: []
  };
  private _friends: Friend[] = [
    /*  {
      id: '1',
      name: 'Chad Racelis',
      gender: 'male',
      email: 'chad@elastos.com',
      imageUrl: 'https://chadracelis.github.io/resume/img/profile.jpg',
      ApplicationProfileCredential: [
        {
          appName: 'DefaceBook',
          appShortDescription: 'hello hello hello hello hello hello'
        },
        {
          appName: 'DexiFi',
          appShortDescription: 'hello hello hello hello hello hello'
        },
        {
          appName: 'WhatsDApp',
          appShortDescription: 'hello hello hello hello hello hello'
        },
        {
          appName: 'Dalibaba',
          appShortDescription: 'hello hello hello hello hello hello'
        }
      ]
    },
    {
      id: '2',
      name: 'Benjamin Piette',
      gender: 'male',
      email: 'ben@elastos.com',
      imageUrl: 'https://avatars2.githubusercontent.com/u/7567594?s=400&v=4',
      ApplicationProfileCredential: [
        {
          appName: 'Dweeeter',
          appShortDescription: 'hello hello hello hello hello hello'
        },
        {
          appName: 'CashDApp',
          appShortDescription: 'hello hello hello hello hello hello'
        },
        {
          appName: 'DeChat',
          appShortDescription: 'hello hello hello hello hello hello'
        },
        {
          appName: 'Damazon',
          appShortDescription: 'hello hello hello hello hello hello'
        }
      ]
    },
    {
      id: '3',
      name: 'Martin Knight',
      gender: 'male',
      email: 'martin@elastos.com',
      imageUrl: '',
      ApplicationProfileCredential: [
        {
          appName: 'SnapDapp',
          appShortDescription: 'hello hello hello hello hello hello'
        },
        {
          appName: 'DeTube',
          appShortDescription: 'hello hello hello hello hello hello'
        },
        {
          appName: 'DeMessage',
          appShortDescription: 'hello hello hello hello hello hello'
        },
        {
          appName: 'DeBay',
          appShortDescription: 'hello hello hello hello hello hello'
        }
      ]
    }, */
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

  showConfirm = (did) => {
    console.log('Confirm or deny?', did);
    this._DID = did;
    this._friend.id = this._DID.id.didString;
    this._DID.verifiableCredential.map(key => {
      if(key.credentialId === '#name') {
        this._friend.name = key.credentialSubject.name;
      }
      if(key.credentialId === '#gender') {
        this._friend.gender = key.credentialSubject.gender;
      }
    })
    let props: NavigationExtras = {
      queryParams: {
        didId: this._friend.id,
        didName: this._friend.name,
        didGender: this._friend.gender,
        didImage: this._friend.imageUrl
      }
    }
    this.router.navigate(['/friend-confirmation'], props);
  }

  // Add DID if confirmed from friend-confirmation //
  addFriend = () => {
    console.log('Current did', this._DID);
    // this._friends = this._friends.concat(this._friend);
    if(!this._friends.includes(this._friend)) {
      this.storageService.setFriends(this._friends = this._friends.concat(this._friend));
      this.storageService.setDIDs(this._DIDs = this._DIDs.concat(this._DID));
      this.friendAdded(this._friend.name);
      console.log('Friends updated', this._friends);
    } else {
      this.friendAlreadyAdded(this._friend.name);
      console.log('Friend is already added');
    }
  }

  // Delete DID matching profile credentials from friend-details //
  deleteFriend(friend: Friend) {
    console.log('Deleting friend', friend);
    this._DIDs = this._DIDs.filter(did => did.id.didString !== friend.id);
    this._friends = this._friends.filter(_friend => _friend.id !== friend.id);
    console.log('Updated friends', this._friends);
    this.storageService.setDIDs(this._DIDs);
    this.storageService.setFriends(this._friends);
    this.friendDeleted(friend);
  }

  // Change did name & note from custom-name page //
  customDID(customName: string, customNote: string, didId: string) {
    this._friends.map(friend => {
      if(friend.id === didId) {
        friend.name = customName;
        friend.note = customNote;
        this.storageService.setFriends(this._friends);
      }
    });
  }

  // Alerts //
  async friendAdded(didName: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: didName + ' was added',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async friendAlreadyAdded(didName: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: didName + ' is already in your friends',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async friendDenied(didName: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'Denied friend ' + didName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async didResolveErr(err: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'There was an error: ' + err,
      color: "primary",
      duration: 6000.
    });
    toast.present();
  }

  async friendDeleted(friend: Friend) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: friend.name + ' was deleted',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  // Store Friend DID //
  getStoredDIDs = () => {
    this.storageService.getDIDs().then(dids => {
      console.log('Fetching stored DIDs', dids);
      if(dids.length > 0) {
        this._DIDs = this._DIDs.concat(dids);
        console.log('DIDs stored', this._DIDs);
      }
      this.storageService.getFriends().then(friends => {
        console.log('Fetching stored friends', friends);
        if(friends.length > 0) {
          this._friends = this._friends.concat(friends);
        }
      })
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
}
