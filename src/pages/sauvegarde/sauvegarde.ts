import { Component } from '@angular/core';
import {IonicPage,Events, NavController, ViewController ,AlertController,LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider} from '../../providers/manager/manager';
import {AppNotify} from '../../app/app-notify';
import {DatePipe} from "@angular/common";
export class Synchro{
user:any;
id:any;
pointVentes:Array<any>=[];
visites:Array<any>=[];
etapes:Array<any>=[];
quartiers:Array<any>=[];
status:any;
constructor(user:any,id:any){
this.user=user;
this.id=id;
}
}

@IonicPage()
@Component({
  selector: 'page-sauvegarde',
  templateUrl: 'sauvegarde.html'
})
export class SauvegardePage {
 lastSavedDate:any;
 point_ventes_saved:any;
 visites_saved:any;
 etapes_saved:any;
 quartiers_saved:any;
 synchro:Synchro;
 loader:any;
  constructor(public navCtrl: NavController,
  public storage: Storage, 
  public manager: ManagerProvider, 
  public viewCtrl: ViewController, 
  public events: Events, 
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public appNotify: AppNotify
           ) {}

  ionViewDidLoad() {
    console.log('Hello Sauvegarde Page');
        this.storage.get('_last_saved_date').then((data) =>{  
         this.lastSavedDate=  data;
      } );
      
      this.storage.get('_point_ventes_saved').then((data) =>{  
           if(data)
             this.point_ventes_saved=  data;
      } );

      this.storage.get('_visites_saved').then((data) =>{  
           if(data)
             this.visites_saved=  data;
      } );
            
  }

  dismiss(data?:any) {
    this.viewCtrl.dismiss(data);
} 
  startUpload(){
    let self=this;
    let nowDate=new Date();
    var datePipe = new DatePipe('en');
     let user=this.manager.getUserId();
     let id=user+'_'+datePipe.transform(nowDate, 'yyyyMMddHHmmss');   
    this.synchro=new Synchro(user,id);
     this.loader = this.loadingCtrl.create({
      content: "Synchronisation...",
    });
   
  this.storage.get('_pointVentes').then((data) =>{  
           let pointVentes= data?data:[];
           if(pointVentes)
            this.synchro.pointVentes= pointVentes.filter((pointVente) => {
             return pointVente.nonSaved;
               });
               this.storage.get('_visites').then((data) =>{  
                let visites=data?data:[];
                if(visites)
                this.synchro.visites= visites.filter((visite) => {
                 return visite.nonSaved;
              });
              this.manager.asynch(this.synchro).then(data=>{
                if(data.success){
                   this. onSucess().then(()=>{
                     if(this.loader)
                     this.loader.dismiss();
                     self.dismiss();
                    this.appNotify.onSuccess({message:'Opération terminée avec succès',showCloseButton:false});
                  });   
                }
              },error=>{
                this.storage.set('_failed_synchro_',this.synchro);
                if(this.loader)
                  this.loader.dismiss(); 
                 this.alert();
              });           
           
    } );    
 } );
  this.loader.present();
  }



onSucess(){
    this.etapes_saved=true;
    this.point_ventes_saved=true;
    this.visites_saved=true;
    this.quartiers_saved=true;
    this.storage.set('_point_ventes_saved',true);
    this.storage.set('_visites_saved',true);
    this.storage.set('_failed_synchro_',undefined); 
    return this.storage.get('_pointVentes').then((data) =>{  
           let pointVentes= data;
           if(pointVentes)
             pointVentes.forEach((pointVente) => {
             pointVente.nonSaved=false;;
      });
      this.storage.set('_pointVentes',pointVentes)     .then(()=>{
        this.storage.get('_visites').then((data) =>{  
           let visites=  data;
           if(visites)
            visites.forEach((visite) => {
            visite.nonSaved=false;;
         });
    return this.storage.set('_visites',visites);     
     } );
  })
 } )
; 
}
retry(){
  let self=this;
   this.loader = this.loadingCtrl.create({
      content: "Synchronisation...",
    });
     this.storage.get('_failed_synchro_').then((synchro) =>{  
           if(synchro)
             this.manager.asynch(synchro).then(data=>{
             if(data.success){
               this. onSucess().then(()=>{
                 if(this.loader)
                 this.loader.dismiss();
                 self.dismiss();
                this.appNotify.onSuccess({message:'Opération terminée avec succès',showCloseButton:false});
              });
            }  
            else{
              this.storage.set('_failed_synchro_',this.synchro);
              if(this.loader)
                this.loader.dismiss(); 
               this.alert();
            }
          },error=>{
            this.storage.set('_failed_synchro_',this.synchro);
            if(this.loader)
              this.loader.dismiss(); 
             this.alert();
          });
      } );


 this.loader.present();
}
  isSaved(){
    return this.point_ventes_saved&&this.visites_saved;
  }


 alert() {
    let confirm = this.alertCtrl.create({
      title: '<b>Connexion</b>',
      message: "<b>Il se peut que votre connexion soit quelques peu pertubée. Veillez réessayer</b>",
        buttons: [

        {
          text: 'Ressayer',
          handler:()=> {           
           this.retry();
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }  
}
