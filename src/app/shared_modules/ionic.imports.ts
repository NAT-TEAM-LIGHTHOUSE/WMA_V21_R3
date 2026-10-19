import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { co } from '@fullcalendar/core/internal-common';
// import { ScrollingModule } from '@angular/cdk/scrolling';

/* =======================
   IONIC STANDALONE
   ======================= */
import {
  IonApp,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFooter,

  IonGrid,
  IonRow,
  IonCol,

  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,IonSegmentView,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonToggle,
  IonInputPasswordToggle,
  IonDatetime,

  IonButton,
  IonIcon,IonSplitPane,
  IonButtons,

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,

  IonList,
  IonNote,IonSegmentContent,
  IonBadge,IonRange,
  IonSpinner,

  IonTabs,
  IonTabBar,
  IonTabButton,IonText,IonAlert,IonDatetimeButton,

  IonModal,
  IonRefresher,IonChip,IonBackButton,IonSearchbar,
  IonRefresherContent,
  IonFab,IonSegment,
  IonFabButton,IonSegmentButton,
  IonSkeletonText,
   IonPopover,
  IonThumbnail,IonListHeader,
IonAccordion,
  IonAccordionGroup,
  IonMenuButton,
  IonMenu,
  IonFabList,
  IonMenuToggle,
  IonProgressBar,IonAvatar,
  IonItemSliding,
  IonItemOptions,
   IonItemOption,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';
/* =======================
   THIRD PARTY
   ======================= */
// import { NgSelectModule } from '@ng-select/ng-select';
// import { NgOtpInputModule } from 'ng-otp-input';

/* =======================
   EXPORT
   ======================= */
export const STANDALONE_IMPORTS = [
  // Angular
  CommonModule,FormsModule,ReactiveFormsModule,
  IonSegment,IonRange,
  
  ReactiveFormsModule,IonChip,IonBackButton,
  RouterModule,  IonFab,IonText,IonAlert,
  IonFabButton, IonRefresher,IonSegmentContent,IonSearchbar,
  IonRefresherContent,IonSkeletonText,IonSpinner,IonDatetime,IonDatetimeButton,
  

  // Ionic layout
  IonApp,
  IonContent,IonSegmentButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFooter,IonSegmentView,

  // Grid
  IonGrid,
  IonRow,
  IonCol,

  // Forms
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonToggle,
  IonInputPasswordToggle,
  IonDatetime,
  

  // Buttons & Icons
  IonButton,
  IonButtons,
  IonIcon,
  IonMenuButton,
  IonMenu,

  // Cards
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,

  // Lists & UI
  IonList,
  IonNote,
  IonBadge,
  IonSpinner,
  IonListHeader,
  IonSplitPane,
  IonFabList,

  // Tabs
  IonTabs,
  IonTabBar,
  IonTabButton,

  // Modal
  IonModal,

   //Thumbnail
 IonPopover,
  IonThumbnail,

  //Accordion
  IonAccordion,
  IonAccordionGroup,


  // Third-party
  // NgSelectModule,
  

  IonMenuToggle,
  IonProgressBar,
  IonAvatar,
  IonItemSliding,
  IonItemOptions,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
   IonItemOption
];
// export const STANDALONE_IMPORTS = [
//   CommonModule,
//   FormsModule,
//   ReactiveFormsModule,
//   RouterModule,

//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonTextarea,IonSegmentView,
//   IonSelect,
//   IonSelectOption,
//   IonCheckbox,
//   IonRadio,
//   IonRadioGroup,
//   IonToggle,IonButtons,
//   IonInputPasswordToggle,
//   IonDatetime,
//   IonItem,
//   IonLabel,
//   IonInput,
//   IonButton,
//   IonIcon,
//   IonGrid,
//   IonRow,
//   IonCol,
//   IonList,
//   IonSpinner,
//   IonRefresher,
//   IonRefresherContent,
//   IonFabButton,
//   IonFab,
//   IonChip,
//   IonFabList,
// ];