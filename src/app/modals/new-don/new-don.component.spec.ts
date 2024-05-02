import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDonComponent } from './new-don.component';

describe('NewDonComponent', () => {
  let component: NewDonComponent;
  let fixture: ComponentFixture<NewDonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
