import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GrainyGradientPieComponent } from './grainy-gradient-pie.component';

describe('GrainyGradientPieComponent', () => {
  let component: GrainyGradientPieComponent;
  let fixture: ComponentFixture<GrainyGradientPieComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GrainyGradientPieComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GrainyGradientPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
