import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DivergentStackedBarsComponent } from './divergent-stacked-bars.component';

describe('DivergentStackedBarsComponent', () => {
  let component: DivergentStackedBarsComponent;
  let fixture: ComponentFixture<DivergentStackedBarsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DivergentStackedBarsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DivergentStackedBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
