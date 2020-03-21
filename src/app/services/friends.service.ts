import { Injectable, NgZone } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

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
    id: null,
    name: null,
    gender: null,
    note: null,
    nickname: null,
    country: null,
    birthDate: null,
    telephone: null,
    email: null,
    description: null,
    website: null,
    twitter: null,
    facebook: null,
    telegram: null,
    imageUrl: null,
    applicationProfileCredentials: [],
    isPicked: false
  };

  public _friends: Friend[] = [];
  public filteredFriends: Friend[] = [];

  getFriend(id: string) {
    return {...this._friends.find(friend => friend.id === id)};
  }

  constructor(
    private platform: Platform,
    private router: Router,
    private alertController: AlertController,
    public toastController: ToastController,
    public zone: NgZone,
    private storageService: StorageService,
    private navController: NavController
  ) {
    managerService = this;
  }

  /******************************** Initial Render  ********************************/
  init() {
    this.getStoredDIDs();

    // Load app manager only on real device, not in desktop browser - beware: ionic 4 bug with "desktop" or "android"/"ios"
    if (this.platform.platforms().indexOf("cordova") >= 0) {
        console.log("Listening to intent events")
        appManager.setListener((msg)=>{
          this.onMessageReceived(msg);
        })
        appManager.setIntentListener(
          this.onReceiveIntent
        );
    }
  }

  getStoredDIDs = () => {
    return new Promise((resolve, reject) => {
      this.storageService.getDIDs().then(dids => {
        console.log('Fetched stored DIDs', dids);
        if(dids && dids.length > 0) {
          this._didDocs = dids;
          console.log('DIDs stored', this._didDocs);
        }
        else {
          console.log("Empty DID list received");
        }
      });

      this.storageService.getFriends().then(friends => {
        console.log('Fetched stored friends', friends);
        if(friends && friends.length > 0) {
          this._friends = friends;
        }
        else {
          console.log("Empty friends list");
         // this.router.navigate(['/addFriend']);
        }
        resolve(friends || this._friends);
      });
    });
  }

  onMessageReceived(msg: AppManagerPlugin.ReceivedMessage) {
    if (msg.message == "navback") {
      this.navController.back();
    }
  }

  onReceiveIntent = (ret) => {
    console.log("Intent received", ret);
    managerService.handledIntentId = ret.intentId;
    switch (ret.action) {
      case "handlescannedcontent_did":
        console.log('handlescannedcontent_did intent', ret);
        this.addFriendByIntent(ret.params.data);

      case "addfriend":
        console.log('addfriend intent', ret);
        this.addFriendByIntent(ret.params.data);

      case "pickfriend":
        console.log('pickfriend intent', ret);
        if(ret.params.filter) {
          console.log(ret.params.filter)
          this.getFilteredFriends(ret);
        } else {
          this.getFriends();
        }
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

    // Reset state of current friend
    this._friend = {
      id: null,
      name: null,
      gender: null,
      note: null,
      nickname: null,
      country: null,
      birthDate: null,
      telephone: null,
      email: null,
      description: null,
      website: null,
      twitter: null,
      facebook: null,
      telegram: null,
      imageUrl: null,
      applicationProfileCredentials: [],
      isPicked: false
    };

    console.log('Confirm or deny?', didDocument);
    this._didDoc = didDocument;
    this._friend.id = this._didDoc.id.didString;
    this._didDoc.verifiableCredential.map(key => {
      if(key.credentialSubject.hasOwnProperty('name')) {
        this._friend.name = key.credentialSubject.name;
      }
      if(key.credentialSubject.hasOwnProperty('gender')) {
        this._friend.gender = key.credentialSubject.gender;
      }
      if(key.credentialSubject.hasOwnProperty('nickname')) {
        this._friend.nickname = key.credentialSubject.nickname;
      }
      if(key.credentialSubject.hasOwnProperty('country')) {
        this._friend.country = key.credentialSubject.country;
      }
      if(key.credentialSubject.hasOwnProperty('birthDate')) {
        this._friend.birthDate = key.credentialSubject.birthDate;
      }
      if(key.credentialSubject.hasOwnProperty('telephone')) {
        this._friend.telephone = key.credentialSubject.telephone;
      }
      if(key.credentialSubject.hasOwnProperty('email')) {
        this._friend.email = key.credentialSubject.email;
      }
      if(key.credentialSubject.hasOwnProperty('description')) {
        this._friend.description = key.credentialSubject.description;
      }
      if(key.credentialSubject.hasOwnProperty('website')) {
        this._friend.website = key.credentialSubject.website;
      }
      if(key.credentialSubject.hasOwnProperty('twitter')) {
        this._friend.twitter = key.credentialSubject.twitter;
      }
      if(key.credentialSubject.hasOwnProperty('facebook')) {
        this._friend.facebook = key.credentialSubject.facebook;
      }
      if(key.credentialSubject.hasOwnProperty('telegram')) {
        this._friend.telegram = key.credentialSubject.telegram;
      }
      if(key.credentialSubject.hasOwnProperty('apppackage')) {
        this._friend.applicationProfileCredentials.push({
          action: key.credentialSubject.action,
          apppackage: key.credentialSubject.apppackage,
          apptype: key.credentialSubject.apptype,
        });
      }
    });

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
      this.genericToast(alertName + ' is already added');
      console.log('Friend is already added');
    } else {
      this.storageService.setFriends(this._friends = this._friends.concat(this._friend));
      this.storageService.setDIDs(this._didDocs = this._didDocs.concat(this._didDoc));
      this.genericToast(alertName + ' was added');
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
    this.genericToast(alertName + ' was deleted');
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

  /******************************** Pick Friend Intent  ********************************/

  // Wait for storage before handling intent
  async getFriends() {
    await this.getStoredDIDs().then((friends) => {
      console.log('My friends', friends);
      if(this._friends.length > 0) {
          this.router.navigate(['/pick-friend']);
      } else {
        this.alertNoFriends('You don\'t have any friends to invite!');
      }
    });
  }

  async getFilteredFriends(ret) {
    await this.getStoredDIDs().then((friends) => {
      console.log('My friends', friends);

      if(this._friends.length > 0) {
        if(ret.params.filter.credentialType === "apppackage") {
          console.log('Intent requesting friends with app', ret.from);
          this.filteredFriends = [];
          this._friends.map((friend) => {
            friend.applicationProfileCredentials.map((appCreds) => {
              if(appCreds.apppackage === ret.from) {
                this.filteredFriends.push(friend);
              }
              // For Testing Purposes
              /* if(appCreds.apppackage === 'org.elastos.trinity.dapp.diddemo') {
                this.filteredFriends.push(friend);
              } */
            });
          });

          if(this.filteredFriends.length > 0) {
            let props: NavigationExtras = {
              queryParams: {
                friendsFiltered: true
              }
            }
            this.router.navigate(['/pick-friend'], props);
          } else {
            this.alertNoFriends('You don\'t have any friends with this app!');
          }
        }
      } else {
        this.alertNoFriends('You don\'t have any friends to invite!');
      }
    });
  }

  // Send intent response after selecting friends from pick-friend pg
  inviteFriends() {
    let dids = [];
    this._didDocs.map((did) => {
      this._friends.map((friend) => {
        if(did.id.didString === friend.id && friend.isPicked) {
          dids.push(did);
          friend.isPicked = false;
        }
      });
    });

    console.log('Invited friends', dids);
    this.sendIntentRes(dids);
  }

  inviteFilteredFriends() {
    let dids = [];
    this._didDocs.map((did) => {
      this.filteredFriends.map((friend) => {
        if(did.id.didString === friend.id && friend.isPicked) {
          dids.push(did);
          friend.isPicked = false;
        }
      });
    });

    console.log('Invited friends', dids);
    this.sendIntentRes(dids);
  }

  sendIntentRes(dids) {
    if(dids.length > 0) {
      appManager.sendIntentResponse(
        "pickfriend",
        { document: dids },
        managerService.handledIntentId,
        (res: any) => {},
        (err: any) => {}
      );
      appManager.close();
    } else {
      this.genericToast('Please select some friends before inviting');
    }
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
  async genericToast(msg) {
    const toast = await this.toastController.create({
      mode: 'ios',
      header: msg,
      color: "light",
      duration: 2000
    });
    toast.present();
  }

  async didResolveErr(err: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      header: 'There was an error',
      message: err,
      color: "light",
      duration: 6000.
    });
    toast.present();
  }

  async alertNoFriends(msg) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: msg,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            appManager.close();
          }
        }
      ]
    });
    alert.present();
  }
}
