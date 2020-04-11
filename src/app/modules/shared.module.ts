import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIDButtonComponent } from '../components/did-button/did-button.component';
import { OptionsComponent } from '../components/options/options.component';

@NgModule({
  declarations: [
    DIDButtonComponent,
    //OptionsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DIDButtonComponent,
    //OptionsComponent
  ]
})
export class SharedModule { }
