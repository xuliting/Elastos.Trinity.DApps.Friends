import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { IonicRouteStrategy } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import * as Sentry from "@sentry/browser";

import { zh } from './../assets/languages/zh';
import { en } from './../assets/languages/en';
import { fr } from './../assets/languages/fr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './modules/shared.module';
import { FriendsService } from './services/friends.service';
import { OptionsComponent } from './components/options/options.component';
import { DeleteComponent } from './components/delete/delete.component';
import { SplashPageModule } from './pages/splash/splash.module';
import { InitPage } from './pages/init/init.page';

Sentry.init({
  dsn: "https://c22ac246ed2c4d2cb71cd482705d8adb@sentry.io/1875747"
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}

  handleError(error) {
    console.error("Globally catched exception:", error);

    console.log(document.URL);
    // Only send reports to sentry if we are not debugging.
    if (document.URL.includes('localhost')) { // Prod builds or --nodebug CLI builds use "http://localhost"
      Sentry.captureException(error.originalError || error);
    }
  }
}

export class CustomTranslateLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
      return Observable.create(observer => {
          switch (lang) {
              case 'zh':
                observer.next(zh);
                break;
              case 'fr':
                observer.next(fr);
                break;
              case 'en':
              default:
                observer.next(en);
          }

          observer.complete();
      });
  }
}

export function TranslateLoaderFactory() {
  return new CustomTranslateLoader();
}

@NgModule({
  declarations: [
    AppComponent,
    OptionsComponent,
    DeleteComponent,
    InitPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    SplashPageModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (TranslateLoaderFactory)
      }
    }),
 ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppComponent,
    OptionsComponent,
    DeleteComponent,
    InitPage
  ],
  providers: [
    FriendsService,
    StatusBar,
    SplashScreen,
    Clipboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
