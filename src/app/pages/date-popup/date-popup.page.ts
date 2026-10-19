import { AfterViewChecked, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, VERSION } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { NgbDatepicker, NgbDateStruct,NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DateTimeModel } from 'src/app/services/date-time.modal';
import { GlobalObjectsService } from 'src/app/services/global-objects.service'; 
import * as jalaali from 'jalaali-js';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { isPlatformServer } from '@angular/common';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
@Component({
standalone: true,
imports : [NgbDatepickerModule,NgbTimepickerModule,FormsModule,...STANDALONE_IMPORTS],
  selector: 'app-date-popup',
  templateUrl: './date-popup.page.html',
  styleUrls: ['./date-popup.page.scss'],
})
export class DatePopupPage implements OnInit {
  @Input() platformValue: any;
  @Input() dateinput: any;
  @Input() dateModel1: NgbDateStruct;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() datetimeModel: DateTimeModel;
  @Input() seconds: any;
  @Input() hourStep: any;
  @Input() minuteStep: any;
  @Input() secondStep: any;
  @Input() displayValue: any;
  dp: NgbDatepicker;
  tp: any;
  /////////////persian variable//////
  initialDate: string;
  dateChange: any;
  persianSubmitDate: any;
  years: number[] = [];
  months: { value: number, name: string }[] = [
    { value: 1, name: 'فروردین' }, { value: 2, name: 'اردیبهشت' },
    { value: 3, name: 'خرداد' }, { value: 4, name: 'تیر' },
    { value: 5, name: 'مرداد' }, { value: 6, name: 'شهریور' },
    { value: 7, name: 'مهر' }, { value: 8, name: 'آبان' },
    { value: 9, name: 'آذر' }, { value: 10, name: 'دی' },
    { value: 11, name: 'بهمن' }, { value: 12, name: 'اسفند' }
  ];
  days: (number | null)[] = [];

  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  today: { year: number, month: number, day: number };

  showCalendar: boolean = true;

  persianWeekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
  /////////////////////////
  constructor(private popoverController: PopoverController, private globalObjects: GlobalObjectsService,@Inject(PLATFORM_ID) private platformId: Object) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"date-popup-page")
    }
   }



  ngOnInit() {
    // this.dateinput.item_sub_type ='DUAL';
    
    if(this.dateinput.value){
      if(!this.dateModel1){
        this.dateModel1 = this.parseDateToNgbDateStruct(this.dateinput.value);
      }
    }

    if(this.dateinput.datatype == 'DUAL_DATE'){
      const today = jalaali.toJalaali(new Date());
    this.today = {
      year: today.jy,
      month: today.jm,
      day: today.jd
    };

    this.years = Array.from({ length: 20 }, (_, i) => today.jy - 10 + i);

    if (this.initialDate) {
      this.setSelectedDate(this.initialDate);
    }
     else {
      this.selectedYear = today.jy;
      this.selectedMonth = today.jm;
      this.selectedDay = today.jd;
    }

    this.updateDays();
    }
    
  }

  onSimpleDateChange(ev,dp?){
    if (this.dateinput.datatype) {
        this.gregorianToPersian(ev.year, ev.month, ev.day);
    }
  }

  onDateChange(ev, dp?) {
    if (isPlatformServer(this.platformId)) return;
    if (this.dateinput.datatype) {
      if (this.dateinput.datatype == 'DUAL_DATE') {
        const simpleDateText: any = document.getElementById("simpleInputDate") as HTMLBodyElement;
        if(simpleDateText){
          simpleDateText.value=ev.year+"/"+ev.month+"/"+ev.day;
          this.blurSimpleDateText();
        }
      } else {
        this.popoverController.dismiss({ ev: ev, dp: dp, tp: this.tp, type: 'dateChange' });
      }
    }
  }

  onTimeChange(tp) {
    this.tp = tp;
    if (this.dateinput.datatype == 'TIME') {
      this.globalObjects.timeData = tp;
    }
  }

  setHighlightedDate(dateString: string) {
    console.log("dateString : "+dateString);
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      this.dateModel1 = { year, month, day };
    }
  }

  // Function to check if the date is the one to highlight
  isHighlighted(date: NgbDateStruct): boolean {
    return this.dateModel1 && date.year === this.dateModel1.year &&
      date.month === this.dateModel1.month &&
      date.day === this.dateModel1.day;
  }

  gregorianToPersian(year: number, month: number, day: number): string {
    const persianDate = jalaali.toJalaali(year, month, day);

    this.initialDate = persianDate.jy + "/" + persianDate.jm + "/" + persianDate.jd;
    this.persianSubmitDate = this.initialDate;
    this.setSelectedDate(this.initialDate);
    return `${persianDate.jy}-${persianDate.jm}-${persianDate.jd}`;
  }

  // Convert Persian date to Gregorian date
  persianToGregorian(year: number, month: number, day: number): string {
    const gregorianDate = jalaali.toGregorian(year, month, day);
    return `${gregorianDate.gy}/${gregorianDate.gm}/${gregorianDate.gd}`;
  }

  ///////////////////////////////////////////////persian date picker////////////////////////////////
  getpersianDate() {
    let ev: any;
    if (isPlatformServer(this.platformId)) return;
    const perDateText: any = document.getElementById("persianInputDate") as HTMLBodyElement;
    const simpleDateText: any = document.getElementById("simpleInputDate") as HTMLBodyElement;

    if (perDateText) {
      if (perDateText.value != "") {
        let perDate = perDateText.value;
        const isValid = this.validateDateFormat(perDate);
        if (isValid) {
          this.persianSubmitDate = perDateText.value;
        } else {
          alert("The date format is invalid. Please use yyyy/dd/mm. or check day and month");
          return;
        }
      } else if (simpleDateText) {
        if (simpleDateText.value != "") {
          let simpleDate = simpleDateText.value;
          const isValid = this.validateDateFormat(simpleDate);
          if (isValid) {
            let dateObj = simpleDate.split("/");
            if (dateObj[1] > 12) {
              alert("please enter correct date format")
            }
            const ev: NgbDateStruct = {
              year: Number(dateObj[0]),
              month: Number(dateObj[1]),
              day: Number(dateObj[2])
            };
            this.onSimpleDateChange(ev);
          } else {
            alert("The date format is invalid. Please use yyyy/dd/mm. or check day and month");
            return;
          }
        }
      }
    }

    if (this.persianSubmitDate) {
      if (this.persianSubmitDate != "") {
        let dateObj = this.persianSubmitDate.split("/");
        if (dateObj[1] > 12) {
          alert("please enter correct date format")
          return;
        }
        ev = {
          year: dateObj[0],
          month: dateObj[1],
          day: dateObj[2]
        }
      }
    }
    this.popoverController.dismiss({ ev: ev, dp: 'dp', tp: this.tp, type: 'dateChange' })
  }

  validateDateFormat(dateString: string): boolean {
    const datePattern = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    if (!datePattern.test(dateString)) {
      return false;
    }
    const [year, month, day] = dateString.split('/').map(Number);
    if (month < 1 || month > 12) {
      return false;
    }
    if (day < 1 || day > 31) {
      return false;
    }
    return true;
  }


  blurSimpleDateText() {
    if (isPlatformServer(this.platformId)) return;
    const simpleDateText: any = document.getElementById("simpleInputDate") as HTMLBodyElement;
    if (simpleDateText) {
      if (simpleDateText.value != "") {
        let simpleDate = simpleDateText.value;
        const isValid = this.validateDateFormat(simpleDate);
        if (isValid) {
          let dateObj = simpleDate.split("/");
          if (dateObj[1] > 12) {
            alert("please enter correct date format")
          }
          const ev: NgbDateStruct = {
            year: Number(dateObj[0]),
            month: Number(dateObj[1]),
            day: Number(dateObj[2])
          };
          this.onSimpleDateChange(ev);
          const perDateText: any = document.getElementById("persianInputDate") as HTMLBodyElement;
          if (perDateText) {
            perDateText.value = this.persianSubmitDate;
          }
        } else {
          alert("The date format is invalid. Please use yyyy/dd/mm. or check day and month");
        }
      }
    }
  }
  blurPersianDateText() {
    if (isPlatformServer(this.platformId)) return;
    const perDateText: any = document.getElementById("persianInputDate") as HTMLBodyElement;
    if (perDateText) {
      if (perDateText.value != "") {
        let perDate = perDateText.value;
        const isValid = this.validateDateFormat(perDate)
        if (isValid) {
          let dateObj = perDate.split("/");
          this.selectedYear = Number(dateObj[0]);
          this.selectedMonth = Number(dateObj[1]);
          this.selectedDay = Number(dateObj[2]);
          let gregarianDate: any = this.jalaliToGregorian(this.selectedYear, this.selectedMonth, this.selectedDay);
          const setsimpleDateText: any = document.getElementById("simpleInputDate") as HTMLBodyElement;
          if (setsimpleDateText) {
            setsimpleDateText.value = gregarianDate.gy + "/" + gregarianDate.gm + "/" + gregarianDate.gd;
            console.log(gregarianDate.gy + "/" + gregarianDate.gm + "/" + gregarianDate.gd);


            const year = parseInt(gregarianDate.gy, 10);
            const month = parseInt(gregarianDate.gm , 10);
            const day = parseInt(gregarianDate.gd, 10);
            this.dateModel1 = { year, month, day };
          }
          this.blurSimpleDateText();
        } else {
          alert("The date format is invalid. Please use jjjj/dd/mm or check day and month.");
        }
      }
    }
  }


  jalaliToGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    return { gy, gm, gd };
  }

  highlightGragarianDate(persianDate: any) {
    this.setHighlightedDate(persianDate);
  }
  ngOnChanges(changes: any) {
    if (changes['initialDate'] && changes['initialDate'].currentValue) {
      this.setSelectedDate(changes['initialDate'].currentValue);
    }
  }

  setSelectedDate(date: string) {
    const [year, month, day] = date.split('/').map(Number);
    this.selectedYear = year;
    this.selectedMonth = month;
    this.selectedDay = day;
    this.updateDays();
    this.emitDateChangeData();
  }

  updateDays() {
    const daysInMonth = jalaali.jalaaliMonthLength(this.selectedYear, this.selectedMonth);
    const firstDayOfMonth = new Date(jalaali.toGregorian(this.selectedYear, this.selectedMonth, 1).gy,
      jalaali.toGregorian(this.selectedYear, this.selectedMonth, 1).gm - 1,
      jalaali.toGregorian(this.selectedYear, this.selectedMonth, 1).gd).getDay();

    let days: (number | null)[] = [];
    for (let i = 0; i < (firstDayOfMonth + 1) % 7; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    this.days = days;
  }

  selectDate(day: number) {
    this.selectedDay = day;
    this.emitDateChange();
  }

  emitDateChange() {
    const persianDate = `${this.selectedYear}/${this.selectedMonth}/${this.selectedDay}`;
    this.initialDate = persianDate;
    if (isPlatformServer(this.platformId)) return;
    const perDateText: any = document.getElementById("persianInputDate") as HTMLBodyElement;
     if(perDateText){
      perDateText.value=persianDate;
      this.blurPersianDateText();
     }
  }

  emitDateChangeData() {
    const persianDate = `${this.selectedYear}/${this.selectedMonth}/${this.selectedDay}`;
    this.initialDate = persianDate;

    let gregrandate = this.persianToGregorian(this.selectedYear, this.selectedMonth, this.selectedDay);
    this.highlightGragarianDate(gregrandate);
    this.persianSubmitDate = persianDate;
  }

  onYearChange(event: any) {
    this.selectedYear = +event.target.value;
    this.updateDays();
  }

  onMonthChange(event: any) {
    this.selectedMonth = +event.target.value;
    this.updateDays();
  }

  isToday(day: number | null): boolean {
    return day !== null &&
      this.selectedYear === this.today.year &&
      this.selectedMonth === this.today.month &&
      day === this.today.day;
  }

  isSelected(day: number | null): boolean {
    return day !== null && day === this.selectedDay;
  }


  parseDateToNgbDateStruct(dateString: string): NgbDateStruct {
    const monthMap: { [key: string]: number } = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
      Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
    };
  
    const [day, month, year] = dateString.split('-');
    return {
      day: parseInt(day, 10),
      month: monthMap[month],
      year: parseInt(year, 10)
    };
  }
}
