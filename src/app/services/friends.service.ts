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

  private _didDoc: DID;
  private _didDocs: DID[] = [];

  private _friend: Friend = {
    id: '',
    name: '',
    gender: '',
    note: '',
    email: '',
    imageUrl: '',
    applicationProfileCredentials: []
  };
  public _friends: Friend[] = [];

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

  /******************************** Initial Render  ********************************/
  init() {
    this.getStoredDIDs();

    // Load app manager only on real device, not in desktop browser - beware: ionic 4 bug with "desktop" or "android"/"ios"
    if (this.platform.platforms().indexOf("cordova") >= 0) {
        console.log("Listening to intent events")
        appManager.setIntentListener(
          this.onReceiveIntent
        );
    }
  }

  getStoredDIDs = () => {
    this.storageService.getDIDs().then(dids => {
      console.log('Fetched stored DIDs', dids);
      if(dids.length > 0) {
        this._didDocs = this._didDocs.concat(dids);
        console.log('DIDs stored', this._didDocs);
      }
      this.storageService.getFriends().then(friends => {
        console.log('Fetched stored friends', friends);
        if(friends.length > 0) {
          this._friends = this._friends.concat(friends);
        }
      })
    });
  }

  onReceiveIntent = (ret) => {
    console.log("Intent received", ret);
    managerService.handledIntentId = ret.intentId;
    switch (ret.action) {
      case "handlescannedcontent_did":
        console.log('handlescannedcontent_did intent', ret);
        this.addFriendByIntent(ret.params.data);
        // this.showPopover(ret.params.data);

      case "addfriend":
        console.log('addfriend intent', ret);
        this.addFriendByIntent(ret.params.data);
    }
  }

  /******************************** Resolve DID  ********************************/
  addFriendByIntent(did) {
    console.log('Received friend by intent', did);
    this.resolveDIDDocument(did);
  }

  /*
   * From a DID string, tries to resolve the published DID document from the DID sidechain.
   * That DID document may or may not include BasicProfileCredential types credentials such as "name",
   * "email","telephone", and also ApplicationProfileCredential type credentials that have earlier been registered
   * through "registerapplicationprofile" intents, by the DID app, on request from third party apps. This
   * is where we can retrieve public app profile information for a "user" (DID).
   */
  resolveDIDDocument(didString: DIDPlugin.DIDString): Promise<Boolean> {
    console.log('DID string', didString);
    return new Promise((resolve, reject) => {
      didManager.resolveDidDocument(didString, true, (didDocument: DIDPlugin.DIDDocument) => {
        console.log("DIDDocument resolved for DID " + didString, didDocument);

        if (didDocument) {
          this.showConfirm(didDocument);
          resolve(true);
        }
        else {
          this.didResolveErr("Sorry, we can't find your friend on chain. Did he make his DID profile public ?");
          resolve(false);
        }
      }, (err: any) => {
        console.error("DIDDocument resolving error", err);
        this.didResolveErr(err.message);
        resolve(false);
      });
    });
  }

  /******************************** Confirm Friend  ********************************/
  showConfirm = (didDocument) => {
    console.log('Confirm or deny?', didDocument);
    this._didDoc = didDocument;
    this._friend.id = this._didDoc.id.didString;
    this._didDoc.verifiableCredential.map(key => {
      if(key.credentialId === '#name') {
        this._friend.name = key.credentialSubject.name;
      }
      if(key.credentialId === '#gender') {
        this._friend.gender = key.credentialSubject.gender;
      }
    });

    // this._friend.applicationProfileCredentials = didDocument.findCredentials(["ApplicationProfileCredential"]);
    // console.log(this._friend.applicationProfileCredentials)

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

  /******************************** Add Friend if Confirmed ********************************/
  addFriend = () => {

    let alertName: string = '';
    if(this._friend.name) {
      alertName = this._friend.name
    } else {
      alertName = this._friend.id;
    }

    console.log('Current did', this._didDoc);
    let targetFriend: Friend = this._friends.find(friend => friend.id === this._friend.id);
    if(targetFriend) {
      this.friendAlreadyAdded(alertName);
      console.log('Friend is already added');
    } else {
      this._didDoc.verifiableCredential.map(key => {
        if(key.type.includes('ApplicationProfileCredential')) {
          this._friend.applicationProfileCredentials = key.credentialSubject;
        }
      });

      this.storageService.setFriends(this._friends = this._friends.concat(this._friend));
      this.storageService.setDIDs(this._didDocs = this._didDocs.concat(this._didDocs));
      this.friendAdded(alertName);
      console.log('Friends updated', this._friends);
    }
  }

  /******************************** Delete Friend ********************************/
  deleteFriend(friend: Friend) {

    let alertName: string = '';
    if(friend.name) {
      alertName = friend.name
    } else {
      alertName = friend.id;
    }

    console.log('Deleting friend', friend);
    this._didDocs = this._didDocs.filter(did => did.id.didString !== friend.id);
    this._friends = this._friends.filter(_friend => _friend.id !== friend.id);
    console.log('Updated friends', this._friends);
    this.storageService.setDIDs(this._didDocs);
    this.storageService.setFriends(this._friends);
    this.friendDeleted(alertName);
  }

  /******************************** Customize friend ********************************/
  customDID(customName: string, customNote: string, didId: string) {
    this._friends.map(friend => {
      if(friend.id === didId) {
        friend.name = customName;
        friend.note = customNote;
        this.storageService.setFriends(this._friends);
      }
    });
  }

  /******************************** Misc ********************************/
  public isMale(gender: string) {
    // undefined gender = consider as male by default.
    return (!gender || gender === 'male');
  }

  async appIsInstalled(appPackageId: string): Promise<boolean> {
    return new Promise((resolve, reject)=>{
      appManager.getAppInfo(appPackageId, (appInfo)=>{
        if (appInfo) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      }, (err)=>{
        console.warn(err);
        resolve(false);
      });
    });
  }

  startApp(id) {
    appManager.start(id);
  }

  /******************************** Alerts ********************************/
  async friendAdded(name: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: name + ' was added',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async friendAlreadyAdded(name: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: name + ' is already in your friends',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async friendDenied(name: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'Denied friend ' + name,
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

  async friendDeleted(name: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: name + ' was deleted',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }
}
