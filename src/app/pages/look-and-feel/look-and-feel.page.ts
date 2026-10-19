import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-look-and-feel',
  templateUrl: './look-and-feel.page.html',
  styleUrls: ['./look-and-feel.page.scss'],
})
export class LookAndFeelPage implements OnInit {

  fontFamily = [
    {
      name: "Roboto",
      value:"Roboto, 'Helvetica Neue', sans-serif"
    },
    {
      name: "Noto Sans Mono",
      value:"'Noto Sans Mono', monospace"
    },
    {
      name: "Rubik",
      value:"'Rubik', sans-serif"
    },
    {
      name: "Saira",
      value:"'Saira', sans-serif"
    },
  ]

  fontSize:any;
  fontWeight:any;
  letterSpacing:any;
  margin:any;
  padding:any;
  ftFamily:any;

  fontFamilyChange:any;
  
  constructor(private modalCtrl: ModalController, public globalObjects: GlobalObjectsService,@Inject(PLATFORM_ID) private platformId: Object) { 
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"look-and-feel-page")
    }
  }

  ngOnInit() {
      if (isPlatformServer(this.platformId)) return;
    var r = document.querySelector(':root');
    let rs = getComputedStyle(r);

    this.fontSize =  rs.getPropertyValue('--minFontSize');
    this.fontWeight =  rs.getPropertyValue('--fontWeight');
    this.letterSpacing =  rs.getPropertyValue('--fontLetterSpacing2x');
    this.margin =  rs.getPropertyValue('--margin');
    this.padding =  rs.getPropertyValue('--padding');
    this.ftFamily =  rs.getPropertyValue('--fontFamilyNoto');
  }

  closePage() {
    this.modalCtrl.dismiss();
  }

  changeStyle(name?,value?) {
      if (isPlatformServer(this.platformId)) return;
    document.documentElement.style.setProperty(name, value);
  }

  resetSetting(){}
  

}
