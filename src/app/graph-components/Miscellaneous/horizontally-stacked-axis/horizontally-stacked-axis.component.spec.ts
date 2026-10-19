import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HorizontallyStackedAxisComponent } from './horizontally-stacked-axis.component';

describe('HorizontallyStackedAxisComponent', () => {
  let component: HorizontallyStackedAxisComponent;
  let fixture: ComponentFixture<HorizontallyStackedAxisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontallyStackedAxisComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontallyStackedAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
