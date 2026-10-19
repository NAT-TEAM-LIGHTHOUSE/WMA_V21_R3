import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
standalone : true,
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
})
export class VersionComponent implements OnInit {
   
  serverAppBuildVersion:any;
  serverAppBuildDate:any;

  constructor(public globalObjects :GlobalObjectsService,private dataService:DataService) { }

  ngOnInit() { this.getServerAppInfo();}
  getServerAppInfo(){
  let url = 'getbuildInfo';
  // let url ='getbuildInfodata';
    this.dataService.getVersionData1(url)
      .then(res => {
        var data: any = res;
        let resData:any=data.responseMsg.split("#");
        if(resData.length>1){
        this.serverAppBuildDate=resData[0];
        this.serverAppBuildVersion=resData[1];}
      }, err => {
        console.log("server status not get build information of app server.");
        // this.imgData = null;
      })
  }

}
