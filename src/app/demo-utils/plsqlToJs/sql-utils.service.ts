import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SqlUtilsService {

    mon = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

    constructor() { }


    // round(obj: any, obj1: any) {
    //     if (obj1 === "undefined" || obj1 === "null" || !obj1) {
    //         return Math.round(obj);
    //     } else {
    //         if (typeof (obj) == 'number') {
    //             let a = obj.toFixed(obj1)
    //             return parseFloat(a);
    //         } else {
    //             let a = parseFloat(obj).toFixed(obj1)
    //             return parseFloat(a);
    //         }
    //     }

    // }

    round(obj: any, obj1: any = 0): number {
        const num = Number(obj);

        if (isNaN(num)) return NaN;

        const precision = Number(obj1) || 0;
        const factor = Math.pow(10, precision);

        return Math.round((num + Number.EPSILON) * factor) / factor;
    }

    ceil(obj: any) {
        return Math.ceil(obj);
    }

    floor(obj: any) {
        return Math.floor(obj);
    }

    trunc(obj: any) {
        if (isNaN(Math.trunc(obj))) {
            return this.tochar(obj, "dd-mon-rrrr")
        } else {
            return Math.trunc(obj);
        }
    }

    cos(obj: any) {
        return Math.cos(obj);
    }

    sin(obj: any) {
        return Math.sin(obj);
    }
    tan(obj: any) {
        return Math.tan(obj);
    }

    sqrt(obj: any) {
        return Math.sqrt(obj);
    }

    abs(obj: any) {
        return Math.abs(obj);
    }

    power(obj: number, obj1: number) {
        return Math.pow(obj, obj1);
    }
    nvl(value1: any, value2: any) {
        if (!value1) {
            return value2;
        }

        return value1;
    }

    ascii(val: any) {
        return val.codePointAt(0);
    }

    chr(val: any) {
        return String.fromCharCode(val);
    }

    upper(val: any) {
        return val.toUpperCase();
    }

    lower(val: any) {
        return val.toLowerCase();
    }

    initcap(str: any) {
        str = str.toLowerCase();
        const arrOfWords = str.split(" ");
        const arrOfWordsCased = [];

        for (let i = 0; i < arrOfWords.length; i++) {
            const char = arrOfWords[i].split("");
            char[0] = char[0].toUpperCase();

            arrOfWordsCased.push(char.join(""));
        }

        return arrOfWordsCased.join(" ");
    }

    ltrim(str: any) {
        if (typeof str == 'number') {
            str = str.toString();
        }
        return str.replace(/^\s+/, "");
    }

    rtrim(str: any) {
        if (typeof str == 'number') {
            str = str.toString();
        }
        return str.replace(/\s+$/, "");
    }

    trim(str: any) {
        if (typeof str == 'number') {
            str = str.toString();
        }
        return str.trim();
    }
    substr(str: any, index: number, len: number) {
        if (str) {
            if (typeof str == 'number') {
                str = str.toString();
            }
            return str.substr(index > 0 ? (index - 1) : index, len);
        } else {
            return
        }

    }

    length(str: any) {
        if (str) {
            if (typeof str == 'number') {
                str = str.toString();
            }
            return str.length;
        } else {
            return;
        }

    }

    lpad(str: any, len: number, replaceStr: any) {
        if (typeof (str) != 'string') {
            str = str.toString();
        }
        if (len < str.length) {
            return str.substr(0, len);
        } else {
            return str.padStart(len, replaceStr);
        }
    }

    rpad(str: any, len: number, replaceStr: any) {
        if (str) {
            if (typeof str == 'number') {
                str = str.toString();
            }
            if (len < str.length) {
                return str.substr(0, len);
            } else {
                return str.padEnd(len, replaceStr);
            }
        } else {
            return;
        }

    }

    mod(num1: number, num2: number) {
        return num1 % num2;
    }

    remainder(num1: number, num2: number) {
        return num1 / num2;
    }

    exp(num1: number) {
        return Math.exp(num1);
    }

    decode(str1: any, str2: any, str3: any, str4: any) {
        if (str1 === str2) {
            return str3;
        } else {
            return str4;
        }
    }

    instr(str1: any, str2) {
        if (str1) {
            if (typeof str1 == 'number') {
                str1 = str1.toString();
            }
            let index = str1.indexOf(str2);
            return index + 1;
        } else {
            return;
        }

    }

    replace(str: any, replacableStr: number, replaceStr: any) {
        let str2 = replaceStr ? replaceStr : "";
        let retStr = str.replaceAll(replacableStr, str2);
        return retStr
    }


    least(...arg) {
        return Math.min(...arg);
    }

    greatest(...arg) {
        return Math.max(...arg);
    }
    firstday(date) {
        var newobne = new Date(date)
        var firstDay = new Date(newobne.getFullYear(), newobne.getMonth(), 1);
        const firstDay1 = new Date(firstDay);
        const firstday =
            `${firstDay1.getDate()}-${this.mon[firstDay1.getMonth()]}-${firstDay1.getFullYear()}`;
        return firstday
    }


    lastday(date) {

        var newobne = new Date(date)

        var lastDay = new Date(newobne.getFullYear(), newobne.getMonth() + 1, 0);
        const firstDay1 = new Date(lastDay);
        const lastday = `${firstDay1.getDate()}-${this.mon[firstDay1.getMonth()]}-${firstDay1.getFullYear()}`;
        return lastday
    }


    daysdifference(date2, date1) {
        const diffInMs = new Date(date2).getTime() - new Date(date1).getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return diffInDays;
    }
    // 02-NOV-2023 13:15:55

    timedifference(a, b) {
        const diffInMs = new Date(b).getTime() - new Date(a).getTime();
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffInMs % (1000 * 60 * 60)) / 1000);
        const time = hours + ":" + minutes + ":" + seconds;
        return time;
    }


    tochar(value, format) {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = String(date.getMonth());
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('yyyy', year)
            .replace('RRRR', year)
            .replace('rrrr', year)
            .replace('MON', this.mon[month])
            .replace('mon', this.mon[month])
            .replace('MM', String(parseInt(month) + 1).padStart(2, '0'))
            .replace('mm', String(parseInt(month) + 1).padStart(2, '0'))
            .replace('DD', day)
            .replace('dd', day)
            .replace('HH', hours)
            .replace('hh', hours)
            .replace('MI', minutes)
            .replace('mi', minutes)
            .replace('ss', seconds)
            .replace('SS', seconds)

    }

    between(value, min, max) {
        return value >= min && value <= max;
    }


    toDate(dateString, format) {
        // Assuming format is in 'YYYY-MM-DD' or similar patterns
        const formatParts = format.split('-');
        const dateParts = dateString.split('-');

        // Parse based on the format
        let year, month, day;

        if (formatParts[0] === 'YYYY') {
            year = parseInt(dateParts[0], 10);
        } else if (formatParts[0] === 'MM') {
            month = parseInt(dateParts[0], 10) - 1; // Adjust for 0-based months
        } else if (formatParts[0] === 'DD') {
            day = parseInt(dateParts[0], 10);
        }

        if (formatParts[1] === 'MM') {
            month = parseInt(dateParts[1], 10) - 1; // Adjust for 0-based months
        } else if (formatParts[1] === 'DD') {
            day = parseInt(dateParts[1], 10);
        } else if (formatParts[1] === 'YYYY') {
            year = parseInt(dateParts[1], 10);
        }

        if (formatParts[2] === 'DD') {
            day = parseInt(dateParts[2], 10);
        } else if (formatParts[2] === 'YYYY') {
            year = parseInt(dateParts[2], 10);
        } else if (formatParts[2] === 'MM') {
            month = parseInt(dateParts[2], 10) - 1; // Adjust for 0-based months
        }

        // Return the Date object based on parsed values
        return new Date(day, month, year);
    }
    in(value, arr) {
        let con = arr.includes(value)
        return con;
    }
    not_in(value, arr) {
        let con = !arr.includes(value)
        return con;
    }
    nextday(date) {
        // Array of month names for formatting
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        // Create a new Date object from the input
        const nextDate = new Date(date);

        // Add one day
        nextDate.setDate(nextDate.getDate() + 1);

        // Format as DD-MMM-YYYY
        const day = String(nextDate.getDate()).padStart(2, '0');
        const month = months[nextDate.getMonth()];
        const year = nextDate.getFullYear();

        return `${day}-${month}-${year}`;
    }
    isnotnull(item) {
        if (item !== '' && item !== null && item !== undefined) {
            return true;
        } else {
            return false;
        }
        // return item !== '' && item !== null && item !== undefined;
    }
    isnull(item) {
        if (item == '' || item == null || item == undefined) {
            return true;
        } else {
            return false;
        }
        // return item == '' || item == null || item == undefined;
    }
}




