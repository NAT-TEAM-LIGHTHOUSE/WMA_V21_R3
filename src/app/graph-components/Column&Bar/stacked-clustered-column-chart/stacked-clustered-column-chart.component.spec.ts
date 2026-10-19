import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StackedClusteredColumnChartComponent } from './stacked-clustered-column-chart.component';

describe('StackedClusteredColumnChartComponent', () => {
  let component: StackedClusteredColumnChartComponent;
  let fixture: ComponentFixture<StackedClusteredColumnChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedClusteredColumnChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StackedClusteredColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
