import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

import { FriendsService } from 'src/app/services/friends.service';
import { TranslateService } from '@ngx-translate/core';

import { Friend } from 'src/app/models/friends.model';

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
