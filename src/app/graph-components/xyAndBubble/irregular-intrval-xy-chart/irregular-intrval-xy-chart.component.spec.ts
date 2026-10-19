import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IrregularIntrvalXyChartComponent } from './irregular-intrval-xy-chart.component';

describe('IrregularIntrvalXyChartComponent', () => {
  let component: IrregularIntrvalXyChartComponent;
  let fixture: ComponentFixture<IrregularIntrvalXyChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IrregularIntrvalXyChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IrregularIntrvalXyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
