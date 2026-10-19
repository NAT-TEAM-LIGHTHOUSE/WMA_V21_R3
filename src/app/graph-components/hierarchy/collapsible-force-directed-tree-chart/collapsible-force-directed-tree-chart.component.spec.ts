import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CollapsibleForceDirectedTreeChartComponent } from './collapsible-force-directed-tree-chart.component';

describe('CollapsibleForceDirectedTreeChartComponent', () => {
  let component: CollapsibleForceDirectedTreeChartComponent;
  let fixture: ComponentFixture<CollapsibleForceDirectedTreeChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollapsibleForceDirectedTreeChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CollapsibleForceDirectedTreeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
