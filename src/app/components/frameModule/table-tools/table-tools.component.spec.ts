import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TableToolsComponent } from './table-tools.component';

describe('TableToolsComponent', () => {
  let component: TableToolsComponent;
  let fixture: ComponentFixture<TableToolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), TableToolsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
