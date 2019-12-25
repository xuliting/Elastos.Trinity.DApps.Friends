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
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.friends = this.friendsService.friends;
    this.filteredFriends = this.friends;
    console.log(this.filteredFriends);
  }

  filterFriends(search) {
    this.filteredFriends = this.friends.filter((friend) => {
      return friend.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    console.log(this.filteredFriends);
  }

  toggleSearch() {
    this.searchOn = !this.searchOn;
  }

  scanDID() {
    appManager.sendIntent("scanqrcode", {}, (response)=> {
      console.log("Got scan result:", response);
      this.friendsService.friendScanned(response.result.scannedContent);
    }, (err: any)=>{
      console.error(err);
    })
  }

  async deleteFriend(friend: Friend) {
    this.friends = await this.friendsService.deleteFriend(friend)
    console.log('Deleting friend ->' + friend);
  }

  onClick(friend: Friend) {
    console.log(friend);
    this.actionSheetCtrl.create({
      cssClass: 'action',
      mode: "ios",
      buttons: [
        {
          text: 'View Profile',
          cssClass: 'action',
          handler: () => {
            this.router.navigate(['/menu/' + friend.id]);
          }
        },
        {
          text: 'Delete Friend',
          cssClass: 'action',
          handler: () => {
            this.alertDelete(friend);
          }
        },
        {
          text: 'Cancel',
          cssClass: 'action',
          role: 'destructive'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  async alertDelete(friend) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Are you sure you want to delete ' + friend.name + '?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.deleteFriend(friend);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ]
    });

    await alert.present();
  }

  closeApp() {
    console.log('Closing app');
    appManager.close();
  }
}
