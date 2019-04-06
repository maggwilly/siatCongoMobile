import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController  , ViewController } from 'ionic-angular';
import {DatePipe} from "@angular/common";
import { Storage } from '@ionic/storage';
import { ManagerProvider} from '../../providers/manager/manager';
/**
 * Generated class for the VisitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-visite',
  templateUrl: 'visite.html',
})
export class VisitePage {

  visite:any={sapp:'true',situations:[],lignes:[]};
  pointVente:any;
  stape:any='status';
    constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public storage: Storage,
    public viewCtrl: ViewController,
    public manager: ManagerProvider,
    public navParams:NavParams) {
    this.pointVente=navParams.get('pointVente');
   
    }
  
    ionViewDidLoad() {
      let nowDate=new Date();
      var datePipe = new DatePipe('en');
      this.visite.date=datePipe.transform(nowDate, 'yyyy-MM-dd');
      this.visite.pointVente=this.pointVente.id;
      this.visite.nonSaved=true;
      this.storage.get('_produits').then((data) =>{ 
        console.log(data);
       if(data&&data.length)
         data.forEach(produit => {
             if(produit.dossier!='new'){
               console.log((produit.dossier!='new'));
                  this.visite.situations.push({produit:produit.nom, stock:0,stockG:0});
                }
              if(produit.dossier=='new')
                this.visite.lignes.push({produit:produit.nom, stock:0});   
       });
        } );  
    }
  
   isInvalid():boolean {
      return (
         (this.stape=='status'&&((this.visite.pasClient && !this.visite.raisonPasClient)||(this.visite.pasOuvert && !this.visite.raisonPasOuvert)))||
         (this.stape=='comment'&&(!this.visite.commentaire))||
         (this.stape=='sell'&&(!this.visite.mvj||!this.visite.ecl)));
    }
  
   dismiss(data?:any) {   
        this.viewCtrl.dismiss(data);
    } 
  
    goBack() {
       switch (this.stape){  
           case 'comment':
            this.stape='stocks';
           break;
           case 'stocks':
            this.stape='vente';
           break;
           case 'vente':
            this.stape='sell';
           break;           
           case 'sell':
            this.stape='visibility';
           break;  
          case 'visibility':
            this.stape='status';
           break;                      
         default:
           this.dismiss();
           break;
       }
     }
  
    nextStape() {
      if(this.visite.pasClient || this.visite.pasOuvert){
        this.saveVisite();
         return;
        }
       switch (this.stape){
          case 'status':
            this.stape='visibility';
           break;  
           case 'visibility':
            this.stape='sell';
           break;
           case 'sell':
           this.stape='stocks';    
           break; 
           case 'vente':
            this.stape='comment';
           break;
           case 'stocks':
            this. confirmStock();
           break;               
         default:
        this.saveVisite();
           break;
       }
  }
  saveVisite(){
          this.pointVente.lastvisitedate=this.visite.date;
          this.pointVente.nombre+=1;
          this.pointVente.noVisiteSeaved+=true;
           this.dismiss(this.visite);
  }
  
   confirmStock() {
      let confirm = this.alertCtrl.create({
        title: 'Confirmation',
        message: "Confirmez-vous l'etat des stocks?",
          buttons: [
  
          {
            text: 'Non',
            handler:()=> {           
  
              console.log('Agree clicked');
            }
          },
          {
            text: 'CONTINUER',
            handler:()=> {           
                this.stape='vente';
              console.log('Agree clicked');
            }
          }
        ]
      });
      confirm.present();
    }

     
   stock(situation:any) {
      let confirm = this.alertCtrl.create({
        title: 'Relevé de stock',
        subTitle: situation.produit,
        message: 'Quantité trouvé',
      
         inputs: [
          {
            name: 'stock',
            type: 'number',
            label:'stock en détail',
            placeholder:'stock en trouvé'
         
          }
        ],
  
          buttons: [
          {
            text: 'Annuler',
            handler: () => {
  
              console.log('Disagree clicked');
            }
          },
          {
            text: 'TERMINER',
            handler:  data=> {           
              if(data.stock)
                 situation.stock=data.stock;
               else  
               situation.stock=0;
            
              console.log('Agree clicked');
            }
          }
        ]
      });
      confirm.present();
    }
  

    vente(situation:any) {
      let confirm = this.alertCtrl.create({
        title: 'Vente de produit',
        subTitle: situation.produit,
        message: 'Quantité déposé',
      
         inputs: [
          {
            name: 'stock',
            type: 'number',
            label:'stock déposé',
            placeholder:'stock déposé'
         
          }
        ],
  
          buttons: [
          {
            text: 'Annuler',
            handler: () => {
  
              console.log('Disagree clicked');
            }
          },
          {
            text: 'TERMINER',
            handler:  data=> {           
              if(data.stock)
                 situation.stock=data.stock;
               else  
               situation.stock=0;
            
              console.log('Agree clicked');
            }
          }
        ]
      });
      confirm.present();
    }  
  }