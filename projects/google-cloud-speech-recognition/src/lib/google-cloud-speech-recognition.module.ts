import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleCloudSpeechRecognitionComponent } from './google-cloud-speech-recognition.component';

@NgModule({
  declarations: [
    GoogleCloudSpeechRecognitionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GoogleCloudSpeechRecognitionComponent
  ]
})
export class GoogleCloudSpeechRecognitionModule { }
