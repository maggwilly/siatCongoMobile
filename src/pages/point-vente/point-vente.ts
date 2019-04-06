import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {DatePipe} from "@angular/common";
import { ManagerProvider} from '../../providers/manager/manager';
import { IonicPage, NavController, ViewController,AlertController,ModalController  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-point-vente',
  templateUrl: 'point-vente.html',
})
export class PointVentePage {
  pointVente:any={type:'Boutique de quartier'};
   pointVentes:any=[];
   secteurs:any=[];
   secteur:any;
   long:any;
   lat:any;
   constructor(
     public navCtrl: NavController,
     public alertCtrl: AlertController,
     public modalCtrl:ModalController,
     public storage: Storage, 
     public viewCtrl: ViewController,
     public manager: ManagerProvider,) {
     }
 
   ionViewDidLoad() {
     console.log('Hello PointVente Page');  
      this.pointVente.ville=this.manager.getUserVille(); 
      this.storage.get('_pointVentes').then((data) =>{  
          this. pointVentes=  data?data:[];
       } );

   /*   Geolocation.getCurrentPosition().then(pos => {
            if(pos && pos.coords){
            this.lat=pos.coords.latitude;
            this.long=pos.coords.longitude;  
      }
     }); */      
   }

 select(){
   let modal=this.modalCtrl.create('QuartiersPage');
   modal.onDidDismiss(data => {
      console.log(data);
         this.pointVente.quartier=data;
    });
    modal.present();
 }
 isInvalid():boolean {
   return (!this.pointVente.nom||!this.pointVente.description||!this.pointVente.tel);
 }
 
 dismiss(data?:any) {
       this.viewCtrl.dismiss(data);
   } 
 
 exist(items, seach):any{
       let item= items.find((item) => {
        return  (item.nom==seach.nom ) ;
       });
 
  return item;
 }
 
 
 onSubmit(){
    
 if(!this.exist(this.pointVentes,this.pointVente)){
    let nowDate=new Date();
    var datePipe = new DatePipe('en');
    let user=this.manager.getUserId();
    let id=user+''+datePipe.transform(nowDate, 'yyyyMMddHHmmss');
    this.pointVente.id=id;
    this.pointVente.nonSaved=true;
    this.pointVente.date=datePipe.transform(nowDate, 'yyyy-MM-dd');
    this.pointVente.latitude=this.lat;
     this.pointVente.longitude=this.long;
    this.dismiss(this.pointVente);
  console.log(JSON.stringify(this.pointVente));
 }else
 this.alert();
 }
 
  alert() {
     let confirm = this.alertCtrl.create({
       title: '<b>Existe déja</b>',
       message: "<b>Il existe déjà un point de vente connu enrégistré sur le même nom.</b>",
         buttons: [
 
         {
           text: 'OK',
           handler:()=> {           
 
             console.log('Agree clicked');
           }
         }
       ]
     });
     confirm.present();
   }
 }
 