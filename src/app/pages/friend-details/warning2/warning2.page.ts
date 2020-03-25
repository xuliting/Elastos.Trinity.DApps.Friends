import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, NavParams } from '@ionic/angular';

import { FriendsService } from 'src/app/services/friends.service';
import { Friend } from 'src/app/models/friends.model';


@Component({
  selector: 'app-warning2',
  templateUrl: './warning2.page.html',
  styleUrls: ['./warning2.page.scss'],
})
export class Warning2Page implements OnInit {

  @Output() cancelEvent = new EventEmitter<boolean>();

  friend: Friend;

  constructor(
    private friendsService: FriendsService,
    private router: Router,
    private popover: PopoverController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    this.friend = this.navParams.get('friend');
    console.log('Delete warning', this.friend);
  }

  deleteFriend() {
    this.friendsService.deleteFriend(this.friend);
    this.popover.dismiss();
    console.log('Friend Deleted' + this.friend);

    if(this.friendsService._friends.length > 0) {
      this.router.navigate(['friends']);
    } else {
      this.router.navigate(['addFriend']);
    }
  }

  goBack() {
    this.popover.dismiss();
  }
}
