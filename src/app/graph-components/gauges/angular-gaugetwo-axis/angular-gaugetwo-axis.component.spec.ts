import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AngularGaugetwoAxisComponent } from './angular-gaugetwo-axis.component';

describe('AngularGaugetwoAxisComponent', () => {
  let component: AngularGaugetwoAxisComponent;
  let fixture: ComponentFixture<AngularGaugetwoAxisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularGaugetwoAxisComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AngularGaugetwoAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
