import { Component, OnInit, ViewChild } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-customize',
  templateUrl: './customize.page.html',
  styleUrls: ['./customize.page.scss'],
})
export class CustomizePage implements OnInit {

  @ViewChild('input', {static: false}) input: IonInput;

  public id: string = '';
  public name: string = '';
  public gender: string = '';
  public image: string = '';
  public note: string = '';

  public customName: string = '';
  public customNote: string = '';

  constructor(
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router,
    private nav: NavController,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.id = params.id;
        this.name = params.name;
        this.gender = params.gender;
        this.image = params.image;
        this.note = params.note;

        this.customName = this.name;
        this.customNote = this.note;
      }
      if(!this.name) {
        this.customName = this.id;
      }
    });
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant('customize-contact'));
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
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

  customizeContact() {
    if(this.customName === this.id) {
      this.customName = null;
    }
    this.friendsService.customizeContact(this.customName, this.customNote, this.id);
    this.nav.back();
  }
}
