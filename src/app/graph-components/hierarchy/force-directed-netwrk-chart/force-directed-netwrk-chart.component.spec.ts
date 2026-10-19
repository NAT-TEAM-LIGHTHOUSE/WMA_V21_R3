import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForceDirectedNetwrkChartComponent } from './force-directed-netwrk-chart.component';

describe('ForceDirectedNetwrkChartComponent', () => {
  let component: ForceDirectedNetwrkChartComponent;
  let fixture: ComponentFixture<ForceDirectedNetwrkChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceDirectedNetwrkChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForceDirectedNetwrkChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
