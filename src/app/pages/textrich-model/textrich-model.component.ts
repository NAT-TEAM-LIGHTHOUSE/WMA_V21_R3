
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonTextarea } from '@ionic/angular/standalone';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';


@Component({
standalone: true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-textrich-model',
  templateUrl: './textrich-model.component.html',
  styleUrls: ['./textrich-model.component.scss'],
})
export class TextrichModelComponent implements OnInit {
  text_val:string;
  @Input() textarea: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('textInputname') textInputname: IonTextarea;
  constructor() { }

  ngOnInit() {
    this.text_val=this.textarea.value
    console.log(this.textarea.value)
  }

  ngAfterViewInit(): void {
    console.log('Textarea reference:', this.textInputname); // Debug: Check if textarea is defined
    if (this.textInputname) {
      setTimeout(() => {
        this.textInputname.setFocus().then(() => {
          const nativeTextarea = this.textInputname.getInputElement();
          nativeTextarea.then((element) => {
            // Set cursor to the end of the text
            const endPosition = element.value.length;
            element.setSelectionRange(endPosition, endPosition);
          });
          
          console.log('Focus set successfully');
        }).catch(err => {
          console.error('Error setting focus:', err);
        });
      }, 300); // Delay to account for Ionic rendering
    } else {
      console.error('Textarea not found');
    }
  }
  

}
