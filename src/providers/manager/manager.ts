import { Injectable } from '@angular/core';
import { Http, Headers, } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { DatePipe } from "@angular/common";
/*
  Generated class for the ManagerProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ManagerProvider {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  date: any;
  baseUrl: string = 'https://siatweb.herokuapp.com/v1/mobile';
  constructor(public http: Http, public storage: Storage, public events: Events) {
    console.log('Hello Manager Provider');
    let nowDate = new Date();
    var datePipe = new DatePipe('en');
    this.date = datePipe.transform(nowDate, 'yyyy-MM-dd');
  }
  storeUserCredentials(token) {
    window.localStorage.setItem('_token', token);
  }


  clearStorage() {
     
  }

  storeUser(user: any) {
    window.localStorage.setItem('_user_id', user.id);
    window.localStorage.setItem('_user_region', user.ville);
  }

  getUserId(): string {
    let _user_id = window.localStorage.getItem('_user_id');
    return _user_id;
  }

  getUserVille(): string {
    let _user_region = window.localStorage.getItem('_user_region');
    return _user_region;
  }


  getAuToken(): string {
    let token = window.localStorage.getItem('_token');
    return token;
  }

  getPointVentes() {  
      
    return this.http.get(this.baseUrl + '/points/ventes/' + this.getUserVille(), { headers: this.headers })
      .toPromise()
      .then(response => this.updatePointVenteList(response.json()))
  }

  getProduits() {
    return this.http.get(this.baseUrl + '/produits', { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  updatePointVenteList(pointVentes:Array<any>){
    var datePipe = new DatePipe('en');    
       pointVentes.forEach(element => {
      let  date=datePipe.transform(element.lastvisitedate, 'yyyy-MM-dd');
      this.storage.set(element.id+'-'+date, date); });
    let oldPointVentes=[];
      this.storage.get('_pointVentes').then((data) =>{ 
        console.log(data);
          if(data){
             oldPointVentes=data.filter((pointVente)=> { 
                return pointVente.nonSaved;
            });
          }
          console.log(data);
          pointVentes.push.apply(pointVentes,oldPointVentes);     
        } )
      return pointVentes;
  } 

  authenticate(credentials: any) {
    console.log(JSON.stringify(credentials));
    
    return new Promise((resole,reject)=> {
    this.http.post(this.baseUrl + '/create/auth-token', JSON.stringify(credentials), { headers: this.headers })
      .toPromise()
      .then(response => {
        if (response) {
          this.storeUserCredentials(response.json().value);
          this.storeUser(response.json().user);
          this.events.publish('login:success');
          resole (response.json())
        } ;
      },error=>{
          resole (error)
          this.events.publish('login:error');
      });
    })
  }

  asynch(synchro: any) {
   console.log(JSON.stringify(synchro));
           return  this.http.post(this.baseUrl+'/create/points/ventes', JSON.stringify(synchro), { headers:this. headers })
                .toPromise()
                 .then(response =>response.json())
      
      }  
}

