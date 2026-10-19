import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupedSortedColumnsComponent } from './grouped-sorted-columns.component';

describe('GroupedSortedColumnsComponent', () => {
  let component: GroupedSortedColumnsComponent;
  let fixture: ComponentFixture<GroupedSortedColumnsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedSortedColumnsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupedSortedColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
