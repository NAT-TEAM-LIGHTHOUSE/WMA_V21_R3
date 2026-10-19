import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistoricalPopulationPyramidComponent } from './historical-population-pyramid.component';

describe('HistoricalPopulationPyramidComponent', () => {
  let component: HistoricalPopulationPyramidComponent;
  let fixture: ComponentFixture<HistoricalPopulationPyramidComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalPopulationPyramidComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalPopulationPyramidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
