import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

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

  constructor(
    private friendsService: FriendsService,
    public toastController: ToastController,
  ) {
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

  // DID ex:
  // did:elastos:iWHTwXKeXdgZHFLZWS22e7itTatjmFAzkL
  // did:elastos:inHbk1cSRdQ8BPHj3n44ebQoyTeN2uHv83
  // did:elastos:imuTjwHco1AELt4R2aEwPghRb9kYobArwF
  // did:elastos:iSrkbm14y1aLvJXps4UK6Hg1xeiCkns984
  // did:elastos:ir1bSDao3sdLMYJBHWdK9LyUCbfV44DG1j
  // did:elastos:iU46NjJoapvjgt1j6QYMX3d72DBHV8d4SW
  async addFriend() {
    if(this.didInput.slice(0,11) !== 'did:elastos') {
      this.inputInvalid();
      this.didInput = "";
    } else {
      console.log("Resolving DID Document");
      // Test for resolving DID on TESTNET
      let didDocument = await this.friendsService.resolveDIDDocument(this.didInput);
      console.log('DID document', didDocument);
      this.friendsService.showConfirm(didDocument);
      this.didInput = "";
    }
  }

  async inputInvalid() {
    const toast = await this.toastController.create({
      message: "Please add a valid DID",
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  closeApp() {
    appManager.close();
  }
}
