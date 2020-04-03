import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.page.html',
  styleUrls: ['./warning.page.scss'],
})
export class WarningPage implements OnInit {

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

}
