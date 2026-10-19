import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FunnelGradientFillComponent } from './funnel-gradient-fill.component';

describe('FunnelGradientFillComponent', () => {
  let component: FunnelGradientFillComponent;
  let fixture: ComponentFixture<FunnelGradientFillComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FunnelGradientFillComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FunnelGradientFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
