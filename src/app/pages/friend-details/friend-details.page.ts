import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { NavController } from '@ionic/angular';

import * as moment from 'moment';

import { FriendsService } from 'src/app/services/friends.service';
import { ThemeService } from 'src/app/services/theme.service';

import { Friend } from 'src/app/models/friends.model';
import { DApp } from 'src/app/models/dapp.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

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
  public detailsActive = true;

  constructor(
    public friendsService: FriendsService,
    private route: ActivatedRoute,
    private zone: NgZone,
    private navCtrl: NavController,
    private http: HttpClient,
    public translate: TranslateService,
    public theme: ThemeService
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
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant('contact-profile'));
    this.friendsService.setTitleBarBackKeyShown(true);
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  ionViewWillLeave() {
    this.friendsService.setTitleBarBackKeyShown(false);
  }

  /* From the app credentials, build a list of displayable items onced its fetched from the app store */
  private async buildDisplayableAppsInfo() {
    this.friendsApps = [];
 /*    this.friendsApps.push({
      packageId: 'Chads.dapp.org',
      app: null,
      action: 'Im a dapp',
      isInstalled: false
    }); */

    if (this.friend.applicationProfileCredentials.length > 0) {
      console.log('Friend\'s app creds ', this.friend.applicationProfileCredentials);

      let fetchCount = this.friend.applicationProfileCredentials.length;
      this.fetchingApps = true;
      this.friend.applicationProfileCredentials.forEach((apc)=>{
        this.http.get<DApp>('https://dapp-store.elastos.org/apps/' + apc.apppackage + '/manifest').subscribe((manifest: DApp) => {
          console.log('Got app!', manifest);
          this.zone.run(async () => {
            this.friendsApps.push({
              packageId: apc.apppackage,
              app: manifest,
              action: apc.action ? apc.action : manifest.short_description,
              isInstalled: await this.friendsService.appIsInstalled(apc.apppackage)
            });

            fetchCount--;
            if (fetchCount == 0)
              this.fetchingApps = false;
          });
        }, (err) => {
          console.log("HTTP ERROR " + JSON.stringify(err));
          this.zone.run(async () => {
            this.friendsApps.push({
              packageId: apc.apppackage,
              app: null,
              action: apc.action ? apc.action : null,
              isInstalled: await this.friendsService.appIsInstalled(apc.apppackage)
            });

            fetchCount--;
            if (fetchCount == 0)
              this.fetchingApps = false;
          });
        });
        console.log('Updated apps', this.friendsApps);
      });
    }
    else {
      console.log("No application profile credential found in this friend's profile.");
    }
  }

  getAppIcon(appId: string) {
    return "https://dapp-store.elastos.org/apps/" +appId+ "/icon";
  }

  fixBirthDate(birth) {
    return moment(birth).format("MMMM Do YYYY");
  }

  // Find app in marketplace, if marketplace is not installed, automatically install app //
  discoverApp(appId: string) {
    console.log('Inquiring app in app-store..', appId);
    appManager.sendIntent("appdetails", appId, {}, (res) => {
      console.log(res)
    }, (err) => {
      console.error(err);
      appManager.sendIntent(
        "app",
        { id: appId },
        {}
      );
    });
  }

  // If app is installed, connect app to identity demo, if identity demo is not installed, open app instead  //
  connectApp(appId: string) {
    this.friend.applicationProfileCredentials.map((appCred) => {
      if(appCred.apppackage === appId) {
        console.log('Launching appCred: ' + appCred, 'appManifest: ', appId);

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
          { appId: appId },
          () => {
          console.log("connectapplicationprofile intent success");
        }, (err) => {
          this.friendsService.startApp(appId);
          console.error("connectapplicationprofile intent error", err);
        });
      }
    });
  }
}
