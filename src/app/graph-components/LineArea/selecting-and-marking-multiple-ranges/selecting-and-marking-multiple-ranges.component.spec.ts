import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectingAndMarkingMultipleRangesComponent } from './selecting-and-marking-multiple-ranges.component';

describe('SelectingAndMarkingMultipleRangesComponent', () => {
  let component: SelectingAndMarkingMultipleRangesComponent;
  let fixture: ComponentFixture<SelectingAndMarkingMultipleRangesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectingAndMarkingMultipleRangesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectingAndMarkingMultipleRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
