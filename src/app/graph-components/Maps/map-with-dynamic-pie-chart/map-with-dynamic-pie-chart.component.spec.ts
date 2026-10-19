import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapWithDynamicPieChartComponent } from './map-with-dynamic-pie-chart.component';

describe('MapWithDynamicPieChartComponent', () => {
  let component: MapWithDynamicPieChartComponent;
  let fixture: ComponentFixture<MapWithDynamicPieChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapWithDynamicPieChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapWithDynamicPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
