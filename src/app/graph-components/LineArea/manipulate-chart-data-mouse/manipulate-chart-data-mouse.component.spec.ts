import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManipulateChartDataMouseComponent } from './manipulate-chart-data-mouse.component';

describe('ManipulateChartDataMouseComponent', () => {
  let component: ManipulateChartDataMouseComponent;
  let fixture: ComponentFixture<ManipulateChartDataMouseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManipulateChartDataMouseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManipulateChartDataMouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
