import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DateAxixWithLabelsMinorGridComponent } from './date-axix-with-labels-minor-grid.component';

describe('DateAxixWithLabelsMinorGridComponent', () => {
  let component: DateAxixWithLabelsMinorGridComponent;
  let fixture: ComponentFixture<DateAxixWithLabelsMinorGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DateAxixWithLabelsMinorGridComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DateAxixWithLabelsMinorGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
