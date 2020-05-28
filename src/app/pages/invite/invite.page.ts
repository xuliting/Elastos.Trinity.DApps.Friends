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

  // Params
  isFilter: boolean = false;
  isSingleInvite: boolean = false;
  intent: string = ''

  filteredFriends: Friend[];
  letters: string[] = [];

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
        this.sortContacts(this.isFilter);
      } else {
        this.isFilter = false;
        this.sortContacts(this.isFilter);
      }
      if(params.intent) {
        this.intent = params.intent;
      }
    });
    console.log('Is single invite?', this.isSingleInvite);
    console.log('Friends filtered?', this.isFilter);
    console.log('Intent', this.intent);
  }

  ionViewWillEnter() {
    appManager.setVisible("show");
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.CLOSE);
  }

  ionViewDidEnter() {
  }

  getFriends() {
    return this.friendsService._friends.filter((friend) => friend.id !== 'did:elastos');
  }

  sortContacts(isFilter: boolean) {
    this.letters = [];
    if(isFilter) {
      this.friendsService.filteredFriends.map((friend) => {
        if(!friend.name && !this.letters.includes('No Name')) {
          this.letters.push('No Name');
        };
        if(friend.name && !this.letters.includes(friend.name[0].toUpperCase())) {
          this.letters.push(friend.name[0].toUpperCase());
        }
      });

      this.letters = this.letters.sort((a, b) => a > b ? 1 : -1);
      console.log('Letter groups', this.letters);
    } else {
      this.friendsService._friends.map((friend) => {
        if(!friend.name && !this.letters.includes('No Name')) {
          this.letters.push('No Name');
        };
        if(friend.id !== 'did:elastos' && friend.name && !this.letters.includes(friend.name[0].toUpperCase())) {
          this.letters.push(friend.name[0].toUpperCase());
        }
      });

      this.letters = this.letters.sort((a, b) => a > b ? 1 : -1);
      console.log('Letter groups', this.letters);
    }
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
