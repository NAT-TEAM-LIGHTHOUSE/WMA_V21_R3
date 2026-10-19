import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DataGroupingFiftyThousandPointsComponent } from './data-grouping-fifty-thousand-points.component';

describe('DataGroupingFiftyThousandPointsComponent', () => {
  let component: DataGroupingFiftyThousandPointsComponent;
  let fixture: ComponentFixture<DataGroupingFiftyThousandPointsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataGroupingFiftyThousandPointsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DataGroupingFiftyThousandPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
