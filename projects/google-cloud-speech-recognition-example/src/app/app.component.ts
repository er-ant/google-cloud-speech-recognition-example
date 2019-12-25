import { Component } from '@angular/core';

import { IRecognitionResults, IProcessError } from 'projects/google-cloud-speech-recognition/src/public-api';

@Component({
  selector: 'gcsr-example-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  gcsrConfigs = {
    maxAlternatives: 5,
    profanityFilter: true
  }

  gcsrResultsGroups: Array<Array<IRecognitionResults>> = [];

  gcsrResultsHandler($event: Array<IRecognitionResults>): void {
    this.gcsrResultsGroups.unshift($event);
  }

  errorHandler($event: IProcessError): void {
    alert($event.message);
  }
}
