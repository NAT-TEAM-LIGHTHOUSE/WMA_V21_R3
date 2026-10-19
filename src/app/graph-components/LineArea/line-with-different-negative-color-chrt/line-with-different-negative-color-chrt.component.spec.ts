import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineWithDifferentNegativeColorChrtComponent } from './line-with-different-negative-color-chrt.component';

describe('LineWithDifferentNegativeColorChrtComponent', () => {
  let component: LineWithDifferentNegativeColorChrtComponent;
  let fixture: ComponentFixture<LineWithDifferentNegativeColorChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineWithDifferentNegativeColorChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineWithDifferentNegativeColorChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
