import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular/standalone';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-helplink',
  templateUrl: './helplink.component.html',
  styleUrls: ['./helplink.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class HelplinkComponent implements OnInit {

  constructor(public platform : Platform,private iab : InAppBrowser) { }

  ngOnInit() {
     const url = "http://192.168.100.25:8787/layout.html#";

    // If running inside Android/iOS app → open InAppBrowser
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.iab.create(url, "_blank", {
        location: 'no',
        toolbar: 'yes'
      });
    }}
  ngOnDestroy(){
    console.clear()
   }
}
