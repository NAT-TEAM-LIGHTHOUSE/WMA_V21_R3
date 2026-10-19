import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StackedAreaRadarChartComponent } from './stacked-area-radar-chart.component';

describe('StackedAreaRadarChartComponent', () => {
  let component: StackedAreaRadarChartComponent;
  let fixture: ComponentFixture<StackedAreaRadarChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedAreaRadarChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StackedAreaRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
