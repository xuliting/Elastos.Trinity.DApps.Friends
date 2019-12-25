import { Component, OnInit } from '@angular/core';

import { FriendsService } from 'src/app/services/friends.service';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {

  didInput: string = '';

  constructor(private friendsService: FriendsService) {
  }

  ngOnInit() {
  }

  scanDID() {
    appManager.sendIntent("scanqrcode", {}, (res)=> {
      console.log("Got scan result:", res);
    }, (err: any)=>{
      console.error(err);
    })
  }

  addFriend() {
    if(this.didInput) {
      appManager.sendIntent("handlescannedcontent_did", this.didInput, (res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
      this.didInput = '';
    }
  }

  closeApp() {
    appManager.close();
  }

  async testResolve() {
    console.log("Test resolve");
    // Test for resolving DID on TESTNET
    let didDocument = await this.friendsService.resolveDIDDocument("did:elastos:iWHTwXKeXdgZHFLZWS22e7itTatjmFAzkL");
    console.log(didDocument);

  }
}
