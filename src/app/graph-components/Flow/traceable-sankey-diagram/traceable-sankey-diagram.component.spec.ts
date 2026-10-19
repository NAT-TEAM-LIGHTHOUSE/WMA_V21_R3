import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TraceableSankeyDiagramComponent } from './traceable-sankey-diagram.component';

describe('TraceableSankeyDiagramComponent', () => {
  let component: TraceableSankeyDiagramComponent;
  let fixture: ComponentFixture<TraceableSankeyDiagramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceableSankeyDiagramComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TraceableSankeyDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
