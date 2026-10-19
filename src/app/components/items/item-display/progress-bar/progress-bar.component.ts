import { Component, Input, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class ProgressBarComponent implements OnInit {

  @Input() pbarinput :any = {}
  color: string;
  pbarValue: any;
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"progress-bar")
    }
   }

  ngOnInit() {
    if (this.pbarinput.value) {
      this.pbarValue = this.pbarinput.value.split("@")[0];
      this.color = this.pbarinput.value.split("@")[1];
    } else {
      this.pbarValue.value = [];
    }
  }
}
