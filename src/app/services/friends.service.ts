import { Injectable, NgZone } from '@angular/core';
import { Platform, AlertController, NavController, PopoverController, Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { StorageService } from 'src/app/services/storage.service';
import { ThemeService } from './theme.service';

import { Friend } from '../models/friends.model';
import { DID } from '../models/did.model';

import { DeleteComponent } from '../components/delete/delete.component';
import { OptionsComponent } from '../components/options/options.component';

declare let appManager: AppManagerPlugin.AppManager;
declare let didManager: DIDPlugin.DIDManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

let managerService: any;

enum MessageType {
    INTERNAL = 1,
    IN_RETURN = 2,
    IN_REFRESH = 3,

    EXTERNAL = 11,
    EX_LAUNCHER = 12,
    EX_INSTALL = 13,
    EX_RETURN = 14,
};

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private _didDoc: DID;
  private _didDocs: DID[] = [];

  public _friend: Friend = {
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
    isPicked: false,
    isFav: false
  };

  public _friends: Friend[] = [];
  public filteredFriends: Friend[] = [];

  public activeSlide: Friend;
  public letters: string[] = [];

  public firstVisit = false;
  public friendsChecked = false;
  public addingFriend = false;
  public popup = false;

  getFriend(id: string) {
    return {...this._friends.find(friend => friend.id === id)};
  }

  constructor(
    private platform: Platform,
    private router: Router,
    private navController: NavController,
    private alertController: AlertController,
    private popoverController: PopoverController,
    public toastController: ToastController,
    public zone: NgZone,
    private clipboard: Clipboard,
    public translate: TranslateService,
    private theme: ThemeService,
    private storageService: StorageService,
    private events: Events
  ) {
    managerService = this;
  }

  /******************************** Initial Render  ********************************/
  async init() {
    this.getVisit();
    this.getLanguage();
    await this.getStoredDIDs();
    this.theme.getTheme();

    appManager.hasPendingIntent((intent: Boolean) => {
      if(intent) {
        console.log('Pending intent', intent);
        appManager.setIntentListener(this.onReceiveIntent);
      } else {
        console.log('No pending intent, routing to home page', intent);
        this.navController.navigateRoot("/friends");
      }
    });

    if (this.platform.platforms().indexOf("cordova") >= 0) {
      console.log("Listening to intent events");
      appManager.setListener((msg) => {
        this.onMessageReceived(msg);
      });
      appManager.setIntentListener(
        this.onReceiveIntent
      );
      titleBarManager.addOnItemClickedListener((menuIcon) => {
        if (menuIcon.key == "back") {
            this.navController.back();
        }
        this.onTitleBarItemClicked(menuIcon);
      });
    }
  }

  onTitleBarItemClicked(icon: TitleBarPlugin.TitleBarIcon) {
    switch (icon.key) {
      case 'add':
        this.router.navigate(['/add']);
        break;
      case 'scan':
        this.scanDID();
    }
  }

  setTitleBarBackKeyShown(show: boolean) {
    if (show) {
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, {
            key: "back",
            iconPath: TitleBarPlugin.BuiltInIcon.BACK
        });
    }
    else {
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, null);
    }
  }

  getVisit() {
    this.storageService.getVisit().then(data => {
      if (data && data === true) {
        console.log('First visit?', this.firstVisit);
      } else {
        this._friends.push({
          id: 'did:elastos',
          name: 'My First Contact',
          gender: null,
          note: 'Hi! Click me to see my profile and see what Capsules I have',
          nickname: null,
          country: null,
          birthDate: 'December 2017',
          telephone: null,
          email: 'contact@elastos.org',
          description: null,
          website: 'https://www.elastos.org',
          twitter: '@Elastos_org',
          facebook: null,
          telegram: null,
          imageUrl: null,
          applicationProfileCredentials: [
            {
              action: "This is a basic demo which demonstrates the identity service",
              apppackage: "org.elastos.trinity.dapp.diddemo",
              apptype: "elastosbrowser"
            },
            {
              action: "This is a basic demo which demonstrates P2P networking",
              apppackage: "org.elastos.trinity.dapp.carrierdemo",
              apptype: "elastosbrowser"
            },
            {
              action: "Learn elastOS the fun way! Quizzes, chats, guilds, level up & earn points!",
              apppackage: "tech.tuum.academy",
              apptype: "elastosbrowser"
            },
            {
              action: "Let your voice be heard and vote for your CRC candidate!",
              apppackage: "org.elastos.trinity.dapp.crcvoting",
              apptype: "elastosbrowser"
            },
            {
              action: "Vote for your favorite Supernodes and earn ELA along the way",
              apppackage: "org.elastos.trinity.dapp.dposvoting",
              apptype: "elastosbrowser"
            },
            {
              action: "Check for any block, transaction or address ever created on Elastos!",
              apppackage: "org.elastos.trinity.dapp.blockchain",
              apptype: "elastosbrowser"
            },
            {
              action: "Show some love to your friends by giving them ELA!",
              apppackage: "org.elastos.trinity.dapp.redpacket",
              apptype: "elastosbrowser"
            },
          ],
          isPicked: null,
          isFav: true
        });
        this.storageService.setVisit(true);
        this.storageService.setFriends(this._friends);
      }
    });
  }

  getLanguage() {
    appManager.getLocale(
      (defaultLang, currentLang, systemLang) => {
        this.setCurLang(currentLang);
      }
    );
  }

  setCurLang(lang: string) {
    console.log("Setting current language to "+ lang);

    this.zone.run(()=>{
      this.translate.use(lang);
    });
  }

  getStoredDIDs = () => {
    return new Promise((resolve, reject) => {
      this.storageService.getDIDs().then(dids => {
        console.log('Fetched stored DIDs', dids);
        if(dids && dids.length > 0) {
          this._didDocs = dids;
        } else {
          console.log("Empty DID list received");
        }
      });

      this.storageService.getFriends().then(friends => {
        console.log('Fetched stored friends', friends);
        if(friends && friends.length > 0) {
          this._friends = friends;
          this.sortContacts();

          if(!this.friendsChecked) {
            this.friendsChecked = true;
            this._friends.forEach((friend) => {
              friend.id !== 'did:elastos' ? this.resolveDIDDocument(friend.id, true) : null;
            });
          }
        } else {
          console.log("Empty friends list");
        }
        resolve(friends || this._friends);
      });
    });
  }

  onMessageReceived(msg: AppManagerPlugin.ReceivedMessage) {
    var params: any = msg.message;
    if (typeof (params) == "string") {
      try {
          params = JSON.parse(params);
      } catch (e) {
          console.log('Params are not JSON format: ', params);
      }
    }
    switch (msg.type) {
      case MessageType.IN_REFRESH:
        if (params.action === "currentLocaleChanged") {
            this.setCurLang(params.data);
        }
        if(params.action === 'preferenceChanged' && params.data.key === "ui.darkmode") {
          this.zone.run(() => {
            console.log('Dark Mode toggled');
            this.theme.setTheme(params.data.value);
          });
        }
        break;
    }
  }

  onReceiveIntent = (ret) => {
    console.log("Intent received", ret);
    managerService.handledIntentId = ret.intentId;

    switch (ret.action) {
      case "handlescannedcontent_did":
        console.log('handlescannedcontent_did intent', ret);
        this.zone.run(async () => {
          await this.navigateToFriendsList({
            addFriend: ret.params.data
          });
        });
        this.sendEmptyIntentRes();
        break;
      case "addfriend":
        console.log('addfriend intent', ret);
        this.zone.run(async () => {
          await this.navigateToFriendsList({
            addFriend: ret.params.did
          });
        });
        break;
      case "viewfriend":
        console.log('viewfriend intent', ret);
        this.zone.run(() => {
          this.viewFriend(ret.params.did);
        });
        break;
      case "share":
        console.log('share intent', ret);
        this.zone.run(() => {
          this.getFriends(false, 'share');
        });
        break;
      case "pickfriend":
        console.log('pickfriend intent', ret);
        this.zone.run(() => {
          let params = ret.params;
          // Single Invite, No Filter
          if(
            !params.hasOwnProperty('singleSelection') && !params.hasOwnProperty('filter') ||
            params.hasOwnProperty('singleSelection') && params.singleSelection === true && !params.hasOwnProperty('filter'))
          {
            console.log('pickfriend intent is single selection without filter');
            this.getFriends(true, 'pickfriend');
          }
          // Multiple Invite, No Filter
          if(params.hasOwnProperty('singleSelection') && params.singleSelection === false && !params.hasOwnProperty('filter')) {
            console.log('pickfriend intent is multiple selection without filter');
            this.getFriends(false, 'pickfriend');
          }
          // Single Invite, With Filter
          if(
            !params.hasOwnProperty('singleSelection') && params.hasOwnProperty('filter') && params.filter.credentialType === 'ApplicationProfileCredential' ||
            params.hasOwnProperty('singleSelection') && params.singleSelection === true && params.hasOwnProperty('filter') && params.filter.credentialType === 'ApplicationProfileCredential')
          {
            console.log('pickfriend intent is single selection and filtered to ApplicationProfileCredential');
            this.getFilteredFriends(true, ret);
          }
          // Multiple Invite, With Filter
          if(params.hasOwnProperty('singleSelection') && params.singleSelection === false && params.hasOwnProperty('filter') && params.filter.credentialType === 'ApplicationProfileCredential') {
            console.log('pickfriend intent is multiple selection and filtered to ApplicationProfileCredential');
            this.getFilteredFriends(false, ret);
          }
        });

        break;
    }
  }

  private async navigateToFriendsList(params: any) {
    console.log("Navigating to friends list screen");
    await this.navController.navigateRoot('friends');
    this.events.publish("handleaddfriend", params);
  }

  /******************************** Resolve DID  ********************************/
  addFriendByIntent(did: string) {
    console.log('Received friend by intent', did);
    this.resolveDIDDocument(did, false);
  }

  /*
   * From a DID string, tries to resolve the published DID document from the DID sidechain.
   * That DID document may or may not include BasicProfileCredential types credentials such as "name",
   * "email","telephone", and also ApplicationProfileCredential type credentials that have earlier been registered
   * through "registerapplicationprofile" intents, by the DID app, on request from third party apps. This
   * is where we can retrieve public app profile information for a "user" (DID).
   */
  resolveDIDDocument(didString: DIDPlugin.DIDString, updatingFriends: boolean): Promise<Boolean> {
    console.log('Resolving DID document for DID string ', didString, 'Updating friends='+updatingFriends);
    return new Promise((resolve, reject) => {
      didManager.resolveDidDocument(didString, true, (didDocument: DIDPlugin.DIDDocument) => {
        console.log("DIDDocument resolved for DID " + didString, didDocument);

        if (didDocument && !updatingFriends) {
          this.showConfirm(didDocument);
          resolve(true);
        }
        if (didDocument && updatingFriends) {
          this.updateFriends(didDocument);
        }
        else if (!didDocument && updatingFriends) {
          return;
        } else {
          this.didResolveErr("Sorry, we can't find your friend on chain. Did he make his DID profile public ?");
          resolve(false);
        }
      }, (err: any) => {
        console.error("DIDDocument resolving error", err);
        this.router.navigate(['friends']);
        this.didResolveErr(err.message);
        resolve(false);
      });
    });
  }

  /*************** Check friends list on render for any changes *******************/
  updateFriends(didDocument) {
    this._didDocs.map((didDoc) => {
      if(didDoc.id.didString === didDocument.id.didString) {
        didDoc = didDocument
      }
    });

    this._friends.map((friend) => {
      if(friend.id === didDocument.id.didString) {
        console.log('Checking friend for any changes', friend);

        didDocument.verifiableCredential.map(key => {
          if(key.credentialSubject.hasOwnProperty('gender')) {
            friend.gender = key.credentialSubject.gender;
          }
          if(key.credentialSubject.hasOwnProperty('nickname')) {
            friend.nickname = key.credentialSubject.nickname;
          }
          if(key.credentialSubject.hasOwnProperty('country')) {
            friend.country = key.credentialSubject.country;
          }
          if(key.credentialSubject.hasOwnProperty('birthDate')) {
            friend.birthDate = key.credentialSubject.birthDate;
          }
          if(key.credentialSubject.hasOwnProperty('telephone')) {
            friend.telephone = key.credentialSubject.telephone;
          }
          if(key.credentialSubject.hasOwnProperty('email')) {
            friend.email = key.credentialSubject.email;
          }
          if(key.credentialSubject.hasOwnProperty('description')) {
            friend.description = key.credentialSubject.description;
          }
          if(key.credentialSubject.hasOwnProperty('website')) {
            friend.website = key.credentialSubject.website;
          }
          if(key.credentialSubject.hasOwnProperty('twitter')) {
            friend.twitter = key.credentialSubject.twitter;
          }
          if(key.credentialSubject.hasOwnProperty('facebook')) {
            friend.facebook = key.credentialSubject.facebook;
          }
          if(key.credentialSubject.hasOwnProperty('telegram')) {
            friend.telegram = key.credentialSubject.telegram;
          }
          if(key.credentialSubject.hasOwnProperty('apppackage')) {
            friend.applicationProfileCredentials = [];
            friend.applicationProfileCredentials.push({
              action: key.credentialSubject.action,
              apppackage: key.credentialSubject.apppackage,
              apptype: key.credentialSubject.apptype,
            });
          }
        });
      }
    });

    this.storageService.setDIDs(this._didDocs);
    this.storageService.setFriends(this._friends);
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
      isPicked: false,
      isFav: false
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
        id: this._friend.id,
        name: this._friend.name,
        gender: this._friend.gender,
        image: this._friend.imageUrl
      }
    }
    this.router.navigate(['/confirm'], props);
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
  async deleteWarning(friend: Friend) {
    this.popup = true;
    const popover = await this.popoverController.create({
      mode: 'ios',
      cssClass: 'delete',
      component: DeleteComponent,
      componentProps: {
        friend: friend
      }
    });
    popover.onWillDismiss().then(() => {
      this.popup = false;
    });
    return await popover.present();
  }

  deleteFriend(friend: Friend) {
    let alertName: string = '';
    if(friend.name) {
      alertName = friend.name
    } else {
      alertName = friend.id;
    }

    /**
    * If contact was deleted from slides, change active slide to next index of array
    * If contact of next index doesn't exist, change active slide to previous index
    **/
    let replacedSlide = this._friends[this._friends.indexOf(friend) + 1];
    if(replacedSlide) {
      this.activeSlide = replacedSlide
    } else {
      this.activeSlide = this._friends[this._friends.indexOf(friend) - 1];
    }
    console.log('Active slide after deletion', this.activeSlide);

    console.log('Deleting friend', friend);
    this._didDocs = this._didDocs.filter(did => did.id.didString !== friend.id);
    this._friends = this._friends.filter(_friend => _friend.id !== friend.id);

    console.log('Updated friends', this._friends);
    this.storageService.setDIDs(this._didDocs);
    this.storageService.setFriends(this._friends);

    this.sortContacts();
    this.genericToast(alertName + ' was deleted');
    this.router.navigate(['/friends']);
  }

  /******************************** Customize friend ********************************/
  customizeContact(customName: string, customNote: string, id: string) {
    this._friends.map(friend => {
      if(friend.id === id) {
        friend.name = customName;
        friend.note = customNote;
        this.storageService.setFriends(this._friends);
        this.sortContacts();
      }
    });
  }

  /******************************** View Friend Intent  ********************************/
  async viewFriend(did: string) {
    await this.getStoredDIDs().then((friends: Friend[]) => {
      let friend = friends.find((_friend) => _friend.id === did);
      if(friend) {
        this.router.navigate(['friends/', friend.id]);
      } else {
        this.resolveDIDDocument(did, false);
      }
    });
  }

  /******************************** Pick Friend Intent  ********************************/

  // Wait for storage before handling intent
  async getFriends(isSingleInvite: boolean, intent: string) {
    await this.getStoredDIDs().then((friends: Friend[]) => {
      console.log('My friends', friends);
      let realFriends = friends.filter((friend) => friend.id !== 'did:elastos');
      if (realFriends.length > 0) {
        let props: NavigationExtras = {
          queryParams: {
            singleInvite: isSingleInvite,
            intent: intent
          }
        }
        this.router.navigate(['/invite'], props);
      } else {
        this.router.navigate(['/friends']);
        this.alertNoFriends('You don\'t have any contacts!');
      }
    });
  }

  async getFilteredFriends(isSingleInvite: boolean, ret) {
    await this.getStoredDIDs().then((friends: Friend[]) => {
      console.log('My friends', friends);
      if(friends.length > 0) {
        console.log('Intent requesting friends with app', ret.from);
        this.filteredFriends = [];
        this._friends.map((friend) => {
          friend.applicationProfileCredentials.map((appCreds) => {
            if(friend.id !== 'did:elastos' && appCreds.apppackage === ret.from) {
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
              singleInvite: isSingleInvite,
              friendsFiltered: true,
              intent: 'pickfriend'
            }
          }
          this.router.navigate(['/invite'], props);
        } else {
          this.router.navigate(['/friends']);
          this.alertNoFriends('You don\'t have any contacts with this app!');
        }
      } else {
        return;
      }
    });
  }

  // Send intent response after selecting friends from pick-friend pg
  inviteFriends(isFilter: boolean, intent: string) {
    console.log('Invited filtered friends?', isFilter);
    let friends = [];

    this._didDocs.map((did) => {
      if (!isFilter) {
        this._friends.map((friend) => {
          if(did.id.didString === friend.id && friend.isPicked) {
            friends.push({
              did: did.id.didString,
              document: did
            });
            friend.isPicked = false;
          }
        });
      } else {
        this.filteredFriends.map((friend) => {
          if(did.id.didString === friend.id && friend.isPicked) {
            friends.push({
              did: did.id.didString,
              document: did
            });
            friend.isPicked = false;
          }
        });
      }
    });

    console.log('Invited friends', friends);
    this.sendIntentRes(friends, intent);
  }

  sendIntentRes(_friends: any, intent: string) {
    if(_friends.length > 0) {
      appManager.sendIntentResponse(
        intent,
        { friends: _friends },
        managerService.handledIntentId,
        (res: any) => {appManager.close();},
        (err: any) => {console.log('sendIntentResponse failed: ', err)}
      );
    } else {
      this.genericToast('Please select some friends before inviting');
    }
  }

  // Just notify the qrscanner to quit
  sendEmptyIntentRes() {
    appManager.sendIntentResponse(
        "",
        {},
        managerService.handledIntentId
      );
  }

  /******************************** Manage Favorite ********************************/
  toggleFav(friend: Friend) {
    friend.isFav = !friend.isFav;
/*     this._friends.map((_friend) => {
      if(_friend.id === friend.id) {
        _friend.isFav = !_friend.isFav;
      }
    }); */
    this.storageService.setFriends(this._friends);
  }

  /******************************* Share Contact  *******************************/
  shareContact(friend: Friend) {
    let link = 'https://scheme.elastos.org/addfriend?did=' + friend.id;
    this.clipboard.copy(link);
    this.shareToast(link);
  }

  /******************************** Contact Buttons ********************************/
  openScanner() {
    appManager.sendIntent("scanqrcode", {}, {}, (res) => {
      console.log("Got scan result", res);
      this.addFriendByIntent(res.result.scannedContent);
    }, (err: any) => {
      console.error(err);
    })
  }

  showCustomization(friend: Friend) {
    let props: NavigationExtras = {
      queryParams: {
        id: friend.id,
        name: friend.name,
        gender: friend.gender,
        note: friend.note,
        image: friend.imageUrl
      }
    }
    this.router.navigate(['/customize'], props);
  }

  async showOptions(ev: any, friend: Friend) {
    let contact = this._friends.find((_friend) => _friend.id === friend.id);
    console.log('Opening options for contact', contact);

    const popover = await this.popoverController.create({
      mode: 'ios',
      component: OptionsComponent,
      cssClass: !this.theme.darkMode ? 'options' : 'darkOptions',
      event: ev,
      componentProps: {
        contact: contact
      },
      translucent: false
    });
    return await popover.present();
  }

  /******************************** Sort Contacts ********************************/
  sortContacts() {
    this.letters = [];
    this._friends.map((friend) => {
      if(!friend.name && !this.letters.includes('No Name')) {
        this.letters.push('No Name');
      };
      if(friend.name && !this.letters.includes(friend.name[0].toUpperCase())) {
        this.letters.push(friend.name[0].toUpperCase());
      }
    });

    this.letters = this.letters.sort((a, b) => a > b ? 1 : -1);
    console.log('Letter groups', this.letters);
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
      }, (err) => {
        console.warn(err);
        resolve(false);
      });
    });
  }

  startApp(id) {
    appManager.start(id);
  }

  scanDID() {
    appManager.sendIntent("scanqrcode", {}, {}, (res) => {
      console.log("Got scan result", res);
      this.addFriendByIntent(res.result.scannedContent);
    }, (err: any)=>{
      console.error(err);
    })
  }

  /******************************** Alerts ********************************/
  async genericToast(msg) {
    const toast = await this.toastController.create({
      mode: 'ios',
      color: 'light',
      header: msg,
      duration: 2000
    });
    toast.present();
  }

  async didResolveErr(err: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      color: 'light',
      header: 'There was an error',
      message: err,
      duration: 6000.
    });
    toast.present();
  }

  async shareToast(link: string) {
    const toast = await this.toastController.create({
      mode: 'ios',
      color: 'light',
      header: 'Contact copied',
      message: link,
      duration: 3000
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

  deleteStorage() {
    this.storageService.setVisit(false);
  }
}

