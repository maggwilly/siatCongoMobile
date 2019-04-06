import { Component,ViewChild } from '@angular/core';
import {Events,Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ManagerProvider} from '../providers/manager/manager';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = HomePage;
  @ViewChild(Nav) nav: Nav;
  rootPage: any =this.manager.getAuToken()? HomePage: 'LoginPage';// Home;
  constructor(platform: Platform,
     statusBar: StatusBar,
     public events: Events,
     splashScreen: SplashScreen,
    public manager: ManagerProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.listenToEvents();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  listenToEvents() {
    this.events.subscribe('login:success', () => {
      this.nav.setRoot(HomePage);
    });
;   
}
}

