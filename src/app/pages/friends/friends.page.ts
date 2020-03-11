import { Component, OnInit } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friendsLoaded = true;

  constructor(
    public friendsService: FriendsService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
  }

  ionViewDidEnter() {
    appManager.setVisible("show", ()=>{}, (err)=>{});
  }

  closeApp() {
    console.log('Closing app');
    appManager.close();
  }
}
