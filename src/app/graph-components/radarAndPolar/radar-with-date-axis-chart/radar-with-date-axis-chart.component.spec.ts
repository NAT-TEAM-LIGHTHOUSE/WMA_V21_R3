import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadarWithDateAxisChartComponent } from './radar-with-date-axis-chart.component';

describe('RadarWithDateAxisChartComponent', () => {
  let component: RadarWithDateAxisChartComponent;
  let fixture: ComponentFixture<RadarWithDateAxisChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadarWithDateAxisChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadarWithDateAxisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
