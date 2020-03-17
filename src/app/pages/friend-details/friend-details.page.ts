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
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

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
  }

  ionViewWillEnter() {
    titleBarManager.setTitle("Friend profile");
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
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
      console.log('Friend\'s app creds ', this.friend.applicationProfileCredentials)

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
        },
        (error)=> {
          console.log("HTTP ERROR "+JSON.stringify(error));
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

  discoverApp(appId: string) {
    console.log('Inquiring app in app-store..', appId);
    appManager.sendIntent("appdetails", appId, {})
  }

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
