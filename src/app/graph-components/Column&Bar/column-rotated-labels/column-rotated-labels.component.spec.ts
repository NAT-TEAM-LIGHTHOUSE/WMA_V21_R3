import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColumnRotatedLabelsComponent } from './column-rotated-labels.component';

describe('ColumnRotatedLabelsComponent', () => {
  let component: ColumnRotatedLabelsComponent;
  let fixture: ComponentFixture<ColumnRotatedLabelsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnRotatedLabelsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnRotatedLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
