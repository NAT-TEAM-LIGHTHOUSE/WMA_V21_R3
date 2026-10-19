import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerticalSankeyDiagramComponent } from './vertical-sankey-diagram.component';

describe('VerticalSankeyDiagramComponent', () => {
  let component: VerticalSankeyDiagramComponent;
  let fixture: ComponentFixture<VerticalSankeyDiagramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalSankeyDiagramComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalSankeyDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
