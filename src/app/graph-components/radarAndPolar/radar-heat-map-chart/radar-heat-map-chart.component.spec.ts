import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadarHeatMapChartComponent } from './radar-heat-map-chart.component';

describe('RadarHeatMapChartComponent', () => {
  let component: RadarHeatMapChartComponent;
  let fixture: ComponentFixture<RadarHeatMapChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadarHeatMapChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadarHeatMapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
