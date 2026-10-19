import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreaTimeBasedDataComponent } from './area-time-based-data.component';

describe('AreaTimeBasedDataComponent', () => {
  let component: AreaTimeBasedDataComponent;
  let fixture: ComponentFixture<AreaTimeBasedDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaTimeBasedDataComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaTimeBasedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
