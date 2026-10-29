import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { Events } from './events';
import { GlobalObjectsService } from './global-objects.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { PouchDBService } from './pouch-db.service';
import { LhsLibService } from './lhs-lib.service';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { applyLoggingDecorator } from './decorator-application';
import { catchError, filter, merge, Observable, of, take } from 'rxjs';
import { isPlatformServer } from '@angular/common';

// var CryptoJS = require("crypto-js");
import * as CryptoJS from 'crypto-js';
import { EncryptionService } from './encryption.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  base_url = "";
  httpHeaders: any;
  hhtpHeaderVideo: any;
  render: any;
  lat: any;
  longi: any;
  userDetails: any;
  serverName = "lhs";
  // public clicked_frame_seqid: any;
  requestContainer: any = [];

  private _lhs_lib: LhsLibService | null = null;

  constructor(public http: HttpClient,
    private injector: Injector,private encryption : EncryptionService,
    private camera: Camera, private pouchDBService: PouchDBService,
    public globalObjects: GlobalObjectsService, private file: File,
    private mediaCapture: MediaCapture, public device: Device,
    private geolocation: Geolocation, private event: Events,
    @Inject(PLATFORM_ID) private platformId: Object) {

    // this.render = rendererFactory.createRenderer(null, null)
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if (this.globalObjects.serviceFlag) {
      return applyLoggingDecorator(this, "data-service")
    }
  }

  private get lhs_lib(): LhsLibService {
    if (!this._lhs_lib) {
      this._lhs_lib = this.injector.get(LhsLibService);
    }
    return this._lhs_lib;
  }


  getData(url) {
    return new Promise((resolve, reject) => {
      var l_url = this.globalObjects.getScopeUrl() + url;
      this.http.get(l_url)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  getCustData(url) {
    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*'
        })
      };
      this.http.get(url, httpOptions)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  getDataDev(url) {
    return new Promise((resolve, reject) => {
      var l_url = "http://203.193.167.118:9003/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA11G/" + url;
      this.http.get(l_url)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  postDataDev(url, data) {
    return new Promise((resolve, reject) => {
      var l_url = "http://203.193.167.118:9003/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA11G/" + url;
      this.http.post(l_url, data)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }


  getEncryptedValue(data) {
    try {
      const nsdl = CryptoJS.enc.Utf8.parse('Y50tQNNSMcJUppld');
      const ak = CryptoJS.enc.Utf8.parse('Y50tQNNSMcJUppldilokjhuh');
      var encryptedVal = CryptoJS.AES.encrypt(JSON.stringify(data), nsdl, {
        keySize: 16,
        iv: ak,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    }
    catch (e) {
      console.log(e);
    }
    return encryptedVal;
  }//end method



  getDecryptedValue(data): any {
    try {
      const nsdl = CryptoJS.enc.Utf8.parse('Y50tQNNSMcJUppld');
      const ak = CryptoJS.enc.Utf8.parse('Y50tQNNSMcJUppldilokjhuh');
      var decryptedVal = CryptoJS.AES.decrypt(data, nsdl, {
        keySize: 128 / 8,
        iv: ak,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    } catch (e) {
      console.log(e);
    }
    //return decryptedVal.toString(CryptoJS.enc.Utf8);
    return decryptedVal;
  }//end method



  postData(url, reqData) {
    if (reqData.event) {
      delete reqData["event"];
    }


  if(this.globalObjects.dataEncryptFlag){

      if (reqData.wslp) {
        const appKey = this.globalObjects.getLocallData("appKey");
        reqData.wslp = {
          ...reqData.wslp,
          xri: this.encryption.generateRequestId(appKey)
        };
      }
    }

    if (reqData.wscp) {



      if (reqData.wscp.service_type) {
        return new Promise((resolve, reject) => {
          let encFlag = this.globalObjects.encryptFlag ? "ENC" : '';
          var l_url = this.globalObjects.getScopeUrl() + url + "/" + encFlag;

          let dataToSend = this.prePostData(reqData);
          if(l_url.includes("getUserParams") && this.globalObjects.dataEncryptFlag){
              dataToSend = { enc: this.encryption.encryptData(dataToSend) };

          }

          let req = this.http.post(l_url, dataToSend, { 'headers': { 'requestId': new Date().getTime().toString() } })
            .subscribe((data: any) => {

              this.globalObjects.wscp_para = null;

              if (data && data.responseStatus && data.responseStatus.includes("#")) {
                this.globalObjects.sysdateTime = data.responseStatus.split("#")[1];

                let userDetails = this.globalObjects.getLocallData('userDetails');

                if (userDetails && userDetails.g_today_date) {
                  userDetails.g_today_date = this.globalObjects.sysdateTime.split(" ")[0];
                  this.globalObjects.setDataLocally('userDetails', userDetails);
                }

              }

              if (this.globalObjects.logFlag) {
                this.globalObjects.excuted_events_logs.push(`complete s2u of ${dataToSend.wscp.item_name} - ${dataToSend.wscp.apps_page_frame_seqid} :- ${dataToSend.wscp.service_type} , ${new Date().toString().split(" GMT")[0]}`);
              }


              if (data.responseData && data.responseData.length > 0 && data.responseData[0].Level1_Keys) {
                if (l_url.indexOf("S2U") > -1 && this.globalObjects.toggleDevloperMode() && Array.isArray(data.responseData)) {
                  let indexWsSeq = data.responseData ? data.responseData[0].Level1_Keys.indexOf("SAME_WS_SEQID") == -1 ? data.responseData[0].Level1_Keys.indexOf("same_ws_seqid") : data.responseData[0].Level1_Keys.indexOf("SAME_WS_SEQID") : -1;
                  let indexExWsSeq = data.responseData ? data.responseData[0].Level1_Keys.indexOf("EX_WS_SEQID") == -1 ? data.responseData[0].Level1_Keys.indexOf("ex_ws_seqid") : data.responseData[0].Level1_Keys.indexOf("EX_WS_SEQID") : -1;
                  let indexStatus = data.responseData ? data.responseData[0].Level1_Keys.indexOf("status") : -1;
                  let indexMessage = data.responseData ? data.responseData[0].Level1_Keys.indexOf("message") : -1;
                  let ws_seq_no = indexWsSeq > -1 ? data.responseData[0].Values[0][indexWsSeq] : "";
                  let status = indexStatus > -1 ? data.responseData[0].Values[0][indexStatus] : "";
                  let message = indexMessage > -1 ? data.responseData[0].Values[0][indexMessage] : "";
                  //this.globalObjects.logEvents(logObj, indexExWsSeq, ws_seq_no, status ? status : data.responseStatus, message ? message : data.responseMsg);
                } else {

                  // if (this.globalObjects.encryptFlag) {
                  //   let deCodeData = this.getDecryptedValue(data.responseData);
                  //   data.responseData = JSON.parse(deCodeData.toString(CryptoJS.enc.Utf8));
                  // }

                  if (l_url.indexOf("S2U") > -1 && this.globalObjects.toggleDevloperMode()) {
                    let indexWsSeq = data.responseData ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") == -1 ? data.responseData.Level1_Keys.indexOf("same_ws_seqid") : data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : -1;
                    let indexExWsSeq = data.responseData ? data.responseData.Level1_Keys.indexOf("EX_WS_SEQID") == -1 ? data.responseData.Level1_Keys.indexOf("ex_ws_seqid") : data.responseData.Level1_Keys.indexOf("EX_WS_SEQID") : -1;
                    let indexStatus = data.responseData ? data.responseData.Level1_Keys.indexOf("status") : -1;
                    let indexMessage = data.responseData ? data.responseData.Level1_Keys.indexOf("message") : -1;
                    let ws_seq_no = indexWsSeq > -1 ? data.responseData.Values[0][indexWsSeq] : "";
                    let status = indexStatus > -1 ? data.responseData.Values[0][indexStatus] : "";
                    let message = indexMessage > -1 ? data.responseData.Values[0][indexMessage] : "";
                    //this.globalObjects.logEvents(logObj, indexExWsSeq, ws_seq_no, status ? status : data.responseStatus, message ? message : data.responseMsg);
                  }
                }
              }

              resolve(data);

            }, err => {
              //this.globalObjects.logEvents(logObj, "", "", "error", err);
              reject(err);
            })

          this.requestContainer.push({ sub: req, data: dataToSend });
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(reqData);
        })
      }
    } else {
      return new Promise((resolve, reject) => {
        // let dataToSend;
        // if(this.globalObjects.encryptFlag){
        //   dataToSend = this.getEncryptedValue(data);
        // }else{
        //   dataToSend = data;
        // }
        // console.log(JSON.stringify(dataToSend));
        var l_url = this.globalObjects.getScopeUrl() + url;
           if(l_url.includes("getUserParams") && this.globalObjects.dataEncryptFlag){
              reqData = { enc: this.encryption.encryptData(reqData) };
          }
        this.http.post(l_url, reqData)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          })
      })
    }
  }

  stableStringify(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map(this.stableStringify).join(',')}]`;
  }

  return `{${Object.keys(obj)
    .sort()
    .map(key => `${JSON.stringify(key)}:${this.stableStringify(obj[key])}`)
    .join(',')}}`;
}

  prePostData(data) {
    if (!data.wsdptp) {
      data.wsdptp = [];
    }

    data = JSON.parse(JSON.stringify(data));
    let paraFrame;

    if (data && data.wscp && data.wscp.apps_page_frame_seqid) {
      let frame = this.lhs_lib.get_frame_config(data.wscp.apps_page_frame_seqid);
      if (frame) {
        data.wscp.apps_page_frame_name = frame.apps_page_frame_name;
      }
      paraFrame = data.wscp.apps_page_frame_seqid.split("-")[0] + "-PARA";
    } else {
      if (data.wscp && data.wscp.orignal_object_code) {
        paraFrame = data.wscp.orignal_object_code + "-PARA";
      }
    }

    if (data && data.wscp && data.wscp.apps_item_seqid) {
      let item = this.lhs_lib.get_level4_item(data.wscp.apps_item_seqid.replaceAll(".", "&&"));
      if (item) {
        data.wscp.item_name = item.item_name;
      }
    }


    let newDp = [];
    let wsdpcl = data.wsdpcl;
    // if (data.wsdpcl && data.wsdpcl.length > 0 && data.wsdp && data.wsdp.length > 0) {
    //   for (let i = 0; i < data.wsdp.length; i++) {
    //     let isThere = wsdpcl.find(x => JSON.stringify(x) == JSON.stringify(data.wsdp[i]));
    //     if (!isThere) {
    //       newDp.push(data.wsdp[i]);
    //     }
    //   }
    //   data.wsdp = newDp;
    // }

    if (data.wsdpcl?.length && data.wsdp?.length) {

      const existingObjects = new Set(
        data.wsdpcl.map((obj: any) => this.stableStringify(obj))
      );

      data.wsdp = data.wsdp.filter(
        (obj: any) => !existingObjects.has(this.stableStringify(obj))
      );
    }

    let iudArr = [];
    /* For get iud_seqid */
    if (this.lhs_lib.adata.length > 0) {
      for (let tabdata of this.lhs_lib.adata) {
        iudArr.push(tabdata.object.iud_seqid)
        if (tabdata.breadcrumbBar.length > 0) {
          for (let breadcrumbData of tabdata.breadcrumbBar) {
            iudArr.push(breadcrumbData.iud_seqid)
          }
        }
      }

      data.wscp["iud_seqid_str"] = iudArr.join("#") + (data.wscp.iud_seqid && this.lhs_lib.object_mast.iud_seqid != data.wscp.iud_seqid ? "#" + data.wscp.iud_seqid : "");

    } else {
      if (data.wscp) {
        data.wscp["iud_seqid_str"] = (this.lhs_lib.object_mast && this.lhs_lib.object_mast.iud_seqid && data.wscp && data.wscp.iud_seqid) ? this.lhs_lib.object_mast.iud_seqid + "#" + data.wscp.iud_seqid : "";
      }
    }
    // if (this.globalObjects.breadCrumpsArray && this.globalObjects.breadCrumpsArray.length > 0) {
    //   iudArr = this.globalObjects.breadCrumpsArray.reduce((acc, cur) => {
    //     // let isId = acc.find(x => x == cur.iud_seqid);
    //     // if(!isId && cur.iud_seqid){
    //     acc.push(cur.iud_seqid);
    //     // }
    //     return acc;

    //   }, []);

    //   data.wscp["iud_seqid_str"] = iudArr.join("#") + (data.wscp.iud_seqid && this.lhs_lib.object_mast.iud_seqid != data.wscp.iud_seqid ? "#" + data.wscp.iud_seqid : "");
    // } else {
    //   if (data.wscp) {
    //     data.wscp["iud_seqid_str"] = (this.lhs_lib.object_mast && this.lhs_lib.object_mast.iud_seqid && data.wscp && data.wscp.iud_seqid) ? this.lhs_lib.object_mast.iud_seqid + "#" + data.wscp.iud_seqid : "";
    //   }
    // }

    // else {
    //   data.wslp["iud_seqid_str"] = (this.lhs_lib.object_mast && this.lhs_lib.object_mast.iud_seqid && data.wscp.iud_seqid) ? this.lhs_lib.object_mast.iud_seqid +"#"+ data.wscp.iud_seqid : "";
    // }
    if (this.lhs_lib.object_mast && this.lhs_lib.object_mast.iud_seqid) {
      iudArr.push(this.lhs_lib.object_mast.iud_seqid);
    }
    if (data.wscp && data.wscp.iud_seqid) {
      iudArr.push(data.wscp.iud_seqid);
    }

    data.lwsdp = this.globalObjects.lwsdp;

    let uniqId = new Set(iudArr);
    data.wscp["iud_seqid_str"] = [...uniqId].join("#");

    data.wscp.encryptedData = this.globalObjects.encryptFlag;
    // data.wscp.COL1 = this.clicked_frame_seqid;

    data.wscp.ref_cursor_mode = (this.globalObjects.refCursorMode) ? 'T' : 'F';

    delete data.wscp['flag'];

    data.wscp.iud_seqid = data.wscp.iud_seqid ? data.wscp.iud_seqid : (this.lhs_lib.object_mast && this.lhs_lib.object_mast.iud_seqid ? this.lhs_lib.object_mast.iud_seqid : "");


    data.wscp.developer_mode = this.globalObjects.toggleDevloperMode() ? "Y" : "N";

    let dataToSend = data;

    if (this.globalObjects.wscp_para) {

      dataToSend = JSON.parse(JSON.stringify(dataToSend));
      dataToSend.wscp = { ...dataToSend.wscp, ...this.globalObjects.wscp_para };

    }

    if (this.globalObjects.logFlag) {
      this.globalObjects.excuted_events_logs.push(`calling s2u for ${dataToSend.wscp.item_name} - ${dataToSend.wscp.apps_page_frame_seqid} :- ${dataToSend.wscp.service_type} , ${new Date().toString().split(" GMT")[0]}`);
    }


       if (this.globalObjects.dataEncryptFlag) {
      if (dataToSend.wscp) {
        dataToSend.wscp = { enc: this.encryption.encryptData(dataToSend.wscp) };
      }
      if (dataToSend.wslp) {
        dataToSend.wslp = { enc: this.encryption.encryptData(dataToSend.wslp) };
      }
    }


    return dataToSend
  }

  terminateAllRequest() {

    return new Promise((resolve, reject) => {
      let index = 1;
      let status = true;
      for (let req of this.requestContainer) {
        if (!req.sub.closed) {
          status = false;
        }

        req.sub.unsubscribe();

        if (req.data && req.data.wscp) {
          if (req.data.wscp.service_type && (req.data.wscp.service_type.toLowerCase().includes("execute_query") || req.data.wscp.service_type.toLowerCase().includes("populate_from_procedure"))) {
            let frame = this.lhs_lib.get_frame_config(req.data.wscp.apps_page_frame_seqid);

            if (frame) {
              frame.loading = false;
            }
          }
        }

        if (index == this.requestContainer.length) {
          this.requestContainer = [];
          this.globalObjects.hideLoadingNew();
          resolve(status);
        }
        index++;
      }
      // setTimeout(() => {
      this.globalObjects.hideLoadingNew();
      // }, 0.5)

    })
  }

  uploadFileToServer(file, path) {
    return new Promise((resolve, reject) => {
      let url = this.globalObjects.getScopeUrl() + "uploadFiles?path=" + path;
      const formData = new FormData();
      formData.append('file', file);
      this.http.post(url, formData).subscribe((res: any) => {
        if (res.responseStatus == "succcess") {
          resolve(res);
        } else {
          this.globalObjects.presentAlert(res.responseMsg);
          reject(res);
        }
      }, (err) => {
        reject(err);
      })
    })
  }

  postDataLhsServer(url, data) {
    return new Promise((resolve, reject) => {

      this.getDataFromLHS(url, data).then((res) => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  getDataFromLHS(url, data) {

    // return new Promise((resolve, reject) => {
    //   let MainUrl=environment.lhsServerUrl[0] + url
    //   let awsUrl = environment.lhsServerUrl[1] + url;
    //   let lhsUrl = environment.lhsServerUrl[2] + url;
    //   let lhsUrlNew = environment.lhsServerUrl[3] + url;
    //   let reqStatus = true;
    //   let errorCount = 0;
    //   this.http.post(lhsUrl, data).subscribe((res: any) => {
    //     if (reqStatus && res.responseStatus == 'success') {
    //       resolve(res);
    //       reqStatus = false;
    //     } else {
    //       errorCount++;
    //       if (errorCount == 3) {
    //         resolve(res);
    //       }
    //     }
    //   }, (error) => {
    //     errorCount++;
    //     if (errorCount == 3) {
    //       reject();
    //     }
    //   });
    //   this.http.post(awsUrl, data).subscribe((res: any) => {
    //     if (reqStatus && res.responseStatus == 'success') {
    //       resolve(res);
    //       reqStatus = false;
    //     } else {
    //       errorCount++;
    //       if (errorCount == 3) {
    //         resolve(res);
    //       }
    //     }
    //   }, (error) => {
    //     errorCount++;
    //     if (errorCount == 3) {
    //       reject();
    //     }
    //   });



    //   this.http.post(lhsUrlNew, data).subscribe((res: any) => {
    //     if (reqStatus && res.responseStatus == 'success') {
    //       resolve(res);
    //       reqStatus = false;
    //     } else {
    //       errorCount++;
    //       if (errorCount == 3) {
    //         resolve(res);
    //       }
    //     }
    //   }, (error) => {
    //     errorCount++;
    //     if (errorCount == 3) {
    //       reject();
    //     }
    //   });
    //      this.http.post(MainUrl, data).subscribe((res: any) => {
    //     if (reqStatus && res.responseStatus == 'success') {
    //       resolve(res);
    //       reqStatus = false;
    //     } else {
    //       errorCount++;
    //       if (errorCount == 3) {
    //         resolve(res);
    //       }
    //     }
    //   }, (error) => {
    //     errorCount++;
    //     if (errorCount == 3) {
    //       reject();
    //     }
    //   });

    // })
    let MainUrl = environment.lhsServerUrl[0] + url
    let awsUrl = environment.lhsServerUrl[1] + url;
    let lhsUrl = environment.lhsServerUrl[2] + url;
    let lhsUrlNew = environment.lhsServerUrl[3] + url;
    let localUrl = window.location.origin + '/lhsws_wma2/' + url;
    const urls = [MainUrl, awsUrl, lhsUrl, lhsUrlNew, localUrl];
    let datapost = ""
    let localData = {
      ...data, local_app_key: this.globalObjects.propertiesFlag ? "T" : "F"
    };
    return merge(
      ...urls.map(url => {
        const datapost = url === localUrl ? localData : data;
        return this.http.post(url, datapost).pipe(
          catchError(() => of(null)),
          filter((res: any) => res?.responseStatus === 'success' || res?.responseStatus === 'error')
        )
      }
      )
    ).pipe(take(1)).toPromise();
  }

  takePhoto(column_name, flag) {

    return new Promise((resolve, reject) => {
      var sourceType: any;
      if (flag == "PHOTOLIBRARY") {
        sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
      } else {
        sourceType = this.camera.PictureSourceType.CAMERA;
      }
      const options: CameraOptions = {
        quality: 40,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 450,
        targetHeight: 450,
        saveToPhotoAlbum: false,
        correctOrientation: true,


      };
      this.camera.getPicture(options).then(
        imageData => {
          resolve(imageData);
        }, (err) => {
          alert(JSON.stringify(err));
        })
    })
  }


  takeVideoFromGallay() {
    return new Promise((resolve, rejects) => {
      const options: CameraOptions = {
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        mediaType: this.camera.MediaType.VIDEO,
        targetHeight: 1,
      };
      this.camera.getPicture(options).then(
        async (videoUrl: any) => {
          resolve(videoUrl)

        }, (err) => {
          alert(JSON.stringify(err));
        })
    })
  }

  ///////////////////////////////////// Compress Base64 Image //////////////////////////////////////
  compress(imageDataUrlSource, ratio, quality) {
    return new Promise((resolve, reject) => {

      quality = quality / 100;
      ratio = ratio / 100;
      const sourceImage = new Image();
      sourceImage.onload = (
        () => {
          const canvas = this.render.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let w;
          let h;
          w = sourceImage.naturalWidth;
          h = sourceImage.naturalHeight;

          canvas.width = w * ratio;
          canvas.height = h * ratio;
          ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
          const mime = imageDataUrlSource.substr(5, imageDataUrlSource.split(';')[0].length - 5);
          const result = canvas.toDataURL(mime, quality);
          resolve(result);
        });
      sourceImage.src = imageDataUrlSource;

    });
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  setmultiLOVvalue(fields, lov) {
    return new Promise((resolve, reject) => {
      var lovCount = 0;
      for (let obj of fields) {
        obj.value = '';
        obj.codeOfValue = ''
        for (let obj1 of lov) {
          if (obj1.checked) {
            if (obj.value == '' || obj.value == null) {
              obj.value = obj1.name;
              obj.codeOfValue = obj1.code;
            } else {
              obj.value = obj.value + ", " + obj1.name;
              obj.codeOfValue = obj.codeOfValue + ", " + obj1.code;
            }
            lovCount = lovCount + 1;
          }
        }
        obj.itemSelected = lovCount;
        resolve(obj.value);
      }
    })
  }

  takeVideo() {
    return new Promise((resolve, reject) => {
      let directoryPath = "";
      let platformVal = this.globalObjects.getPlatformValue();
      if (platformVal) {
        if (platformVal == 'ios') {
          directoryPath = this.file.documentsDirectory;
        } else {
          directoryPath = this.file.externalRootDirectory;
        }
      } else {
        directoryPath = this.file.externalRootDirectory;
      }
      let options: CaptureVideoOptions = {
        limit: 1,
        quality: 0,
        duration: 30000
      }
      this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
        let capturedFile = res[0];
        let fileName = capturedFile.name;
        let dir = capturedFile['localURL'].split('/');
        dir.pop();
        let fromDirectory = dir.join('/');
        let toDirectory = directoryPath + "LHSAPP";
        this.file.createDir(directoryPath, "LHSAPP", false).then(result => {
          var pathval = toDirectory + "/";
          this.file.moveFile(fromDirectory, fileName, toDirectory, fileName).then(result => {
            this.file.readAsDataURL(pathval, fileName).then(result => {
              resolve(result);
            }, (err) => {
              // alert(err);
            });
          });
        }, (err) => {
          var pathval = toDirectory + "/";
          this.file.moveFile(fromDirectory, fileName, toDirectory, fileName).then(result => {
            this.file.readAsDataURL(pathval, fileName).then(result => {
              resolve(result);
            }, (err) => {
            });
          });
        })
      })
    })
  }

  saveEntryToLocalDB(nextPageInfo) {
    return new Promise((resolve, reject) => {
      var formData: any = {};
      var object_code = nextPageInfo.wscp.object_code;
      var _id = object_code;
      this.pouchDBService.getObject(_id).then(data => {
        let resData: any = data;
        formData = resData;
        formData._id = resData._id;
        if (formData.entryList) {
          formData.entryList.push(nextPageInfo);
        } else {
          formData.entryList = [];
          formData.entryList.push(nextPageInfo);
        }
        formData.count = formData.entryList.length;
        this.pouchDBService.put(_id, formData);
        resolve("success");
      }, err => {
        formData._id = _id;
        formData.entryList = [];
        formData.entryList.push(nextPageInfo);
        formData.count = formData.entryList.length;
        this.pouchDBService.put(_id, formData);
        resolve("success");
      })
    })
  }

  deleteEntry(nextPageInfo, index) {
    return new Promise((resolve, reject) => {
      var formData: any = {};
      var object_code = nextPageInfo.wscp.object_code;
      var _id = object_code;
      this.pouchDBService.getObject(_id).then(data => {
        formData = data;
        formData.entryList.splice(index, 1);
        formData.count = formData.entryList.length;
        this.pouchDBService.put(_id, formData);
        resolve("sucess");
      }, err => { reject('error') })
    })
  }

  deleteAllEntry(nextPageInfo) {
    return new Promise((resolve, reject) => {
      var formData: any = {};
      var object_code = nextPageInfo.wscp.object_code;
      var _id = object_code;
      this.pouchDBService.getObject(_id).then(data => {
        formData = data;
        formData.entryList = [];
        formData.count = formData.entryList.length;
        this.pouchDBService.put(_id, formData);
        resolve("sucess");
      }, err => { reject('error') })
    })
  }

  getlocation() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.longi = resp.coords.longitude;
        resolve("");
      }).catch((error) => {
      })
    });

  }


  postMultipartData(url, data, videoType, filePath) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', data);
      formData.append('videoType', videoType);
      formData.append('filePath', filePath);
      var l_url = this.globalObjects.getScopeUrl() + url;
      //console.log(l_url);
      let oReq = new XMLHttpRequest();
      oReq.open("POST", l_url, true);
      //console.log("ResStatus: " + oReq.status);
      oReq.responseType = "json";

      oReq.onreadystatechange = (oEvent) => {
        if (oReq.readyState === 4) {

          if (oReq.status === 200) {
            oReq.onload = (oEvent) => {
              resolve(oReq.response);
            }
          } else if (oReq.status === 300) {
            oReq.onload = (oEvent) => {
              resolve(oReq.response);
            }
          } else if (oReq.status === 400) {
            oReq.onload = (oEvent) => {
              resolve(oReq.response);
            }
          } else if (oReq.status === 404) {
            oReq.onload = (oEvent) => {
              resolve(oReq.response);
            }
          } else {
            resolve(oReq.response);
          }
        }
      };
      oReq.send(formData);
    })
  }

  getVersionData1(url) {
    return new Promise((resolve, reject) => {
      var l_url = this.globalObjects.getScopeUrl() + url;
      this.http.get(l_url)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }


  downloadCsv(requestData: any, url: string, filename: string): void {

    let dataToSend = this.prePostData(requestData);
    const l_url = this.globalObjects.getScopeUrl() + url;
    this.globalObjects.wscp_para = null;
    this.http
      .post(l_url, dataToSend, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          // console.log(blob.size);
          if (blob.size > 0) {
            if (isPlatformServer(this.platformId)) return;
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(objectUrl);
          } else {
            alert("file dont have any content");
          }
        },
        error: (err) => {
          console.error('Error while downloading CSV:', err);
          // Optional: Show user-friendly error message
          alert('Failed to download the CSV file. Please try again.');
        }
      });

  }



  localHostPostMethod(url, dataValue) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.post(url, dataValue, { responseType: 'text' })
        .subscribe((data: any) => {
          resolve(data);
          // // Try to parse the data as JSON if possible
          // try {
          //   // Check if the response looks like valid JSON
          //   const parsedData = JSON.parse(data);
          //   resolve(parsedData);  // Resolving parsed JSON if it's valid
          // } catch (e) {
          //   // If not valid JSON, return the raw text
          //   resolve(data);  // Resolving raw text if JSON parsing fails
          // }
        }, err => {
          reject(err);
        })
    })
  }


  developerLogSend(url, dataValue) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      let l_url = this.globalObjects.getScopeUrl() + url
      this.http.post(l_url, dataValue, { responseType: 'text' })
        .subscribe((data: any) => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  ////////////////////////////log//////////////////////
  postLogData(requestData: any, url?: any): Observable<any> {
    url = "savebrowserLog"
    let l_url = this.globalObjects.getScopeUrl() + url
    return this.http.post<any>(`${l_url}`, requestData);
  }


  /////////////////////////////////////////////////////////

  // Direct Login

  getDataDirect(url) {
    return new Promise((resolve, reject) => {
      // var l_url = this.globalObjects.getScopeUrl() + url;
      this.http.get(url)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  executeSelectQuery(query: any, urlendPoint: any): Observable<any> {
    let url = this.globalObjects.getScopeUrl() + urlendPoint;
    return this.http.post<any>(url, query);
  }

  fileViewerUrl(url, dataValue) {
    return new Promise((resolve, reject) => {
      this.http.post(url, dataValue)
        .subscribe((data: any) => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  authFactor(endpoint, dataValue) {
    return new Promise((resolve, reject) => {
      let url = this.globalObjects.getScopeUrl() + endpoint
      this.http.post(url, dataValue)
        .subscribe((data: any) => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }
  getDataA(url) {
    return new Promise((resolve, reject) => {

      this.http.get(url, { responseType: 'text' })
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }
  postRequest(url, data) {
    return new Promise((resolve, reject) => {
      // var l_url = this.globalObjects.getScopeUrl() + url;
      this.http.post(url, data)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }



  processRequest(url, data) {
    return new Promise((resolve, reject) => {
      let l_url = this.globalObjects.getScopeUrl() + url
      this.http.post(l_url, data)
        .subscribe(data => {
          this.globalObjects.wscp_para = null;
          resolve(data);
        }, err => {
          reject(err);
          this.globalObjects.wscp_para = null;
        })
    })
  }
}
