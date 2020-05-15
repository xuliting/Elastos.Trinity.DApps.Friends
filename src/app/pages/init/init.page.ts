import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FriendsService } from 'src/app/services/friends.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.page.html'
})
export class InitPage implements OnInit {
  constructor(private platform: Platform, private friendsService: FriendsService) {}

  ngOnInit(): void {
    this.platform.ready().then(() => {
      // Initialize the friends service here, because for an unknown reason, the angular router
      // needs a default page to show; and we don't want it to be the friends page directly,
      // as we need to handle incoming intents when the app is launched, without passing by the friends 
      // screen.
      // So angular first shows this empty screen (without setting app visibility though), and here we initialize
      // the friends service. The friends service will redirect to the appropriate screen, whether friends,
      // or add friend, pick friend, etc.
      this.friendsService.init();
    });
  }
}
