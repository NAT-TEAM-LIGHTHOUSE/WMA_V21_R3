import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameRelationalTableFilterComponent } from './frame-relational-table-filter.component';

describe('FrameRelationalTableFilterComponent', () => {
  let component: FrameRelationalTableFilterComponent;
  let fixture: ComponentFixture<FrameRelationalTableFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameRelationalTableFilterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameRelationalTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
