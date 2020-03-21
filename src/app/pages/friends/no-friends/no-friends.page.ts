import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-friends',
  templateUrl: './no-friends.page.html',
  styleUrls: ['./no-friends.page.scss'],
})
export class NoFriendsPage implements OnInit {

  constructor(private popover: PopoverController, private router: Router) { }

  ngOnInit() {

  }

  addFriend() {
    this.popover.dismiss();
    this.router.navigate(['/addFriend']);
  }

}
