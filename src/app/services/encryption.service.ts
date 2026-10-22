import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

 



//   SECRET_KEY = '1234567890123456';

//    key = CryptoJS.enc.Utf8.parse(this.SECRET_KEY);
//    iv = CryptoJS.enc.Utf8.parse(this.SECRET_KEY);
  
//   encryptData(data: string): string {
//     const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), this.key, {
//       mode: CryptoJS.mode.ECB, 
//       padding: CryptoJS.pad.Pkcs7,
//       iv: this.iv 
//     });
//     // return encrypted.toString();
    
//     let encryptedData=encrypted.toString();
//     return encryptedData.replaceAll("/","-").replaceAll("+", "_");

//     // return encodeURIComponent(encrypted.toString());

//   }
  
//   decryptData(encryptedData: string): string {
//     encryptedData=encryptedData.replaceAll("-","/").replaceAll("_", "+")
//     const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7,
//       iv: this.iv
//     });
//     return decrypted.toString(CryptoJS.enc.Utf8);
//   }
// }

private SECRET_KEY = 'a3f1e78c3b6d4f09b9c2a8d7f60e451234567890abcdef01234567890abcdef';
     private readonly characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     private getKeyAndIV() {
       const key = CryptoJS.enc.Utf8.parse(this.SECRET_KEY.substring(0, 32));
       const iv = CryptoJS.enc.Utf8.parse(this.SECRET_KEY.substring(0, 16));
       return { key, iv };
     }
     
     encryptData(data: any): string {
       const { key, iv } = this.getKeyAndIV();
       const jsonStr = JSON.stringify(data);
       let encrypted:any = CryptoJS.AES.encrypt(jsonStr, key, {
         iv: iv,
         mode: CryptoJS.mode.CBC,
         padding: CryptoJS.pad.Pkcs7,
       });
      //  return encrypted.toString();
      encrypted= encrypted.toString().replaceAll("/","-").replaceAll("+", "_")
       return encrypted;

     }
     
     decryptData(encryptedData: string): any {
      try {
       encryptedData = encryptedData.split("-").join("/").split("_").join("+");
         const { key, iv } = this.getKeyAndIV();
         const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
           iv: iv,
           mode: CryptoJS.mode.CBC,
           padding: CryptoJS.pad.Pkcs7,
         });
         return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
       } catch (error) {
         return { error: 'Decryption failed' };
       }
     }

     decryptString(encryptedData: string): string {
      try {
        encryptedData = encryptedData.split("-").join("/").split("_").join("+");
        const { key, iv } = this.getKeyAndIV();
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        if (!plaintext) {
          return '';
        }

        try {
          const parsed = JSON.parse(plaintext);
          return typeof parsed === 'string' ? parsed : plaintext;
        } catch {
          return plaintext;
        }
      } catch (error) {
        return '';
      }
     }

generateRequestId(appKey: string): string {
  if (!appKey || appKey.length < 3) {
    throw new Error('Invalid APPKEY');
  }

  const randomKey = this.randomString(16);
  const as1 = appKey.charCodeAt(1);
  const as2 = appKey.charCodeAt(3);
  const as3 = appKey.charCodeAt(appKey.length - 2);
  const splitAscii = (value: number): string[] => value.toString().split('');
  const a1 = splitAscii(as1);
  const a2 = splitAscii(as2);
  const a3 = splitAscii(as3);
  const randomChars2 = this.randomString(2);
  const randomChars3 = this.randomString(3);
  const asciiTwo = Array.from(randomChars2, c => c.charCodeAt(0));
  const asciiThree = Array.from(randomChars3, c => c.charCodeAt(0));
  const timestamp = Date.now().toString();
  const firstPart = timestamp.substring(0, 4);
  const secondPart = timestamp.substring(4, 8);
  const thirdPart = timestamp.substring(8);

  const parts = [a2[1],randomKey,asciiThree[1],thirdPart,a3[0],asciiTwo[0],firstPart,a1[0],secondPart,asciiThree[2],
  a3.slice(1).join(''),asciiTwo[1],asciiThree[0],a1.slice(1).join('')];

  const payload = parts.join(':');

  console.log('Generated request ID:', payload);

  return payload;
}

  private randomString(length: number): string {
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    let result = '';

    for (const value of randomValues) {
      result += this.characters[value % this.characters.length];
    }

    
    return result;
  }
     
}