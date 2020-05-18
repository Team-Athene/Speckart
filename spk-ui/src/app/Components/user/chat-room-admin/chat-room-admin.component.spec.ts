import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomAdminComponent } from './chat-room-admin.component';

describe('ChatRoomAdminComponent', () => {
  let component: ChatRoomAdminComponent;
  let fixture: ComponentFixture<ChatRoomAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRoomAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRoomAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
