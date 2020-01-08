import { Component, OnInit, ViewChild } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-custom-name',
  templateUrl: './custom-name.page.html',
  styleUrls: ['./custom-name.page.scss'],
})
export class CustomNamePage implements OnInit {

  @ViewChild('input', {static: false}) input: IonInput;

  public didId: string = '';
  public didName: string = '';
  public didGender: string = '';
  public didImage: string = '';
  public didNote: string = '';

  public customName: string = '';
  public customNote: string = '';

  constructor(
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.didId = params.didId;
        this.didName = params.didName;
        this.didGender = params.didGender;
        this.didImage = params.didImage;
        this.didNote = params.didNote;

        this.customName = this.didName;
        this.customNote = this.didNote;
      }
      if(!this.didName) {
        this.customName = this.didId;
      }
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.input.setFocus();
    }, 200);
  }

  nameChanged(name) {
    if(!name) {
      this.customName = '';
    }
  }

  noteChanged(note) {
    if(!note) {
      this.customNote = '';
    }
  }

  customDID() {
    if(this.customName === this.didId) {
      this.customName = null;
    }
    this.friendsService.customDID(this.customName, this.customNote, this.didId);
    this.router.navigate(['/', this.didId]);
  }
}
