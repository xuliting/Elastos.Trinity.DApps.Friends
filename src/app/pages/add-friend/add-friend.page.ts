import { Component, OnInit } from '@angular/core';

import { FriendsService } from 'src/app/services/friends.service';
import { DID } from 'src/app/models/did.model';

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
      this.friendsService.friendScanned(res.result.scannedContent);
    }, (err: any)=>{
      console.error(err);
    })
  }

  // DID ex: "did:elastos:iWHTwXKeXdgZHFLZWS22e7itTatjmFAzkL
  async addFriend() {
    if(this.didInput) {
      console.log("Resolving DID Document");
      // Test for resolving DID on TESTNET
      let didDocument = await this.friendsService.resolveDIDDocument(this.didInput);
      console.log('DID document', didDocument);
      this.friendsService.showConfirm(didDocument);
      this.didInput = "";
    }
  }

  closeApp() {
    appManager.close();
  }
}
