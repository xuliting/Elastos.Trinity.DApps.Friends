import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, NavParams } from '@ionic/angular';

import { FriendsService } from 'src/app/services/friends.service';
import { Friend } from 'src/app/models/friends.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {

  @Output() cancelEvent = new EventEmitter<boolean>();

  friend: Friend;

  constructor(
    private friendsService: FriendsService,
    private router: Router,
    private popover: PopoverController,
    private navParams: NavParams,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.friend = this.navParams.get('friend');
    console.log('Delete warning', this.friend);
  }

  deleteFriend() {
    this.friendsService.deleteFriend(this.friend);
    this.popover.dismiss();
    console.log('Friend Deleted' + this.friend);
  }

  goBack() {
    this.popover.dismiss();
  }
}
