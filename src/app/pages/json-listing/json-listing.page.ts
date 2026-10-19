import { isPlatformServer } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-json-listing',
  templateUrl: './json-listing.page.html',
  styleUrls: ['./json-listing.page.scss'],
})
export class JsonListingPage implements OnInit {
  @Input()  value;
  @Input() frame:any={};
  backElement :any
  nextElement :any

  pageno=0;
  from=0;
   to=100;
  displaydata=[];
  head = [];
  heads=[];

  to_num:0;
  from_num: 100;
  dummy=[];

  constructor(private modalCtrl: ModalController,private processData: ProcessDataService, private globalObjects:GlobalObjectsService,@Inject(PLATFORM_ID) private platformId: Object) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"json-listing-page")
    }
   }

  ngOnInit() {
    this.next();
    this.head = Object.keys(this.value[0])
      if (isPlatformServer(this.platformId)) return;
        this.backElement = document.querySelector('#back')
  this.nextElement = document.querySelector('#next')
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

getdata(from,to){
  this.displaydata=[];
  for(let i=from;i<to;i++){
    this.displaydata.push(this.value[i]);
  }
}

next(){
  if(this.value.length>100){
  this.pageno=this.pageno +1;
  let to=this.to*this.pageno;
  let from=to-this.to;

  this.getdata(from,to);
  }
}

previous(){
  if(this.value.length>100){
  this.pageno=this.pageno -1
  let from=this.pageno*this.to;
  let to= from-this.to;
  this.getdata(to,from);
  }
}
}



