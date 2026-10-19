import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrillDownCongressioanlMapComponent } from './drill-down-congressioanl-map.component';

describe('DrillDownCongressioanlMapComponent', () => {
  let component: DrillDownCongressioanlMapComponent;
  let fixture: ComponentFixture<DrillDownCongressioanlMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillDownCongressioanlMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrillDownCongressioanlMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
