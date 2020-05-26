import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeVoteComponent } from './dispute-vote.component';

describe('DisputeVoteComponent', () => {
  let component: DisputeVoteComponent;
  let fixture: ComponentFixture<DisputeVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisputeVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputeVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
