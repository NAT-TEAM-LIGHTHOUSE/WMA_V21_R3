import { Injectable } from '@angular/core';

var CryptoJS = require("crypto-js");
@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  constructor() { }
  getEncryptedValue(panno) {
    try {
      const nsdl = CryptoJS.enc.Utf8.parse('Y50tQNNSMcJUppld');
      const ak = CryptoJS.enc.Utf8.parse('Y50tQNNSMcJUppldilokjhuh');
      var encryptedVal = CryptoJS.AES.encrypt(panno, nsdl, {
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

  getDecryptedValue(panno): any {
    try {
      const nsdl = CryptoJS.enc.Utf8.parse('Y50tQNNSMcJUppld');
      const ak = CryptoJS.enc.Utf8.parse('Y50tQNNSMcJUppldilokjhuh');
      var decryptedVal = CryptoJS.AES.decrypt(panno, nsdl, {
        keySize: 128 / 8,
        iv: ak,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    } catch (e) {
      console.log(e);
    }
  return decryptedVal;
  }//end method
}
