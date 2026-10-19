import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameMmtJsonFilterComponent } from './frame-mmt-json-filter.component';

describe('FrameMmtJsonFilterComponent', () => {
  let component: FrameMmtJsonFilterComponent;
  let fixture: ComponentFixture<FrameMmtJsonFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameMmtJsonFilterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameMmtJsonFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
