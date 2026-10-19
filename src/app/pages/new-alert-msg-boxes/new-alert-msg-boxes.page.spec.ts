import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewAlertMsgBoxesPage } from './new-alert-msg-boxes.page';

describe('NewAlertMsgBoxesPage', () => {
  let component: NewAlertMsgBoxesPage;
  let fixture: ComponentFixture<NewAlertMsgBoxesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAlertMsgBoxesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
