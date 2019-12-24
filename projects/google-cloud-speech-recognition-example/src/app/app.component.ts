import { Component } from '@angular/core';

import { IRecognitionResults } from 'projects/google-cloud-speech-recognition/src/public-api';

@Component({
  selector: 'gcsr-example-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  gcsrResultsGroups: Array<Array<IRecognitionResults>> = [];

  gcsrResultsHandler($event: Array<IRecognitionResults>): void {
    this.gcsrResultsGroups.unshift($event);
  }
}
