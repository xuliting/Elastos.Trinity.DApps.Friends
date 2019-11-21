import { Component, OnInit } from '@angular/core';
import { AppManager } from '@elastosfoundation/trinity-types';

declare let appManager: AppManager;

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeApp() {
    appManager.close();
  }

}
