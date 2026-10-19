import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClusteredColumnChartComponent } from './clustered-column-chart.component';

describe('ClusteredColumnChartComponent', () => {
  let component: ClusteredColumnChartComponent;
  let fixture: ComponentFixture<ClusteredColumnChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusteredColumnChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClusteredColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
