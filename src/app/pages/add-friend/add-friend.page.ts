import { Component, OnInit } from '@angular/core';

declare let appManager: AppManagerPlugin.AppManager;

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
