import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
@Component({
standalone : true,
  selector: 'app-create-memo',
  templateUrl: './create-memo.component.html',
  styleUrls: ['./create-memo.component.scss'],
   imports :[STANDALONE_IMPORTS,NgSelectModule]
})
export class CreateMemoComponent implements OnInit {
  @Input() frame:any={}
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() wscp
  // @ViewChild('ngSelect', { static: true }) ngSelect: NgSelectComponent;
  constructor() { }
 @ViewChild('ngSelect') ngSelect: NgSelectComponent;

fruits = [
  { id: 1, name: 'Mango' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Apple' },
  { id: 4, name: 'Grapes' }
];

selectedFruit: number = null;  // e.g., 2 for Banana
 functions = [
    { name: 'Sum', value: 'S' },
    { name: 'Average', value: 'A' },
    { name: 'Count', value: 'C' },
    { name: 'Minimum', value: 'M' },
    { name: 'Maximum', value: 'X' }
  ];
  ngOnInit() {}

 itemClicked(item){
    this.emitPass.emit(item)
  }
   
}
