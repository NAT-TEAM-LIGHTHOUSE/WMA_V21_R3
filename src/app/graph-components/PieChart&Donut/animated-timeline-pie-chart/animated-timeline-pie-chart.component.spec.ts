import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnimatedTimelinePieChartComponent } from './animated-timeline-pie-chart.component';

describe('AnimatedTimelinePieChartComponent', () => {
  let component: AnimatedTimelinePieChartComponent;
  let fixture: ComponentFixture<AnimatedTimelinePieChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedTimelinePieChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimatedTimelinePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
