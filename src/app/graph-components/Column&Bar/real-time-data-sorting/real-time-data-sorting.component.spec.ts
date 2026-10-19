import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RealTimeDataSortingComponent } from './real-time-data-sorting.component';

describe('RealTimeDataSortingComponent', () => {
  let component: RealTimeDataSortingComponent;
  let fixture: ComponentFixture<RealTimeDataSortingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RealTimeDataSortingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RealTimeDataSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
