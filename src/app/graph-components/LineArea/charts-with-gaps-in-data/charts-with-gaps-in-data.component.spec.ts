import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChartsWithGapsInDataComponent } from './charts-with-gaps-in-data.component';

describe('ChartsWithGapsInDataComponent', () => {
  let component: ChartsWithGapsInDataComponent;
  let fixture: ComponentFixture<ChartsWithGapsInDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsWithGapsInDataComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartsWithGapsInDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
