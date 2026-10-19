import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineWithDifferentColorUpsDownsComponent } from './line-with-different-color-ups-downs.component';

describe('LineWithDifferentColorUpsDownsComponent', () => {
  let component: LineWithDifferentColorUpsDownsComponent;
  let fixture: ComponentFixture<LineWithDifferentColorUpsDownsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineWithDifferentColorUpsDownsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineWithDifferentColorUpsDownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
