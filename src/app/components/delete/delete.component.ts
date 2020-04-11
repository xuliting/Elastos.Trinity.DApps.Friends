import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, NavParams } from '@ionic/angular';

import { FriendsService } from 'src/app/services/friends.service';
import { Friend } from 'src/app/models/friends.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit {

  @Output() cancelEvent = new EventEmitter<boolean>();

  friend: Friend;

  constructor(
    public friendsService: FriendsService,
    private router: Router,
    private popover: PopoverController,
    private navParams: NavParams,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.friend = this.navParams.get('friend');
    console.log('Delete Warning', this.friend);
  }

  deleteFriend() {
    this.friendsService.deleteFriend(this.friend);
    this.popover.dismiss();
  }

  cancel() {
    this.popover.dismiss();
  }
}
