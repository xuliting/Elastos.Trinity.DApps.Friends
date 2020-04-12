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
  isFav: boolean;

  constructor(
    public friendsService: FriendsService,
    private router: Router,
    private popover: PopoverController,
    private navParams: NavParams,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.friend = this.navParams.get('friend');
    this.isFav = this.friend.isFav;
    console.log('Options ', this.friend + ', is Fav?', this.isFav);
  }

  toggleFav() {
    this.isFav = !this.isFav;
    this.friendsService.toggleFav(this.friend);
    // this.router.navigate(['/friends']);
  }

  async deleteFriend() {
    this.friendsService.deleteWarning(this.friend);
    this.popover.dismiss();
  }

  goBack() {
    this.popover.dismiss();
  }
}
