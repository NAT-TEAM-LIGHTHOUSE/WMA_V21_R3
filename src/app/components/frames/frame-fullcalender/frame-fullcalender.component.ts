import { keys } from '@amcharts/amcharts4/.internal/core/utils/Object';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
// import { CalendarComponent } from 'ionic2-calendar';
import { CalendarMode, QueryMode, Step } from 'ionic2-calendar/calendar';
// import { CalendarOptions, } from '@fullcalendar/core';
//import { INITIAL_EVENTS, createEventId } from '../../../event-utils';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Events } from 'src/app/services/events';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,FullCalendarModule],
  selector: 'app-frame-fullcalender',
  templateUrl: './frame-fullcalender.component.html',
  styleUrls: ['./frame-fullcalender.component.scss'],
})
export class FrameFullcalenderComponent implements OnInit {
  @ViewChild('fullCalendar') fullCalendarComponent: FullCalendarComponent | undefined;
  developerModeData: any;
  userSelectedView: any = 'dayGridMonth';
  id: any;
  currentView: string = ''; // Default view
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  currentYear: number;
  currentMonth: any;
  select_date_event: any;
  // developerModeData: any;
  EventInput = [];
  frequencyType: 'WEEK' | 'MONTH' | 'YEAR';

  // @ViewChild(CalendarComponent) myCalendar!: CalendarComponent;
  constructor(public globalObjects : GlobalObjectsService,public event: Events, public modalController: ModalController) {
    
  }


 
  ngOnInit() {

    // console.log("check");
    // console.log(this.frame);
    this.event.unsubscribe(this.frame.apps_page_frame_seqid);
    this.event.subscribe(this.frame.apps_page_frame_seqid, () => {
      this.showevent();
      
    if (this.frame.frame_filter_flag == "Y_TYPE") {
      this.userSelectedView = 'dayGridYear';
    } else if (this.frame.frame_filter_flag == "M_TYPE") {
      this.userSelectedView = 'dayGridMonth';
    } else if (this.frame.frame_filter_flag == "W_TYPE") {
      this.userSelectedView = 'timeGridWeek';
    }
      this.changeView(this.userSelectedView);
      // this.ngOnInit();
    }
    )
  }



  
  // getUserPreference(): string {
  //   // This could be from localStorage, API, or a service
  //   return localStorage.getItem(this.frame.frame_filter_flag) || null;
  // }



  showevent() {
    // console.log(this.frame.tableData);

    // console.log(this.frame.Level4)
    // console.log(this.userSelectedView)
    this.EventInput = [];
    for (let todate of this.frame.tableData) {
      let parts = todate.FROM_DATE.split(' ');
      let dateParts = parts[0].split('-');


      let parts1 = todate.TO_DATE.split(' ');
      let dateParts1 = parts1[0].split('-');

      let monthMap = {
        jan: '01',
        feb: '02',
        mar: '03',
        apr: '04',
        may: '05',
        jun: '06',
        jul: '07',
        aug: '08',
        sep: '09',
        oct: '10',
        nov: '11',
        dec: '12',
      };
      const startdate = `${dateParts[2]}-${monthMap[dateParts[1].toLowerCase()]}-${dateParts[0]}`;

      const enddate = `${dateParts1[2]}-${monthMap[dateParts[1].toLowerCase()]}-${dateParts1[0]}`;


      // New code for frequency match
      const freq = todate.FREQUENCY_TYPE; // WEEK | MONTH | YEAR
      const { start, end } = this.getStartEndByFrequency(startdate, freq);
      const eventColor = todate.COLOR || todate.EVENT_COLOR || todate.BACKGROUND_COLOR || '#c0c8cf';


      // console.log(formattedDate);
      let obj = {
        id: todate.ROWID_SEQ,
        title: todate.SYS_HEADER,
        start: startdate,
        end: enddate,
        color: eventColor,
        backgroundColor: eventColor,
        borderColor: eventColor,
        extendedProps: {
          frequency: freq
        }
      }
      this.EventInput.push(obj)
    }
    // console.log(this.EventInput);






    // let tableKey = [];
    // if (this.frame.tableData.length > 0) {
    //   tableKey = Object.keys(this.frame.tableData[0]);
    // }


    // let tablerows = [];
    // for (let item1 of this.frame.tableData) {
    //   let frameLevel4 = [];
    //   frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    //   for (let itemGroup of frameLevel4) {
    //     for (let item of itemGroup.Level5) {
    //       for (let key of tableKey)
    //         if (item.item_name.toUpperCase() == key.toUpperCase()) {
    //           item.value = item1[key]
    //         }
    //     }
    //   }
    //   tablerows.push(frameLevel4)
    // }
    // console.log(tablerows)
  }




  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: null,
      frame_seq_id: this.frame.apps_page_frame_seqid
    }
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



  onDateClick(info: { dateStr: string }) {
    // Find events for the clicked date
    const eventsOnDate = this.EventInput.filter(event => event.start === info.dateStr);

    // Get the second event if it exists
    if (eventsOnDate.length >= 2) {
      console.log('Second Event:', eventsOnDate[1]); // Logs { id: '2', title: 'Event 2', start: '2024-12-10' }
    } else {
      console.log('Less than two events on this date.');
    }
  }

  loadEvents() {
    // console.log(this.frame.tableData);
  }
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,dayGridYear',
    },

    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      interactionPlugin
    ],


    initialView: this.currentView,
    initialEvents: this.EventInput, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: false,
    events: this.EventInput,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    dateClick: this.onDateClick.bind(this),
    eventContent: this.renderEventContent.bind(this),
    droppable: false,
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:

    */
eventDidMount: (info) => {
  
  info.el.setAttribute(
    'title',
    `${info.event.title} \nFrom: ${info.event.startStr} \nTo: ${info.event.endStr}`
  );
}



  };




  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    // console.log(this.currentEvents)
  }



  onEventClick(info: EventClickArg) {
    // console.log('Event Title:', info.event.title); // Log the title
    // console.log('Event Start Date:', info.event.start); // Log the start date
    // console.log('Clicked Element:', info.el); // Log the HTML element
    let clickitem;
    const clickedEventId = parseInt(info.event.id) - 1;
    this.id = clickedEventId;
    // console.log(this.frame.tableData[clickedEventId]);
    this.frame.active_row = clickedEventId;


    let tableKey = [];
    let item1 = this.frame.tableData[clickedEventId];
    if (this.frame.tableData.length > 0) {
      tableKey = Object.keys(this.frame.tableData[clickedEventId]);
    }



    let frameLevel4 = [];
    frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    for (let itemGroup of frameLevel4) {
      for (let item of itemGroup.Level5) {
        item.indexcount = clickedEventId;
        for (let key of tableKey) {
          if (item.item_name.toUpperCase() == key.toUpperCase()) {

            item.value = item1[key]
          }
        }
        if (item.item_name == "SYS_CLICK_EVENT") {
          clickitem = item;
        }
      }
    }


    // this.emitPass.emit(clickitem);



    let isValid = true;

    let col = {};
    for (let itemGroup of frameLevel4) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          if (item.codeOfValues) {
            col[item.apps_item_seqid] = item.codeOfValues
          } else if (item.value) {
            if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
              col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
            } else {
              col[item.apps_item_seqid] = item.value;
            }
          } else {
            col[item.apps_item_seqid] = ""
          }
          if (item.isValid !== undefined && !item.isValid) {
            isValid = item.isValid
          }
        }
      }
    }

    if (clickitem) {
      clickitem.wsdpcl = [col];
      this.emitPass.emit(clickitem);
    }
    //   event.wsdp.push(col);
    // }
    // Find the specific event data based on the ID
    // const selectedEvent = this.EventInput.find(event => event.id === clickedEventId);

    // if (selectedEvent) {
    //   console.log('Selected Event:', selectedEvent);
    // } else {
    //   console.log('Event not found');
    // }
  }


  renderEventContent(eventInfo: any) {
    // const isStart = eventInfo.isStart; // True if this is the first day of the event

    // Only render the title on the first day
    return {
      html: `
        <div style="height: 16px;">
         <span>${eventInfo.event.title}</span>
        </div>
      `,
    };
  }

//  renderEventContent(eventInfo: any) {
//     const isStart = eventInfo.isStart; // True if this is the first day of the event

//     // Only render the title on the first day
//     return {
//       html: `
//         <div style="border-bottom: 2px solid blue; height: 16px;">
//           ${isStart ? `<span>${eventInfo.event.title}</span>` : ''}
//         </div>
//       `,
//     };
//   }


  handleViewChange(viewType: string) {
    this.currentView = viewType;
    // console.log('Currently selected view:', this.currentView);
    alert(`Currently selected view: ${this.currentView}`);
  }

  changeView(viewType: string) {
    const calendarApi = this.fullCalendarComponent?.getApi(); // Get FullCalendar API
    if (calendarApi) {
      calendarApi.changeView(viewType); // Change view
      this.currentView = viewType; // Update the current view
      // alert(this.currentView )
    }
  }



  // To get the FullCalendar API instance
  getCalendarApi() {
    const calendarEl = document.getElementById('calendar1');
    return calendarEl ? (calendarEl as any).getApi() : null;
  }

  onViewChange(viewType: string) {
    this.currentView = viewType;
    // console.log(`View changed to: ${viewType}`);
  }

fullCalendarComponentCode:any=""

  ngAfterViewInit(){
    this.fullCalendarComponentCode=this.fullCalendarComponent.getApi()
  }

//     ngOnDestroy(){
   
//     this.currentEvents=null;
//     this.EventInput=null;
//     this.calendarOptions=null
//    this.fullCalendarComponentCode.destroy()
//    this.fullCalendarComponentCode=null
//     this.event.unsubscribe(this.frame.apps_page_frame_seqid);
//      this.developerModeData=null
//   this.userSelectedView=null;
//   this.id=null;
//   this.currentView=null; // Default view
//   this.frame=null;
//   this.wsdp=null;
//   this.wsdpcl=null;
//   this.wscp=null;
//   // @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
//   this.currentYear=null;
//   this.currentMonth=null;
//   this.select_date_event=null;
//   this.EventInput = [];
//  this.myCalendar=null;
//   }
ngOnDestroy() {


  if (this.frame?.apps_page_frame_seqid) {
    this.event.unsubscribe(this.frame.apps_page_frame_seqid);
  }
  // Destroy FullCalendar
  if (this.fullCalendarComponentCode) {
    this.fullCalendarComponentCode.destroy();
    this.fullCalendarComponentCode = null;
  }
this.calendarVisible = false;

  // Clear subscriptions
  this.event.unsubscribe(this.frame?.apps_page_frame_seqid);

  // Clear event handlers inside options
  this.calendarOptions = {
    plugins: [],
    events: [],
    headerToolbar: undefined,
    select: undefined,
    eventClick: undefined,
    eventContent: undefined,
    eventsSet: undefined
  } as CalendarOptions;

  // Clear all component-bound objects
  this.EventInput = null;
  this.currentEvents = null;
  this.fullCalendarComponent = null;
  // this.myCalendar = null;

  // Clear input references
  this.frame = null;
  this.wsdp = null;
  this.wsdpcl = null;
  this.wscp = null;

  // Other instance vars
  this.developerModeData = null;
  this.userSelectedView = null;
  this.currentView = null;
  this.id = null;
  this.currentYear = null;
  this.currentMonth = null;
  this.select_date_event = null;

  // Let Angular GC handle emitPass safely (no need to null it)
}




// New code By yash for frequency match
getStartEndByFrequency(dateStr: string, frequency: string) {
  const date = new Date(dateStr);
  let start: Date;
  let end: Date;

  switch (frequency) {
    case 'WEEK':
      start = new Date(date);
      start.setDate(date.getDate() - date.getDay()); // Sunday
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;

    case 'MONTH':
      start = new Date(date.getFullYear(), date.getMonth(), 1);
      end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      break;

    case 'YEAR':
      start = new Date(date.getFullYear(), 0, 1);
      end = new Date(date.getFullYear(), 11, 31);
      break;

    default:
      start = date;
      end = date;
  }

  // FullCalendar requires end date to be +1 day
  end.setDate(end.getDate() + 1);

  return { start, end };
}



}
