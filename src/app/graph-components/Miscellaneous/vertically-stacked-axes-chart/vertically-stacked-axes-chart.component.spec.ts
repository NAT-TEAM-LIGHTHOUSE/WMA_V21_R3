import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerticallyStackedAxesChartComponent } from './vertically-stacked-axes-chart.component';

describe('VerticallyStackedAxesChartComponent', () => {
  let component: VerticallyStackedAxesChartComponent;
  let fixture: ComponentFixture<VerticallyStackedAxesChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticallyStackedAxesChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerticallyStackedAxesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
