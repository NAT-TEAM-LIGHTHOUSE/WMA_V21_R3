import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalObjectsService } from './global-objects.service';

@Injectable({
  providedIn: 'root'
})
export class ChatAiService {
  constructor(private http: HttpClient,private globalObject : GlobalObjectsService) { }
  // private fetchUrl="http://192.168.101.88:5001";
  // // private fetchUrl="http://103.100.15.246:5001";
  private fetchUrl="https://ai.lighthouseindia.com";
  private fetchUrlend="/ai/api/table-gpt";

  sendChatRequest(prompt: string, mode: string,url): Observable<any> {
    let madeurl=this.getUrl();
    console.log("made url : ",madeurl);
    console.log("final url : "+madeurl+url);
    let finalurl=madeurl+url;
    const body = prompt;
    return this.http.post(finalurl, body);
  }
  getListVal(prompt: string, mode: string,url): Observable<any> {
    let madeurl=this.getUrl();
    console.log("made url : ",madeurl);
    console.log("final url : "+madeurl+url);
    let finalurl=madeurl+url;
    const body = prompt;
    return this.http.post(finalurl, body);
  }
  getUrl():string{
    // let temurl:any=this.globalObject.getScopeUrl().split("/")
    // const url = this.globalObject.getScopeUrl().split(String(temurl[3]))[1];
    // let urlfinal=this.fetchUrl+this.fetchUrlend;
        let userDetail=this.globalObject.getLocallData("userDetails");
        let urlfinal;

        if(userDetail && userDetail["g_table_gpt_url_new"]){
          urlfinal=userDetail["g_table_gpt_url_new"];
        }

        // urlfinal= "http://192.168.101.88:5010/api/agentai/table_gpt"
        // urlfinal="http://192.168.101.88:5010/api/agentai/table_gpt";
                // urlfinal="http://192.168.100.232:5010/api/genai/table_gpt";

    return urlfinal
  }


  posthistoryData(requestData: any, url?: any) {
    // this.setUrl();
    let base_url=this.globalObject.getLocallData("scopeUrl");
    let tbl_url=base_url+"tablegpt/save_user_query";
    return this.http.post<any>(`${tbl_url}`, requestData);
  }
  gethistoryData(requestData: any, url?: any) {
    // this.setUrl();
let base_url=this.globalObject.getLocallData("scopeUrl");
    let tbl_url=base_url+"tablegpt/get_user_query";
        return this.http.post<any>(`${tbl_url}`, requestData);
  }
insertLog(requestData: any, url?: any) {
    // this.setUrl();
let base_url=this.globalObject.getLocallData("scopeUrl");
    let tbl_url=base_url+"tablegpt/insert_log";
        return this.http.post<any>(`${tbl_url}`, requestData);
  }


deleteSession(requestData: any, url?: any) {
    // this.setUrl();`
// let base_url=this.globalObject.getLocallData("scopeUrl");
    // let tbl_url="http://192.168.101.88:5010/api/agentai/table_gpt/session/delete";
    let tbl_url=this.getUrl()+"/session/delete";
        return this.http.post<any>(`${tbl_url}`, requestData);
  }
  }