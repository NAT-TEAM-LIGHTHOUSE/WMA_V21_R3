import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
type DayStatus = | 'today'
  | 'present'
  | 'leave'
  | 'half_leave'
  | 'absent'
  | 'holiday'
  | 'none';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  currentMonth: boolean;
  isToday: boolean;
  status: DayStatus;
}
@Component({
  selector: 'app-frame-custom-calendar',
  templateUrl: './frame-custom-calendar.component.html',
  styleUrls: ['./frame-custom-calendar.component.scss'],
  imports: [STANDALONE_IMPORTS]
})
export class FrameCustomCalendarComponent implements OnInit {
  attendanceData: Record<string, DayStatus> = {};
  developerModeData: any;
  userSelectedView: any = 'dayGridMonth';
  id: any;
  currentView: string = ''; // Default view
  @Input() frame: any = {};
  // @Input() wsdp: any = {};
  // @Input() wsdpcl: any = {};
  // @Input() wscp: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  currentYear: number;
  currentMonth: any;
  legends: any;
  // legendData: any;
  legendData: Record<string, string> = {};


  @Output() dayClick = new EventEmitter<CalendarDay>();
  // @Output() goToCalendarClick = new EventEmitter<void>();
  @Output() menuClick = new EventEmitter<void>();

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  calendarDays: CalendarDay[] = [];

  currentDate = new Date();
  viewYear!: number;
  viewMonth!: number;


  constructor(private event: Events, private lhs_lib: LhsLibService, private modalController: ModalController, public globalObjects: GlobalObjectsService) {

  }
  ngOnInit(): void {

    this.event.unsubscribe(this.frame.apps_page_frame_seqid);
    this.event.subscribe(this.frame.apps_page_frame_seqid, () => {
      // Process legends
      this.legends = this.frame.frame_filter_flag;
      const matches = this.legends.match(/'([^']+)'/g);

      this.legendData = matches.reduce((acc: any, item: string) => {
        let itArr = item.split('-');

        let remaining = item.substring(itArr[0].length + 1);
        acc[itArr[0].replace(/'/g, '').toLowerCase()] = remaining.replace(/'/g, '');
        return acc;
      }, {});

      // Set default blue color for today if not already defined
      if (!this.legendData['today']) {
        this.legendData['today'] = '#b0cbff';
      }

      // Process dynamic attendance data from execute_query
      this.attendanceData = {};
      if (this.frame.tableData && this.frame.tableData.length > 0) {
        for (const item of this.frame.tableData) {
          const dateStr = item.EVENT_DATE;
          const status = item.EVENT_TYPE ? item.EVENT_TYPE.toLowerCase() as DayStatus : 'none';
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            const key = this.formatDateKey(date);
            // this.attendanceData[key] = status;
            if (!this.attendanceData[key]) {
  this.attendanceData[key] = status;
}
          }
        }
        console.log('attendanceData => ', this.attendanceData);
      }

      // Regenerate calendar with new data
      this.generateCalendar();
    }

    );
    this.viewYear = this.currentDate.getFullYear();
    this.viewMonth = this.currentDate.getMonth();
    this.generateCalendar();


    this.developerModeData = {
      ws_seq_id: "",
      frame_seq_id: this.frame.apps_page_frame_seqid
    };
  }

  prevMonth(): void {
    if (this.viewMonth === 0) {
      this.viewMonth = 11;
      this.viewYear--;
    } else {
      this.viewMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.viewMonth === 11) {
      this.viewMonth = 0;
      this.viewYear++;
    } else {
      this.viewMonth++;
    }
    this.generateCalendar();
  }

  goToCurrentMonth(): void {
    const now = new Date();
    this.viewYear = now.getFullYear();
    this.viewMonth = now.getMonth();
    this.generateCalendar();
    // this.goToCalendarClick.emit();
  }

  openMenu(): void {
    this.menuClick.emit();
  }

  // onDaySelected(day: CalendarDay): void {
  //   this.dayClick.emit(day);
  // }

  get monthYearLabel(): string {
    return new Date(this.viewYear, this.viewMonth).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }

  private generateCalendar(): void {
    this.calendarDays = [];

    const firstDayOfMonth = new Date(this.viewYear, this.viewMonth, 1);
    const lastDayOfMonth = new Date(this.viewYear, this.viewMonth + 1, 0);

    const firstWeekDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const prevMonthLastDate = new Date(this.viewYear, this.viewMonth, 0).getDate();

    for (let i = firstWeekDay - 1; i >= 0; i--) {
      const dayNumber = prevMonthLastDate - i;
      const date = new Date(this.viewYear, this.viewMonth - 1, dayNumber);

      this.calendarDays.push({
        date,
        dayNumber,
        currentMonth: false,
        isToday: this.isSameDate(date, new Date()),
        status: 'none'
      });
    }
    console.log('Calendar Days after adding previous month:', this.calendarDays);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.viewYear, this.viewMonth, day);
      const isToday = this.isSameDate(date, new Date());
      const dateKey = this.formatDateKey(date);

      let status: DayStatus = this.attendanceData[dateKey] || 'none';

      if (isToday) {
        status = 'today';
      }

      this.calendarDays.push({
        date,
        dayNumber: day,
        currentMonth: true,
        isToday,
        status
      });
    }
    console.log('Generated Calendar Days:', this.calendarDays);
    const remaining = 42 - this.calendarDays.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(this.viewYear, this.viewMonth + 1, day);

      this.calendarDays.push({
        date,
        dayNumber: day,
        currentMonth: false,
        isToday: this.isSameDate(date, new Date()),
        status: 'none'
      });
      console.log('Final Calendar Days with next month:', this.calendarDays);
    }
  }


  private formatDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private isSameDate(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  private parseEventDate(dateStr: string): Date | null {
    if (!dateStr) {
      return null;
    }
    // expected format: 01-Apr-2024
    const parts = dateStr.split('-');
    if (parts.length !== 3) {
      return null;
    }
    const [day, monthCode, year] = parts;
    const monthMap: Record<string, number> = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    const month = monthMap[monthCode.toLowerCase()];
    if (month === undefined) {
      return null;
    }
    return new Date(Number(year), month, Number(day));
  }

  // async onDaySelected(day: any) {
  //   const selectedDateKey = this.formatDateKey(day.date);
  //   for(let data of this.frame.tableRows){
  //     for(let item of data.Level5){
  //       console.log("data",item)
  //     }
  //   }
  //   const matchedRows = (this.frame.tablerRows || [])
  //     .filter((row: any) => {
  //       const eventDate = this.parseEventDate(row.EVENT_DATE);
  //       return eventDate ? this.formatDateKey(eventDate) === selectedDateKey : false;
  //     });

  //   const payload = {
  //     selectedDate: selectedDateKey,
  //     status: day.status,
  //     day,
  //     matches: matchedRows,
  //   };

  //   this.emitPass.emit(payload);

  //   // optional: emit legacy event as well
  //   this.dayClick.emit(day);
  // }
  async onDaySelected(day: any) {
    const selectedDateKey = this.formatDateKey(day.date);
    let selectedItem: any = null;


    if (this.frame.tableRows && Array.isArray(this.frame.tableRows)) {
      for (const row of this.frame.tableRows) {
        let eventDateValue: string | null = null;

        for (const level4 of row) {
          for (const item of level4.Level5) {
            if (item.item_name === 'EVENT_DATE') {
              const eventDate = this.parseEventDate(item.value);

              if (this.formatDateKey(eventDate) === selectedDateKey) {
                eventDateValue = item.value;
                break;
              }
            }

            if (eventDateValue) break;
          }
        }

        if (eventDateValue) {
          for (const level4 of row) {
            for (const item of level4.Level5) {
              if (item.item_name === 'CLICK_EVENTS') {
                selectedItem = item;
                break;
              }
            }
            if (selectedItem) break;

          }
          break;
        }
      }

    }

    const payload = selectedItem || {
      selectedDate: selectedDateKey,
      status: day.status,
      day,
      matches: []
    };
    if (selectedItem) {
      selectedItem.frame_status = 'dirty';
    }

    this.frame.active_row = selectedItem.indexcount;
    this.emitPass.emit(payload);
    this.dayClick.emit(day);
  }



  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.frame
      }
    });
    return await modal.present();
  }

}

