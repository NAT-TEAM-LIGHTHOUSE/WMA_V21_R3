import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import SignaturePad from 'signature_pad';
import { ModalController } from '@ionic/angular/standalone';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements AfterViewInit {
 @ViewChild('signatureCanvas',{static : true})
 canvasEl!: ElementRef<HTMLCanvasElement>;
 signaturePad !: SignaturePad;


 constructor(private modal :ModalController){

 }

 ngAfterViewInit(){
 const canvas = this.canvasEl.nativeElement;
 canvas.width = window.innerWidth -20;
 canvas.height = 250;
 this.signaturePad = new SignaturePad(canvas, {
  minWidth : 1,
  maxWidth : 3,
  penColor : 'black'
 });
 }

  drawComplete(){
     if(this.signaturePad.isEmpty()){
    alert("please sign");
    return;
   }
   const signatureData = this.signaturePad.toDataURL('image/png');
   console.log(signatureData);
    this.modal.dismiss(signatureData);

  }
  drawClear(){
  this.signaturePad.clear()
  }
  dismissModal(){
    this.modal.dismiss(null);
    
  }

}
