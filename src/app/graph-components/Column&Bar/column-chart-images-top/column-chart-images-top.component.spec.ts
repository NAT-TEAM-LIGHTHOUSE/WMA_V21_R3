import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColumnChartImagesTopComponent } from './column-chart-images-top.component';

describe('ColumnChartImagesTopComponent', () => {
  let component: ColumnChartImagesTopComponent;
  let fixture: ComponentFixture<ColumnChartImagesTopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnChartImagesTopComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnChartImagesTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
