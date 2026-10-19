import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RangeChartDiffFillColorsComponent } from './range-chart-diff-fill-colors.component';

describe('RangeChartDiffFillColorsComponent', () => {
  let component: RangeChartDiffFillColorsComponent;
  let fixture: ComponentFixture<RangeChartDiffFillColorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeChartDiffFillColorsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RangeChartDiffFillColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
