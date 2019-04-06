import { Component } from '@angular/core';
import { Events, NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pointVentes: any = [];
  visites: any = [];
  queryText = '';
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public events: Events,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage) { 
     
    }

  ionViewDidLoad() {
    this.loadRemoteData();

  }

  initializeItems() {
    this.storage.get('_pointVentes').then((data) => {
      this.pointVentes = data;
    });
  }

  loadRemoteData(){
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });    
  /*  this.manager.getPointVentes( ).then(data=>{
      this.pointVentes=data?data:[]*/
      this.storage.get('_pointVentes').then((data) => {
        this.pointVentes = data?data:[];
        this.manager.getProduits().then(pdro=>{
          this.storage.set('_produits',pdro)
          loader.dismiss(); 
        },error=>{
          loader.dismiss();
        })
      })      
 /*   },error=>{
      console.log(error);
      this.storage.get('_pointVentes').then((data) => {
        this.pointVentes = data?data:[];
        loader.dismiss();
      });
    })*/
    loader.present();
  }

  startVisite(pointVente:any){
    let nowDate=new Date();
    var datePipe = new DatePipe('en');
    let date=datePipe.transform(nowDate, 'yyyy-MM-dd');
   
  this.storage.get(pointVente.id+'-'+date)
    .then((val) =>{ 
       if(!val){
       let modal = this.modalCtrl.create('VisitePage',{pointVente:pointVente});
        modal.onDidDismiss(data => { 
          if (data) {
          console.log(data);                     
              this.storage.get('_visites').then((val) =>{ 
                if(val) 
                  this.visites=  val;
                  data.user=this.manager.getUserId();
                  this.visites.push(data);
                  this.storage.set('_visites', this.visites);
                   this.storage.set('_pointVentes', this.pointVentes);
                   let date=datePipe.transform(nowDate, 'yyyy-MM-dd');
                  this.storage.set(pointVente.id+'-'+date, this.visites);
              } );
                this.storage.set('_visites_saved', false); 
          }             
      });
      modal.present(); 
    } 
    else
    this.alert();    
     } )

 }

 startUpload(){
  let modal = this.modalCtrl.create('SauvegardePage');
  modal.present(); 
 }


 createPdv(){
         let modal = this.modalCtrl.create('PointVentePage');
         modal.onDidDismiss(data => { 
          if (data) {
          console.log(data);  
          data.user=this.manager.getUserId();                   
          this.pointVentes.push(data); 
          this.storage.set('_pointVentes', this.pointVentes);
          this.storage.set('_point_ventes_saved', false).then(()=>{
           this.startVisite(data)
          });
       }             
  });
modal.present(); 
}


  search() {
    this.storage.get('_pointVentes').then((data) => {
      this.pointVentes = data;
      let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      this.pointVentes.forEach(item => {
        item.hide = true;
        this.filter(item, queryWords);
      });
    });
  }

  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.nom.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }


  alert() {
    let confirm = this.alertCtrl.create({
      title: '<b>Déja visité</b>',
      message: "<b>Ce point de vente a déja enrégistré une visite pour cette journée.</b>",
      buttons: [

        {
          text: 'OK',
          handler: () => {

            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
}
