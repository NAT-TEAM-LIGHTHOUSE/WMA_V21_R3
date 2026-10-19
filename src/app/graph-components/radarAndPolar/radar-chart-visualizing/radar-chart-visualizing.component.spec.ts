import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadarChartVisualizingComponent } from './radar-chart-visualizing.component';

describe('RadarChartVisualizingComponent', () => {
  let component: RadarChartVisualizingComponent;
  let fixture: ComponentFixture<RadarChartVisualizingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadarChartVisualizingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadarChartVisualizingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
