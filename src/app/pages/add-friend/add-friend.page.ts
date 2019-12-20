import { Component, OnInit } from '@angular/core';

declare let appManager: any;

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
