import { Component, OnInit } from '@angular/core';

import { FriendsService } from 'src/app/services/friends.service';
import { ActivatedRoute } from '@angular/router';
import { Friend } from 'src/app/models/friends.model';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from 'src/app/services/theme.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {

  isFilter: boolean = false;
  isSingleInvite: boolean = false;
  filteredFriends: Friend[];

  constructor(
    public friendsService: FriendsService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public theme: ThemeService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Pick-friend', params);
      if (params.singleInvite === "true") {
        this.isSingleInvite = true;
        titleBarManager.setTitle(this.translate.instant('invite-contact'));
      } else {
        titleBarManager.setTitle(this.translate.instant('invite-contacts'));
      }
      if (params.friendsFiltered) {
        this.isFilter = true;
      }
    });
    console.log('Is single invite?', this.isSingleInvite);
    console.log('Friends filtered?', this.isFilter);
  }

  ionViewWillEnter() {
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.CLOSE);
  }

  // If pick-friend intent is single invite, disable checkboxes if a friend is picked //
  singlePicked(isFilter: boolean) {
    let selectedFriends = 0;
    if(!isFilter) {
      this.friendsService._friends.map(friend => {
        if (friend.isPicked === true) {
          selectedFriends++;
        }
      });
    } else {
      this.friendsService.filteredFriends.map(friend => {
        if (friend.isPicked === true) {
          selectedFriends++;
        }
      });
    }

    if(selectedFriends >= 1) {
      return true;
    } else {
      return false;
    }
  }

  closeApp() {
    appManager.close();
  }
}
