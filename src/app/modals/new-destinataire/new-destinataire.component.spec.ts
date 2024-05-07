import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDestinataireComponent } from './new-destinataire.component';

describe('NewDestinataireComponent', () => {
  let component: NewDestinataireComponent;
  let fixture: ComponentFixture<NewDestinataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDestinataireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDestinataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
