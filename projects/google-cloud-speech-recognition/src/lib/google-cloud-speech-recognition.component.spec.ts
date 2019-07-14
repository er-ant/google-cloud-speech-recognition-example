import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleCloudSpeechRecognitionComponent } from './google-cloud-speech-recognition.component';

describe('GoogleCloudSpeechRecognitionComponent', () => {
  let component: GoogleCloudSpeechRecognitionComponent;
  let fixture: ComponentFixture<GoogleCloudSpeechRecognitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleCloudSpeechRecognitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleCloudSpeechRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
