import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicRouteStrategy } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './modules/shared.module';
import { FriendsService } from './services/friends.service';
import { Warning2Page } from './pages/friend-details/warning2/warning2.page';
import { Warning2PageModule } from './pages/friend-details/warning2/warning2.module';
import { WarningPage } from './pages/friend-details/warning/warning.page';
import { WarningPageModule } from './pages/friend-details/warning/warning.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    IonicStorageModule.forRoot(),
    WarningPageModule,
    Warning2PageModule,
 ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppComponent,
    WarningPage,
    Warning2Page,
  ],
  providers: [
    FriendsService,
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
