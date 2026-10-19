import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiveSortingRadarChartColumnComponent } from './live-sorting-radar-chart-column.component';

describe('LiveSortingRadarChartColumnComponent', () => {
  let component: LiveSortingRadarChartColumnComponent;
  let fixture: ComponentFixture<LiveSortingRadarChartColumnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveSortingRadarChartColumnComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveSortingRadarChartColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
