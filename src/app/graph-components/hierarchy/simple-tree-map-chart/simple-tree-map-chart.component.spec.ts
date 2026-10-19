import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimpleTreeMapChartComponent } from './simple-tree-map-chart.component';

describe('SimpleTreeMapChartComponent', () => {
  let component: SimpleTreeMapChartComponent;
  let fixture: ComponentFixture<SimpleTreeMapChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleTreeMapChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleTreeMapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
