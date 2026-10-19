import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReversedValueAxisChrtComponent } from './reversed-value-axis-chrt.component';

describe('ReversedValueAxisChrtComponent', () => {
  let component: ReversedValueAxisChrtComponent;
  let fixture: ComponentFixture<ReversedValueAxisChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReversedValueAxisChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReversedValueAxisChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
