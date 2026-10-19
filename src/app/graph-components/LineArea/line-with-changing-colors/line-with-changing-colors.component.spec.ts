import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineWithChangingColorsComponent } from './line-with-changing-colors.component';

describe('LineWithChangingColorsComponent', () => {
  let component: LineWithChangingColorsComponent;
  let fixture: ComponentFixture<LineWithChangingColorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineWithChangingColorsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineWithChangingColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
