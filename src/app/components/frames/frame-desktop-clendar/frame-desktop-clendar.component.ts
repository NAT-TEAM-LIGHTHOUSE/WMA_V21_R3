import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Calendar } from '@fullcalendar/core';

// import { CalendarComponent } from 'ionic2-calendar';
import { CalendarMode, QueryMode, Step } from 'ionic2-calendar/calendar';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-frame-desktop-clendar',
  templateUrl: './frame-desktop-clendar.component.html',
  styleUrls: ['./frame-desktop-clendar.component.scss'],
})
export class FrameDesktopClendarComponent {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {}; 
  @Input() wscp: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  currentYear: number;
  currentMonth: any;

  // @ViewChild(CalendarComponent) myCalendar!: CalendarComponent;
  constructor(private globalObjects:GlobalObjectsService) {
    this.isToday = false;
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-desktop-calender")
    }
  }

  fullyear = [

    2023,
    2024,
    2025,
    
  ]



  fullmonths = [
    { key: "January", val: 0,s_name:"Jan" },
    { key: "February", val: 1,s_name:"Feb"  },
    { key: "March", val: 2 ,s_name:"Mar"},
    { key: "April", val: 3 ,s_name:"Apr"},
    { key: "May", val: 4 ,s_name:"May"},
    { key: "June", val: 5 ,s_name:"Jun"},
    { key: "July", val: 6 ,s_name:"Jul"},
    { key: "August", val: 7 ,s_name:"Aug"},
    { key: "September", val: 8 ,s_name:"Sep"},
    { key: "October", val: 9 ,s_name:"Oct"},
    { key: "November", val: 10 ,s_name:"Nov"},
    { key: "December", val: 11 ,s_name:"Dec"},

  ]

  randomNameList = [
    'Alice',
    'Bob',
    'Charlie',
    'David',
    'Eve',
    'Frank',
    'Grace',
    'Hank',
    'Ivy',
    'Jack',
    'Karen',
    'Liam',
    'Max',
    'Nina',
    'Olivia',
    'Paul',
    'Quincy',
    'Rita',
    'Sara',
    'Tina',
  ];

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    console.log(this.currentYear);
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    this.currentMonth = this.fullmonths[currentMonthIndex].val;
    console.log(this.currentMonth);
  }
  eventSource: any = [];
  viewTitle: any;

  isToday: boolean;
  calendar= {
    mode: 'month' as CalendarMode,
    queryMode: 'local' as QueryMode,
    step: 30 as Step,
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function (date: Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function (date: Date) {
        return 'MonMH';
      },
      formatMonthViewTitle: function (date: Date) {
        return 'testMT';
      },
      formatWeekViewDayHeader: function (date: Date) {
        return 'MonWH';
      },
      formatWeekViewTitle: function (date: Date) {
        return 'testWT';
      },
      formatWeekViewHourColumn: function (date: Date) {
        return 'testWH';
      },
      formatDayViewHourColumn: function (date: Date) {
        return 'testDH';
      },
      formatDayViewTitle: function (date: Date) {
        return 'testDT';
      },
    },
    formatDay: "'Day' dd",
    formatDayHeader: "'Day' EEE",
    formatDayTitle: "'Day' MMMM dd, yyyy",
    formatWeekTitle: "'Week' w",
    formatWeekViewDayHeader: "'Day' EEE d",
    formatHourColumn: "'hour' ha",
    showEventDetail: false,
    startingDayMonth: 2,
    startingDayWeek: 2,
    allDayLabel: 'testallday',
    noEventsLabel: 'None',
    timeInterval: 15,
    autoSelect: false,
    locale: 'zh-CN',
    dir: 'rtl',
    scrollToHour: 11,
    preserveScrollPosition: true,
    lockSwipeToPrev: true,
    lockSwipeToNext: true,
    lockSwipes: true,
    startHour: 3,
    endHour: 16,
    sliderOptions: {
      spaceBetween: 10,
    },
    dayviewCategorySource: new Set(this.randomNameList),
    dayviewShowCategoryView: true,
  };

  loadEvents() {
    console.log(this.frame.tableData);
    this.eventSource=[]
    var arr = [];
    for (let todate of this.frame.tableData) {
      let obj={
       title:`${todate.SYS_SUBJECT} | (${todate.SYS_BODY})`,
        startTime:new Date(todate.SYS_STARTDATE),
        endTime:todate.SYS_ENDDATE!=null?new Date(todate.SYS_ENDDATE):new Date(todate.SYS_STARTDATE),
        allDay:false
      }
      this.eventSource.push(obj)
    }
    
    // this.myCalendar.loadEvents();
    console.log(this.eventSource)
  }

  loadDynamicEvents() {
    let startTime = new Date('2023-01-20T03:00:40');
    let endTime = new Date('2023-01-22T05:39:22');

    this.eventSource.push({
      title: 'test',
      startTime: startTime,
      endTime: endTime,
      allDay: false,
    });
    // this.myCalendar.loadEvents();
  }

  onViewTitleChanged(title: string) {
    this.viewTitle = title;
    console.log(
      'view title changed: ' + title + ', this.viewTitle: ' + this.viewTitle
    );
  }

  onEventSelected(event: any) {
    console.log(
      'Event selected:' +
      event.startTime +
      '-' +
      event.endTime +
      ',' +
      event.title +
      ',' +
      event.categoryId
    );
  }

  changeMode(mode: any) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onTimeSelected(ev: any) {
    console.log(
      'Selected time: ' +
      ev.selectedTime +
      ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) +
      ', disabled: ' +
      ev.disabled +
      ', categoryId: ' +
      ev.category?.categoryId +
      ', categoryName: ' +
      ev.category?.categoryName
    );
  }

  onCurrentDateChanged(ev: Date) {

    let date = new Date(ev);
    let monthIndex = date.getMonth();
    let yearIndex = date.getFullYear();
    this.currentMonth = monthIndex;
    this.currentYear=yearIndex;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    ev.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === ev.getTime();
    console.log('Currently viewed date: ' + ev);
  }

  createRandomEvents() {
    var events = [];
    for (var i = 0; i < 100; i += 1) {
      var date = new Date();
      var eventType = Math.floor(Math.random() * 2);
      var startDay = Math.floor(Math.random() * 90) - 45;
      var endDay = Math.floor(Math.random() * 2) + startDay;
      var startTime;
      var endTime;
      if (eventType === 0) {
        startTime = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + startDay
          )
        );
        if (endDay === startDay) {
          endDay += 1;
        }
        endTime = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + endDay
          )
        );
        events.push({
          title: 'All Day - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: true,
        });
      } else {
        var startMinute = Math.floor(Math.random() * 24 * 60);
        var endMinute = Math.floor(Math.random() * 180) + startMinute;
        startTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + startDay,
          0,
          date.getMinutes() + startMinute
        );
        endTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + endDay,
          0,
          date.getMinutes() + endMinute
        );
        events.push({
          title: 'Event - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: false,
        });
      }

      const categorySource = [...this.calendar.dayviewCategorySource];
      events.forEach((e) => {
        // chance to set uncategorized
        if (Math.random() < 0.5) return;
        e.category =
          categorySource[Math.floor(Math.random() * categorySource.length)];
      });
    }
    return events;
  }

  onRangeChanged(ev: any) {
    console.log(
      'range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime
    );
    // this.myCalendar.loadEvents();
  }

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  };

  datechange() {
    let date = new Date();
    date.setFullYear(this.currentYear);
    date.setMonth(this.currentMonth);

    this.calendar.currentDate = date;
  }

  func2(event){
    var cureent_date=event.target.innerText + "-" + this.fullmonths[this.currentMonth].s_name + "-" + this.currentYear;
    for (let object of this.frame.tableRows[0]) {
      for (let obj of object.Level5) {
        if(obj.item_name=='SYS_CLICK_EVENT'){
          obj.value=cureent_date
          this.emitPass.emit(obj);
        }   
      }
    }
  }
}
