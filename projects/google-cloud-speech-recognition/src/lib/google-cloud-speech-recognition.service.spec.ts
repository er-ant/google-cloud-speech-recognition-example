import { TestBed } from '@angular/core/testing';

import { GoogleCloudSpeechRecognitionService } from './google-cloud-speech-recognition.service';

describe('GoogleCloudSpeechRecognitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleCloudSpeechRecognitionService = TestBed.get(GoogleCloudSpeechRecognitionService);
    expect(service).toBeTruthy();
  });
});
