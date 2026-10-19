import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineChartScrollAndZoomComponent } from './line-chart-scroll-and-zoom.component';

describe('LineChartScrollAndZoomComponent', () => {
  let component: LineChartScrollAndZoomComponent;
  let fixture: ComponentFixture<LineChartScrollAndZoomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartScrollAndZoomComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartScrollAndZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
