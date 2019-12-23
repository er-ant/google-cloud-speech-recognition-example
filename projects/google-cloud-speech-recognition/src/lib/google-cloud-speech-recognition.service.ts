import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IGCSRServiceConfig, IGCSRConfigs, IGCSRRequestBody, IGCSRResponse, IGCSRResult } from './google-cloud-speech-recognition.models';

import { GSCRConfig } from './google-cloud-speech-recognition.tokens';

@Injectable()
export class GoogleCloudSpeechRecognitionService {

  constructor(private http: HttpClient,
              @Inject(GSCRConfig) private GSCRConfig: IGCSRServiceConfig) { }

  /**
   * @method sendToGoogleShortRecord
   * Sends short record to google
   */
  sendToGoogleShortRecord(config: IGCSRConfigs, base64Data: string): Observable<Array<IGCSRResult>> {
    const url: string = `https://speech.googleapis.com/v1/speech:recognize?key=${this.GSCRConfig.googleKey}`;

    const reqBody: IGCSRRequestBody = {
      config,
      audio: {
        content: base64Data
      }
    };

    return this.http
      .post<IGCSRResponse>(url, reqBody)
      .pipe(
        map((res: IGCSRResponse) => res.results),
        catchError((error: HttpErrorResponse) => {
          if (error.error && error.error.error) {
            return throwError(error.error.error);
          } else {
            return throwError(error.error);
          }
        })
      );
  }

}
