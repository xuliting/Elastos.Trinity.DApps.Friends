import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { FriendsService } from 'src/app/services/friends.service';
import { Friend } from 'src/app/models/friends.model';
import { isObject } from 'util';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friends: Friend[] = [];
  filteredFriends: Friend[] = [];
  friend: string = '';
  searchOn = false;
  friendsLoaded = true;

  constructor(
    private friendsService: FriendsService,
  ) { }

  ngOnInit() {
    this.friends = this.friendsService.friends;
    this.filteredFriends = this.friends;
    console.log(this.filteredFriends);
  }

  ionViewWillEnter() {
    this.friends = this.friendsService.friends;
    this.filteredFriends = this.friends;
    console.log(this.friends);
  }

  scanDID() {
    appManager.sendIntent("scanqrcode", {}, (response)=> {
      console.log("Got scan result:", response);
      this.friendsService.friendScanned(response.result.scannedContent);
    }, (err: any)=>{
      console.error(err);
    })
  }

  closeApp() {
    console.log('Closing app');
    appManager.close();
  }
}
