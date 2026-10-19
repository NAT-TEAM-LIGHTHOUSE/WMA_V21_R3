import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MicroChartsSparklinesComponent } from './micro-charts-sparklines.component';

describe('MicroChartsSparklinesComponent', () => {
  let component: MicroChartsSparklinesComponent;
  let fixture: ComponentFixture<MicroChartsSparklinesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroChartsSparklinesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MicroChartsSparklinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
