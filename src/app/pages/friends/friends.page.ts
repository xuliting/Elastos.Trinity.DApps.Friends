import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FriendsService } from 'src/app/friends.service';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friends = [];
  filteredFriends = [];
  friend: string = '';
  searchOn = false;
  friendsLoaded = true;

  constructor(
    private friendsService: FriendsService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
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

  onClick(friend) {
    console.log(friend);
    this.actionSheetCtrl.create({
      cssClass: 'action',
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
            this.friendsService.deleteFriend(friend);
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

  deleteFriend(friend) {
    console.log('Deleting friend ->' + friend);
  }

  scanDID() {
    appManager.sendIntent("scanqrcode", {}, (response)=> {
      console.log("Got scan result:", response);
    }, (err: any)=>{
      console.error(err);
    })
  }

  closeApp() {
    console.log('Closing app');
    appManager.close();
  }
}
