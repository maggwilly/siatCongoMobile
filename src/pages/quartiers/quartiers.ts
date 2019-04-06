import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams,ViewController,AlertController   } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { isObject } from 'ionic-angular/umd/util/util';
/*
  Generated class for the Select page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'quartier',
  templateUrl: 'quartiers.html'
})
export class QuartiersPage {
  queryText: string;
  newQuartiers:any[]=[];
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController ,
    public alertCtrl: AlertController,
    public storage: Storage, 
    public navParams:NavParams) {

     }

  ionViewDidLoad() {
    this.storage.get('_quartiers').then((data) =>{ 
      this.newQuartiers= data?data:[];

 } );
  }


search() {
         let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
        let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
         this.newQuartiers.forEach(item => {
         item.hide = true;
        this.filter(item, queryWords);
      });

  }
filter(item, queryWords){
let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.nom.toLowerCase().indexOf(queryWord) > -1 ) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
   if(item.isObject(item)) 
     item.hide = !(matchesQueryText );
}

  dismiss(selectedItem?:any) {
       this.viewCtrl.dismiss(selectedItem);
 } 

exist(items, seach):any{
      let item= items.find((item) => {
       return  (item.nom==seach ) ;
      });

 return item;
}

  newQuartier() {
    if(this.exist(this.newQuartiers,this.queryText))
    return  this.dismiss(this.queryText)
    this.newQuartiers.push({nom:this.queryText})
    this.storage.set('_quartiers',this.newQuartiers).then(()=>{
      this.dismiss(this.queryText)
    });
       
  }
}
