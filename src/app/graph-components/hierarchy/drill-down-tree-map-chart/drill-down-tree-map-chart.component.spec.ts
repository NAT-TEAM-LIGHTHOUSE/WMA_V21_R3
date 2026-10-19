import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrillDownTreeMapChartComponent } from './drill-down-tree-map-chart.component';

describe('DrillDownTreeMapChartComponent', () => {
  let component: DrillDownTreeMapChartComponent;
  let fixture: ComponentFixture<DrillDownTreeMapChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillDownTreeMapChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrillDownTreeMapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
