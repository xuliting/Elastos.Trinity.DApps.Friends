import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { FriendsService } from 'src/app/services/friends.service';
import { Friend } from 'src/app/models/friends.model';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {

  @Output() cancelEvent = new EventEmitter<boolean>();

  friend: Friend;

  constructor(
    public friendsService: FriendsService,
    private popover: PopoverController,
    private navParams: NavParams,
    private toastController: ToastController,
    public translate: TranslateService,
    public theme: ThemeService
  ) { }

  ngOnInit() {
    this.friend = this.navParams.get('contact');
    console.log('Options ', this.friend);
  }

  async deleteFriend() {
    this.friendsService.deleteWarning(this.friend);
    this.popover.dismiss();
  }
}
