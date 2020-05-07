import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FriendsService } from 'src/app/services/friends.service';
import { ThemeService } from 'src/app/services/theme.service';

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
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    public theme: ThemeService
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
    this.friendsService.addingFriend = true;
    this.friendsService.addFriend();
    this.router.navigate(['friends']);
  }

  denyFriend() {
    this.router.navigate(['friends']);
  }
}
