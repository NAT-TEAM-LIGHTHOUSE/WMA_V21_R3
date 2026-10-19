import { isPlatformServer } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[STANDALONE_IMPORTS],
  selector: 'app-themelink',
  templateUrl: './themelink.component.html',
  styleUrls: ['./themelink.component.scss'],

})
export class ThemelinkComponent implements OnInit {
  fontOptions: boolean = false;
  frame:any;
  plt : any;
  fontRange: number;
  fontName: any = "select font";
  settingsStr :any;
  // fontSize: any = "select font size";
userDetails :any;
fontSizeArray = [
{ label: 'Small', value: 0.6 },
    { label: 'Regular (default)', value: 0.7 },
    { label: 'Large', value: 0.9 },
    { label: 'Extra Large', value: 1.0 }
]
  fontWeightArray=[
    {label : 'Regular',value : 500 },
    {label : 'Bold',value : 700 },
  ]
  themeOptions = [
    {
      class: "red-theme-btn",
      value: "theme-red"
    },
    {
      class: "green-theme-btn",
      value: "theme-navyblue"
    },
    {
      class: "blue-theme-btn",
      value: "theme-blue"
    },
    {
      class: "voilet-theme-btn",
      value: "theme-voilet"
    },
    {
      class: "pink-theme-btn",
      value: "theme-Aquablue"
    },
    
    // {
    //   class: "yellow-theme-btn",
    //   value: "theme-yellow"
    // },
    
    
  ]
  bgthemeOptions = [
    {
      class: "default-bgtheme-btn",
      value: "bgtheme-default"
    },
    {
      class: "red-bgtheme-btn",
      value: "bgtheme-red"
    },
    {
      class: "green-bgtheme-btn",
      value: "bgtheme-green"
    },
    {
      class: "blue-bgtheme-btn",
      value: "bgtheme-blue"
    },
    {
      class: "voilet-bgtheme-btn",
      value: "bgtheme-voilet"
    },
    // {
    //   class: "pink-bgtheme-btn",
    //   value: "bgtheme-Aquablue"
    // },
    
    // {
    //   class: "yellow-theme-btn",
    //   value: "theme-yellow"
    // },
    
    
  ]
  layoutOptions = [
    // {
    //   class: "blue-layout-btn-main",
    //   value: "layout_legacymain",
    //   theme: "theme-blue",
    //   title: "Lighthouse leagacy Theme(main)"
    // },
    // {
    //   class: "blue-layout-btn",
    //   value: "layout_legacy",
    //   theme: "theme-blue",
    //   title: "Lighthouse leagacy Theme"
    // },

    {
      class: "mordern-leagacy-btn", 
      value: "mordern-leagacy",
      theme: "theme-red",
      title: "Lighthouse Mordern-Leagacy Theme"
    },
    {
      class: "mordern-leagacy75-btn",
      value: "mordern-leagacy75",
      theme: "theme-red",
      title: "Lighthouse Mordern-Leagacy Theme"
    }
    
  ];
  constructor(public globalObjects : GlobalObjectsService,private modalGlobal : CanvasModalService ,private platform : Platform,private cdr : ChangeDetectorRef,public modalController: ModalController) {
    if(this.globalObjects.layoutFlag){
      return applyLoggingDecorator(this,"themelink")
    }
     this.userDetails = this.globalObjects.getLocallData("userDetails");
   }

  ngOnInit() {
    
        if ( this.platform.is('android')) {
      this.plt = 'android';
    } else if (this.platform.is('ios')) {
      this.plt = 'ios';
    }else{
      this.plt = 'browser';
    }
  }


  toggleTheme(theme: 'light' | 'dark') {
    const body = document.body;
  
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');
  
    // Add the new theme class
    if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      body.classList.add('dark-theme');
    }
  }
  segmentLayout(event) {
    this.globalObjects.appLayout = event.detail.value;
    this.globalObjects.setDataLocally('layoutNew', event.detail.value);
    window.location.reload();
    this.go_page_reload();
    this.changeThemeForLayout(event.detail.value);
  }

  changeThemeForLayout(layoutValue) {

    let selectedLayout = this.layoutOptions.find(layout => layout.value === layoutValue);
    if (selectedLayout) {
      let selectedTheme = selectedLayout.theme; 
      this.globalObjects.appTheme = selectedTheme;
      this.globalObjects.setDataLocally('theme', selectedTheme);
    }
    
  }
  segmentChanged(event) {
    document.getElementById('theme_manage').classList.remove("theme-red");
    document.getElementById('theme_manage').classList.remove("theme-dark");
    this.globalObjects.appTheme = event.detail.value;
    this.globalObjects.setDataLocally('theme', event.detail.value);
  

  }


  go_page_reload() {
  
      let url: any = location;
      window.open(String(url).split('super')[0], '_self');
    }

    fontChanger($size){
      if($size=='zoomEffect5'){
        document.getElementById('sreenWidth').classList.add("zoomEffect5");
        document.getElementById('sreenWidth').classList.remove("zoomEffect4");
        document.getElementById('sreenWidth').classList.remove("zoomEffect3");
        document.getElementById('sreenWidth').classList.remove("zoomEffect2");
        document.getElementById('sreenWidth').classList.remove("zoomEffect1");
      }else{
        if($size=='zoomEffect4'){
        document.getElementById('sreenWidth').classList.add("zoomEffect4");
        document.getElementById('sreenWidth').classList.remove("zoomEffect5");
        document.getElementById('sreenWidth').classList.remove("zoomEffect3");
        document.getElementById('sreenWidth').classList.remove("zoomEffect2");
        document.getElementById('sreenWidth').classList.remove("zoomEffect1");
      }else{
      if($size=='zoomEffect3'){
        document.getElementById('sreenWidth').classList.add("zoomEffect3");
        document.getElementById('sreenWidth').classList.remove("zoomEffect4");
        document.getElementById('sreenWidth').classList.remove("zoomEffect5");
        document.getElementById('sreenWidth').classList.remove("zoomEffect2");
        document.getElementById('sreenWidth').classList.remove("zoomEffect1");
      }else{
        if($size=='zoomEffect2'){
          document.getElementById('sreenWidth').classList.add("zoomEffect2");
          document.getElementById('sreenWidth').classList.remove("zoomEffect4");
        document.getElementById('sreenWidth').classList.remove("zoomEffect5");
          document.getElementById('sreenWidth').classList.remove("zoomEffect3");
         document.getElementById('sreenWidth').classList.remove("zoomEffect1");
        }else{
          if($size=='zoomEffect1'){
            document.getElementById('sreenWidth').classList.add("zoomEffect1");
            document.getElementById('sreenWidth').classList.remove("zoomEffect4");
        document.getElementById('sreenWidth').classList.remove("zoomEffect5");
         document.getElementById('sreenWidth').classList.remove("zoomEffect3");
            document.getElementById('sreenWidth').classList.remove("zoomEffect2");
        
          }
        }
      }
      }
      }
      
      
     }

     themechange($themen){
      if($themen=='theme-red'){
        document.getElementById('theme_manage').classList.add("theme-red");
        document.getElementById('theme_manage').classList.remove("theme-blue");
        document.getElementById('theme_manage').classList.remove("theme-navyblue");
        document.getElementById('theme_manage').classList.remove("theme-all");
        document.getElementById('theme_manage').classList.remove("theme-grey");
        document.getElementById('theme_manage').classList.remove("theme-brown");
        document.getElementById('theme_manage').classList.remove("theme-dark");
        document.getElementById('theme_manage').classList.remove("theme-yellow");
          document.getElementById('theme_manage').classList.remove("theme-voilet");
          document.getElementById('theme_manage').classList.remove("theme-Aquablue");

        
      }else{
        if($themen=='theme-dark'){
          document.getElementById('theme_manage').classList.add("theme-dark");
          document.getElementById('theme_manage').classList.remove("theme-blue");
          document.getElementById('theme_manage').classList.remove("theme-navyblue");
          document.getElementById('theme_manage').classList.remove("theme-all");
          document.getElementById('theme_manage').classList.remove("theme-grey");
          document.getElementById('theme_manage').classList.remove("theme-brown");
          document.getElementById('theme_manage').classList.remove("theme-red");
          document.getElementById('theme_manage').classList.remove("theme-yellow");
          document.getElementById('theme_manage').classList.remove("theme-voilet");
          document.getElementById('theme_manage').classList.remove("theme-Aquablue");
        }
      }

     }
     
     ngOnDestroy(){
      console.clear()
     }




     selectFont(event) {
      if (event.detail.value == "Robot (default)") {
        event.detail.value = "var(--ion-font-family,inherit)";
      }
      this.globalObjects.fontype = event.detail.value;
      this.globalObjects.setDataLocally("fonttype", this.globalObjects.fontype);
      this.globalObjects.changeFont(event.detail.value);
      this.cdr.detectChanges();
    }
  
    resetFont() {
      this.fontRange = 0.9;
    }


  


fontZoom2() {
  // this.globalObjects.fontSize = event.detail.value; 
  this.globalObjects.setDataLocally("fontSize", this.globalObjects.fontSize);
  this.globalObjects.setDataLocally("fontWeight", this.globalObjects.fontWeight);
  this.globalObjects.increFontsize(this.globalObjects.fontSize);
  this.cdr.detectChanges();
}

onFontSelect(value: any) {
  this.globalObjects.fontSize = value;
  this.fontZoom2();
}

onFontWeightSelect(value: any) {
  this.globalObjects.fontWeight = value;

  // If you want same behavior as font size
  this.fontZoom2(); // optional (only if needed)
}

saveThemeSettings() {
  let appkey = this.userDetails.appkey; 
  let user_code =this.userDetails.g_user_type; 
  let themeColor = this.globalObjects.appTheme.replace('theme-', '');
  let layout = this.globalObjects.appLayout;
  let fontSize = this.globalObjects.fontSize;
  let fontWeightVal = this.globalObjects.fontWeight;
  let fontSizeLabel = this.fontSizeArray.find(f => f.value === fontSize)?.label || fontSize;
  let fontWeightLabel = this.fontWeightArray.find(f => f.value === fontWeightVal)?.label.toLowerCase() || fontWeightVal;
  let screenZoom = this.getCurrentScreenZoom(); 
  let themeZoom = layout.includes('75') ? '75%' : '100%';

  this.settingsStr = `appkey~${appkey};user_code~${user_code};theme-color~${themeColor};screen-zoom~${screenZoom};theme-zoom~${themeZoom};font-size~${fontSizeLabel}px;font-weight~${fontWeightLabel};`;

  console.log("String:", this.settingsStr);
  let reqData: any;
    reqData = {
    wslp: this.globalObjects.getLocallData('userDetails'),
    wscp: {
      // apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
      apps_page_frame_seqid: "",
      service_type: "set_theme_personalization",
      ref_cursor_mode: this.globalObjects.refCursorMode,
      platform: this.globalObjects.getLocallData('platformValue'),
      theme_setting_str: this.settingsStr
    },
    wsdp: [],
    wsdpcl: []
  }
   let data={
    reqData:reqData
  }
  this.modalGlobal.popDismiss(data,"theme_close");
}
getCurrentScreenZoom(): string {
  let el = document.getElementById('sreenWidth');
  if (el?.classList.contains('zoomEffect3')) return 'A+';
  if (el?.classList.contains('zoomEffect2')) return 'A-';
  return 'A'; 
}



save(){
    let reqData: any;
    reqData = {
    wslp: this.globalObjects.getLocallData('userDetails'),
    wscp: {
      apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
      service_type: "set_theme_personalization",
      ref_cursor_mode: this.globalObjects.refCursorMode,
      platform: this.globalObjects.getLocallData('platformValue'),
      theme_column_str: this.settingsStr
    },
    wsdp: [],
    wsdpcl: []
  }
}
 bgsegmentChanged(event) {
    document.getElementById('theme_manage').classList.remove("bgtheme-default");
    document.getElementById('theme_manage').classList.remove("bgtheme-red");
    this.globalObjects.bgappTheme = event.detail.value;
    this.globalObjects.setDataLocally('bgtheme', event.detail.value);
  

  }


}

