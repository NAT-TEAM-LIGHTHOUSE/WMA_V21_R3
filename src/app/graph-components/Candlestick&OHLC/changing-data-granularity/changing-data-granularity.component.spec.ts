import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangingDataGranularityComponent } from './changing-data-granularity.component';

describe('ChangingDataGranularityComponent', () => {
  let component: ChangingDataGranularityComponent;
  let fixture: ComponentFixture<ChangingDataGranularityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangingDataGranularityComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangingDataGranularityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
