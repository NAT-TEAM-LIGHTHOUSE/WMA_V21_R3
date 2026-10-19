import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EvenlySpacedDateAxisComponent } from './evenly-spaced-date-axis.component';

describe('EvenlySpacedDateAxisComponent', () => {
  let component: EvenlySpacedDateAxisComponent;
  let fixture: ComponentFixture<EvenlySpacedDateAxisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvenlySpacedDateAxisComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EvenlySpacedDateAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
