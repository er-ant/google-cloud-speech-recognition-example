import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { GoogleCloudSpeechRecognitionComponent } from './google-cloud-speech-recognition.component';

import { GoogleCloudSpeechRecognitionService } from './google-cloud-speech-recognition.service';

import { IGCSRServiceConfig } from './google-cloud-speech-recognition.models';

import { GSCRConfig } from './google-cloud-speech-recognition.tokens';

@NgModule({
  declarations: [
    GoogleCloudSpeechRecognitionComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    GoogleCloudSpeechRecognitionComponent
  ]
})
export class GoogleCloudSpeechRecognitionModule {

  static forRoot(config: IGCSRServiceConfig): ModuleWithProviders {
    return {
      ngModule: GoogleCloudSpeechRecognitionModule,
      providers: [
        GoogleCloudSpeechRecognitionService,
        { provide: GSCRConfig, useValue: config }
      ]
    };
  }
}
