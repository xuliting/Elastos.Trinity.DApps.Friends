import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController, PopoverController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

import { FriendsService } from 'src/app/services/friends.service';

import { Friend } from 'src/app/models/friends.model';
import { DApp } from 'src/app/models/dapp.model';

import { WarningPage } from './warning/warning.page';
import { Warning2Page } from './warning2/warning2.page';

declare let appManager: AppManagerPlugin.AppManager;

type DisplayableAppInfo = {
  packageId: string,
  app: DApp,
  action: string,
  isInstalled: boolean
}

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.page.html',
  styleUrls: ['./friend-details.page.scss'],
})
export class FriendDetailsPage implements OnInit {

  public friend: Friend;
  public friendsApps: DisplayableAppInfo[] = [];
  public fetchingApps = false;

  constructor(
    public friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private navCtrl: NavController,
    private alertController: AlertController,
    private popover: PopoverController,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('friendId')) {
        this.navCtrl.navigateBack('/friends');
        return;
      }
      this.friend = this.friendsService.getFriend(paramMap.get('friendId'));
      console.log(this.friend);
      this.buildDisplayableAppsInfo();
    });
    // Used to retrieve app data from app store
    // this.shipAppInfo();
  }

  /* From the app credentials, build a list of displayable items onced its fetched from the app store */
  private async buildDisplayableAppsInfo() {
    this.friendsApps = [];

    if (this.friend.applicationProfileCredentials.length > 0) {
      console.log('Friend\'s app creds ', this.friend.applicationProfileCredentials)
      this.friend.applicationProfileCredentials.map((apc)=>{
        this.fetchingApps = true;

        this.http.get<DApp>('https://dapp-store.elastos.org/apps/' + apc.apppackage + '/manifest').subscribe((manifest: DApp) => {
          console.log('Got app!', manifest);
          this.zone.run(async () => {

            this.friendsApps.push({
              packageId: apc.apppackage,
              app: manifest,
              action: apc.action ? apc.action : manifest.short_description,
              isInstalled: await this.friendsService.appIsInstalled(apc.apppackage)
            });

            this.fetchingApps = false;
            console.log('Updated apps', this.friendsApps);
          });
        });
      });
    }
    else {
      console.log("No application profile credential found in this friend's profile.");
    }
  }

  /**
   * If the credential provides an action string we use it. Otherwise
   * we just display the appliation description.
   */
  getDisplayableSubtitle(appInfo: DisplayableAppInfo) {
    return appInfo.action;
  }

  getAppIcon(appId) {
    return "https://dapp-store.elastos.org/apps/" +appId+ "/icon";
  }

  fixBirthDate(birth) {
    return moment(birth).format("MMMM Do YYYY");
  }

  customizeFriend() {
    let props: NavigationExtras = {
      queryParams: {
        didId: this.friend.id,
        didName: this.friend.name,
        didGender: this.friend.gender,
        didNote: this.friend.note,
        didImage: this.friend.imageUrl
      }
    }
    this.router.navigate(['/custom-name'], props);
  }

  showWarning(friend: Friend) {
    this.alertDelete(friend);
    this.deleteConfirm(friend);
  }

  async alertDelete(friend: Friend) {
    const popover = await this.popover.create({
      mode: 'ios',
      cssClass: 'warning',
      component: WarningPage,
      componentProps: {
        friend: friend
      }
    });
    return await popover.present();
  }

  async deleteConfirm(friend: Friend) {
    const popover = await this.popover.create({
      mode: 'ios',
      cssClass: '_warning',
      component: Warning2Page,
      componentProps: {
        friend: friend
      }
    });

    popover.onDidDismiss().then(() => {
      this.popover.dismiss();
    })

    return await popover.present();
  }

  discoverApp(app: DApp) {
    console.log('Inquiring app in app-store..', app.id);
    appManager.sendIntent("appdetails", app.id, {})
  }

  startApp(app: DApp) {
    this.friend.applicationProfileCredentials.map((appCred) => {
      if(appCred.apppackage === app.id) {
        console.log('Launching appCred: ' + appCred, 'appManifest: ', app);

        let passedFields = {};
        for (let key of Object.keys(appCred)) {
          // Don't pass specific keys to the receiving app.
          if (key == "action" || key == "apppackage" || key == "apptype")
            continue;

          passedFields[key] = appCred[key];
        }

        console.log("Passing fields to the connectapplicationprofile intent:", passedFields);

        appManager.sendIntent(
          "connectapplicationprofile",
          passedFields,
          { appId: app.id },
          () => {
          console.log("connectapplicationprofile intent success");
        }, (err) => {
          this.friendsService.startApp(app.id);
          console.error("connectapplicationprofile intent error", err);
        });
      }
    });
  }

  closeApp() {
    appManager.close();
  }

  /* // Prepare to ship app packages to app store
  async shipAppInfo() {
    let sendPackages = [];
    this.friend.applicationProfileCredentials.map(app => {
      sendPackages = sendPackages.concat(app.apppackage);
    });

    let appStoreRes = await this.getAppInfo(sendPackages);
    console.log('App store responded!', appStoreRes);
  }

  // Wait for response from app store
  getAppInfo(sendPackages) {
    return new Promise((resolve, reject) => {
      appManager.sendIntent("appdetails", sendPackages, (res) => {
        console.log('Response recieved', res)
        resolve(res);
      }, (err: any) => {
        console.log(err);
        reject(err);
      });
    });
  } */
}
