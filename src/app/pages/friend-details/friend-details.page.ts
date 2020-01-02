import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController, PopoverController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { FriendsService } from 'src/app/services/friends.service';

import { Friend } from 'src/app/models/friends.model';
import { DApp } from 'src/app/models/dapp.model';

import { WarningPage } from './warning/warning.page';
import { Warning2Page } from './warning2/warning2.page';


declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.page.html',
  styleUrls: ['./friend-details.page.scss'],
})
export class FriendDetailsPage implements OnInit {

  friend: Friend;
  friendsApps: DApp[] = [];
  appsLoaded: boolean = false;

  constructor(
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router,
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
      this.getApps();
    });
    // Used to retrieve app data from app store
    // this.shipAppInfo();
  }

  // Using appstore get-manifest api
  getApps() {
    this.appsLoaded = true;
    if(this.friend.applicationProfileCredentials) {
      let fetchedApps = [];
      this.appsLoaded = false;
      this.friend.applicationProfileCredentials.map(app => {
        console.log('Fetching app info', app);
        this.http.get<DApp[]>('https://dapp-store.elastos.org/apps/' + app.apppackage + '/manifest').subscribe(manifest => {
          console.log('Got app!', manifest);
          fetchedApps = fetchedApps.concat(manifest);
          this.filterApps(fetchedApps);
          console.log('FETCHED APPS', fetchedApps);
        });
      });
    }
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

  filterApps = (apps) => {
    let unfilteredApps = [];
    this.friend.applicationProfileCredentials.map(credApp => {
      apps.map(fetchedApp => {
        if(credApp.apppackage === fetchedApp.id) {
          unfilteredApps = unfilteredApps.concat(fetchedApp);
        }
      });
    });
    this.friendsApps = unfilteredApps.filter((a, b) => unfilteredApps.indexOf(a) === b);
    this.appsLoaded = true;
    console.log('My apps', this.friendsApps);
  }

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

  discoverApp(id) {
    console.log('Inquiring app in app-store..', id);
    appManager.sendIntent("appdetails", id)
  }

  startApp(id) {
    this.friendsService.startApp(id);
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
