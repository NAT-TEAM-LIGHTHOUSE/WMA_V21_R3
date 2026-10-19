import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeparateVolumePanelChartComponent } from './separate-volume-panel-chart.component';

describe('SeparateVolumePanelChartComponent', () => {
  let component: SeparateVolumePanelChartComponent;
  let fixture: ComponentFixture<SeparateVolumePanelChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeparateVolumePanelChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeparateVolumePanelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
