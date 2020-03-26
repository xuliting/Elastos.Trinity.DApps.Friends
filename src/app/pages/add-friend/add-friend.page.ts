import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ToastController, IonInput, PopoverController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { FriendsService } from 'src/app/services/friends.service';
import { DID } from 'src/app/models/did.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

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
    private toastController: ToastController,
    private popoverController: PopoverController,
    private zone: NgZone
    // private clipboard: Clipboard
  ) {
  }

  ngOnInit() {
    this.didResolved = true;
  }

  ionViewWillEnter() {
    titleBarManager.setTitle("Add a friend");
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
    setTimeout(() => {
      this.input.setFocus();
    }, 200);
  }

  scanDID() {
    appManager.sendIntent("scanqrcode", {}, {}, (res) => {
      console.log("Got scan result", res);
      this.friendsService.addFriendByIntent(res.result.scannedContent);
    }, (err: any)=>{
      console.error(err);
    })
  }

  /* pasteDID() {
    console.log('Pasting DID');
    this.clipboard.paste().then((resolve: string) => {
      this.didInput = resolve;
      console.log(resolve);
    }, (reject: string) => {
      console.error('Error: ' + reject);
      }
    );
  };
 */

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

      await this.friendsService.resolveDIDDocument(this.didInput, false);
      this.didResolved = true;
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
}
