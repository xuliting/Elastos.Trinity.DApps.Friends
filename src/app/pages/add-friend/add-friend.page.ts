import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, IonInput } from '@ionic/angular';

import { FriendsService } from 'src/app/services/friends.service';
import { DID } from 'src/app/models/did.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {

  @ViewChild('input', {static: false}) input: IonInput;

  didInput: string = '';
  didResolved: boolean = true;

  constructor(
    private friendsService: FriendsService,
    public toastController: ToastController,
  ) {
  }

  ngOnInit() {
    this.didResolved = true;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.input.setFocus();
    }, 200);
  }

  scanDID() {
    appManager.sendIntent("scanqrcode", {}, {}, (res)=> {
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
      this.didResolved = false;
      console.log("Resolving DID Document");

      await this.friendsService.resolveDIDDocument(this.didInput);
      this.didResolved = true;
      this.didInput = "";


      // Test for resolving DID on TESTNET
    /*   let didDocument = await this.friendsService.resolveDIDDocument(this.didInput);
      console.log('DID document', didDocument);
      this.friendsService.showConfirm(didDocument); */
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
