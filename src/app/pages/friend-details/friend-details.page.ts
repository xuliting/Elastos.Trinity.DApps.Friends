import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController, PopoverController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

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
  infoFetched: boolean,
  isInstalled: boolean
}

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.page.html',
  styleUrls: ['./friend-details.page.scss'],
})
export class FriendDetailsPage implements OnInit {
  friend: Friend;
  friendsApps: DisplayableAppInfo[] = [];

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
      this.getApps();
    });
    // Used to retrieve app data from app store
    // this.shipAppInfo();
  }

  /**
   * From the list of friend's app credentials, build a preliminary list of displayable
   * items. Those app items are going to be completed later on by fetching info from the app store.
   */
  private buildDisplayableAppsInfo() {
    this.friendsApps = [];

    if (this.friend.applicationProfileCredentials) {
      console.log('Friend\'s app creds ', this.friend.applicationProfileCredentials)
      this.friend.applicationProfileCredentials.map((apc)=>{
        // Used the provided app profile action if any.
        let action = apc.action || null;

        // Push a new empty app info, waiting to get populated.
        this.friendsApps.push({
          packageId: apc.apppackage,
          app: null,
          action: action,
          infoFetched: false,
          isInstalled: false
        });
        console.log('Friend\'s apps', this.friendsApps);
      });
    }
    else {
      console.log("No application profile credential found in this friend's profile.");
    }
  }

  // Using appstore get-manifest api
  getApps() {
    this.friendsApps.map(appInfo => {
      console.log('Fetching app info for:', appInfo);

      this.http.get<DApp>('https://dapp-store.elastos.org/apps/' + appInfo.packageId + '/manifest').subscribe((manifest: DApp) => {
        console.log('Got app!', manifest);

        this.zone.run(async ()=>{
          appInfo.app = manifest;
          appInfo.infoFetched = true;

          // No action defined by the credential? Use the app description instead.
          if (!appInfo.action)
            appInfo.action = manifest.short_description;

          // Check if this app is installed on user's device or not.
          appInfo.isInstalled = await this.friendsService.appIsInstalled(appInfo.packageId);
        })
      });
    });
  }

  /**
   * Checks if all app info have been fetched from the app store or if we are still waiting for
   * some of them
   */
  allAppsInfoLoaded() {
    // Search at least one unloaded app
    let unloadedAppInfo = this.friendsApps.find((app)=>{
      return !app.infoFetched;
    })
    return (unloadedAppInfo == null);
  }

  /**
   * If the credential provides an action string we use it. Otherwise
   * we just display the appliation description.
   */
  getDisplayableSubtitle(appInfo: DisplayableAppInfo) {
    return appInfo.action;
  }

  // Using appstore apps-list api
  /* getApps() {
    this.appsLoaded = true;
    if(this.friend.applicationProfileCredentials.length > 0) {
      this.appsLoaded = false;
      console.log('Fetching apps');
      this.http.get<DApp[]>('https://dapp-store.elastos.org/apps/list').subscribe(apps => {
        console.log('Apps!', apps);
        this.filterApps(apps);
      });
    }
  } */

  getAppIcon(app) {
    return "https://dapp-store.elastos.org/apps/"+app.id+"/icon";
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
