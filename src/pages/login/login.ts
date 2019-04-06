import { Component } from '@angular/core';
import { ManagerProvider} from '../../providers/manager/manager';
import {AppNotify} from '../../app/app-notify';
import { IonicPage, NavController, NavParams  ,LoadingController} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials:any={};
  constructor(
    public navCtrl: NavController,
    public manager:ManagerProvider,
    public appNotify: AppNotify,
    public loadingCtrl: LoadingController
     ) {
     }

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

isInvalid(){
  return !this.credentials.login;
}

onSubmit(){
  let loader = this.loadingCtrl.create({
      content: "Connexion..."
    });
   
 this.manager.authenticate(this.credentials).then(res=>{
  
  this.appNotify.onError({message:JSON.stringify(res)});
  loader.dismiss();
  },error=>{
    loader.dismiss();
    this.appNotify.onError({message:JSON.stringify(error)});
  }); 
  loader.present();
 }
}
