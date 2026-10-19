import { FullCalendarModule } from '@fullcalendar/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { ScrollingModule } from '@angular/cdk/scrolling';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { CalendarModule } from 'ion2-calendar';
import { SwiperModule } from 'swiper/angular';
import { TreeModule } from 'primeng/tree';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [
     FullCalendarModule, AngularMyDatePickerModule, AngularEditorModule, NgbModule, RouterModule,  PipesModule, TableModule, TreeTableModule, TreeModule,
    CommonModule, NgbModule, AngularEditorModule, NgSelectModule, FormsModule, CalendarModule, ReactiveFormsModule, IonicModule, SwiperModule, NgCalendarModule
  ],

  })
export class ExternalModule { }