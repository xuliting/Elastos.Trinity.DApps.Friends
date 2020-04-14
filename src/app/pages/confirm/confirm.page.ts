import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FriendsService } from 'src/app/services/friends.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {

  public id: string = '';
  public name: string = '';
  public gender: string = '';
  public image: string = '';

  constructor(
    public friendsService: FriendsService,
    private popover: PopoverController,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.id = params.id;
        this.name = params.name;
        this.gender = params.gender;
        this.image = params.image;
      }
    });
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant('confirm-contact'));
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  addFriend() {
    this.friendsService.addFriend();
    this.router.navigate(['friends']);
  }

  denyFriend() {
    let alertName: string = '';
    if(this.name) {
      alertName = this.name;
    } else {
      alertName = this.id;
    }

    // this.friendsService.genericToast('Denied friend ' + alertName);
    this.router.navigate(['friends']);
  }
}
