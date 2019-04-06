import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SauvegardePage } from './sauvegarde'


@NgModule({
  declarations: [
    SauvegardePage,
  ],
  imports: [
    IonicPageModule.forChild(SauvegardePage),
  ],
})
export class SauvegardePageModule {}
