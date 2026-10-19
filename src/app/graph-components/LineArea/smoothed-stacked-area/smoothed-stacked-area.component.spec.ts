import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SmoothedStackedAreaComponent } from './smoothed-stacked-area.component';

describe('SmoothedStackedAreaComponent', () => {
  let component: SmoothedStackedAreaComponent;
  let fixture: ComponentFixture<SmoothedStackedAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmoothedStackedAreaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SmoothedStackedAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
