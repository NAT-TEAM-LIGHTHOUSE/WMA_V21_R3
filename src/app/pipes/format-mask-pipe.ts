import { Injector, Pipe, PipeTransform, Injectable } from '@angular/core';
import { LhsLibService } from '../services/lhs-lib.service';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'formatMask',
  standalone : true
})
export class FormatMaskPipe implements PipeTransform {

 symbolArr = [",", "~", " ", "!", "@", "#", "$", "%", "^", "&", "*", "-", "=", "|", ":", "/", "?"];


  private lhs_lib: LhsLibService

  constructor(private injector: Injector) {

  }

  transform(value: any, formatMast: any): any {

    let isNegative: boolean = false;

    if (!this.lhs_lib) {
      this.lhs_lib = this.injector.get(LhsLibService)
    }

    if (!value) return value;

    if (formatMast && value != undefined && value != null) {

      // set new format mask for rate/amt
      if (formatMast && (formatMast.endsWith('999.99'))) {

        let new_format_mast = formatMast;
        let G_AMT_FORMAT = this.lhs_lib.get_item_value("g_get_amt_format", null);
        let G_CURRENCY_DECIMAL = this.lhs_lib.get_item_value("g_get_amt_decimal", null);

        if (G_AMT_FORMAT == 'L') {
          new_format_mast = '999999,99,99,999';
        } else if (G_AMT_FORMAT == 'M') {
          new_format_mast = '99999,999,999,999';
        }

        else if (G_CURRENCY_DECIMAL) {
          new_format_mast = new_format_mast.split(".")[0];
        }

        if (formatMast.includes('%999.99999')) {
          new_format_mast = new_format_mast + '.99999';
        } else {
          if (G_CURRENCY_DECIMAL == 2) {
            new_format_mast = new_format_mast + '.99';
          } else if (G_CURRENCY_DECIMAL == 3) {
            new_format_mast = new_format_mast + '.999';
          } else if (G_CURRENCY_DECIMAL == 0) {
            new_format_mast = new_format_mast + '';
          } else if (G_CURRENCY_DECIMAL == 1) {
            new_format_mast = new_format_mast + '.9';
          }
        }

        formatMast = new_format_mast;

      }

      let formatSymbol = ",";

      for (let s of this.symbolArr) {
        if (formatMast.indexOf(s) > -1) {
          formatSymbol = s;
          break;
        }
      }

      if (typeof (value) == 'number') {
        value = value.toString();
        if (value && value.indexOf(formatSymbol) > -1) {
          value = value.replaceAll(formatSymbol, "");
        } else {
          if (value && value.indexOf(formatSymbol) > -1) {
            value = value.replaceAll(formatSymbol, "");
          }
        }
      }

      if (value < 0) {
        // value = -1 * value;
        value = value.replace("-","");
        isNegative = true;
      }

      let format = formatMast;
      let toFixed = (format.length - 1) - format.indexOf(".");
      format = format.split(".")[0];

      let posisionArray: any = [];
      let tempValue = value;
      let decimalVal = "";
      let wholeVal = "";

      if (toFixed == formatMast.length) {
        toFixed = 0;
        wholeVal = isNaN(parseInt(value)) ? value : parseInt(value).toString();
      } else {
        if (formatMast.indexOf(".") > -1) {
          value = isNaN(parseFloat(value)) ? value : parseFloat(value).toFixed(toFixed).toString();
        } else {
          value = isNaN(parseInt(value)) ? value : parseInt(value).toString();
        }
        decimalVal = (value.indexOf(".") > -1) ? value.split(".")[1] : "";
        wholeVal = value.split(".")[0];
      }

      for (let i = 0; i < 10; i++) {
        if (format.indexOf(formatSymbol) > -1) {
          let count = (format.length - 1) - format.lastIndexOf(formatSymbol);
          if (count) {
            posisionArray.push(count)
            format = format.slice(0, format.lastIndexOf(formatSymbol));
          }
        } else if (posisionArray.length == i) {
          posisionArray.push(format.length)
          break;
        }
      }

      let valArr = Array.from(wholeVal);
      valArr.reverse();
      let indexValue = 0
      for (let j = 0; j < wholeVal.length; j++) {
        if (posisionArray[j] && valArr.indexOf(formatSymbol) < 0) {
          indexValue = indexValue + posisionArray[j];
          valArr.splice(indexValue, 0, formatSymbol);
          indexValue++;
        } else if (posisionArray[j]) {
          indexValue = indexValue + posisionArray[j];
          valArr.splice(indexValue, 0, formatSymbol);
          indexValue++;
        } else if ((valArr.length - valArr.lastIndexOf(formatSymbol)) > posisionArray[posisionArray.length - 1]) {
          indexValue = indexValue + posisionArray[posisionArray.length - 1];
          valArr.splice(indexValue, 0, formatSymbol);
          indexValue++;
        }
      }
      valArr.reverse();
      let str = "";
      for (let s of valArr) {
        str = str + s;
      }
      wholeVal = str;
      for (let k = 0; k < wholeVal.length; k++) {
        if (wholeVal.indexOf(formatSymbol) == 0) {
          wholeVal = wholeVal.slice(1, wholeVal.length);
        }
        if (wholeVal.lastIndexOf(formatSymbol) == (wholeVal.length - 1)) {
          wholeVal = wholeVal.slice(0, wholeVal.length - 1);
        }
      }

      if (isNegative) {
        // wholeVal = (parseFloat(wholeVal) * -1).toString();
        wholeVal = "-" + wholeVal;
      }

      if (formatMast.indexOf(".") > -1) {
        tempValue = wholeVal + "." + decimalVal;
      } else {
        tempValue = wholeVal;
      }

      return tempValue;
    } else {
      return value;
    }
  }

}
