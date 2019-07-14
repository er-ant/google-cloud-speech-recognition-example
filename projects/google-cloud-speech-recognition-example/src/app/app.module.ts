import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GoogleCloudSpeechRecognitionModule } from '../../../google-cloud-speech-recognition/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    GoogleCloudSpeechRecognitionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
