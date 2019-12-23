import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

import { ReplaySubject, Observable, timer, from, Subscription } from 'rxjs';
import { takeUntil, tap, take } from 'rxjs/operators';

import RecordRTC from 'recordrtc/RecordRTC.min';

import { GoogleCloudSpeechRecognitionService } from './google-cloud-speech-recognition.service';

import { ISoundSource, IRecognitionLanguage, IProcessError, IGCRSError, IGCSRResult } from './google-cloud-speech-recognition.models';

import { SHORT_RECORD_MAXIMUM, SOUND_SOURCES } from './google-cloud-speech-recognition.constants';

export const RTC_RECORD_CONFIG = {
  recorderType: RecordRTC.StereoAudioRecorder,
  type: 'audio',
  mimeType: 'audio/wav',
  sampleRate: 48000,
  numberOfAudioChannels: 2
};

@Component({
  selector: 'gcsr-component',
  templateUrl: './google-cloud-speech-recognition.component.html',
  styleUrls: ['./google-cloud-speech-recognition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleCloudSpeechRecognitionComponent implements OnInit, OnDestroy {

  @Output() recognitionResults: EventEmitter<Array<IGCSRResult>> = new EventEmitter();
  @Output() errorHandler: EventEmitter<IProcessError> = new EventEmitter();

  private unsubscribe$: ReplaySubject<any> = new ReplaySubject(1);

  private recordRTC: any;

  readonly availableSoundSources: Array<ISoundSource> = SOUND_SOURCES;
  availableLanguages: Array<IRecognitionLanguage>;

  recordingTimer: Subscription;

  currentSoundSource: ISoundSource = this.availableSoundSources[0];
  currentLanguage: IRecognitionLanguage;

  currentShortRecordingSeconds: number;
  isShortRecording: boolean = false;
  languagesDropdownOpened: boolean = false;

  mediaStream: MediaStream;

  constructor(private cdRef: ChangeDetectorRef,
              private gcsrService: GoogleCloudSpeechRecognitionService) {
    this.setLanguages();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  /**
   * @method setLanguages
   * Sets languages and current language
   */
  private setLanguages(): void {
    this.availableLanguages = [
      {
        key: 'en-GB',
        label: 'English'
      }, {
        key: 'ru-RU',
        label: 'Русский'
      }, {
        key: 'eu-ES',
        label: 'Euskara'
      }, {
        key: 'de-DE',
        label: 'Deutsch'
      }
    ];

    this.currentLanguage = this.availableLanguages[0];
  }

  /**
   * @method startShortRecording
   * Starts recording short audio
   */
  private startShortRecording(): void {
    from(navigator.mediaDevices.getUserMedia({ audio: true, video: false }))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (mediaStream: MediaStream) => {
          // Used RecordRTC with StereoAudioRecorder lib as another libs cannot provide audio/wav format
          // MediaStream always provide audio/webm
          this.recordRTC = RecordRTC(mediaStream, RTC_RECORD_CONFIG);
          this.recordRTC.startRecording();

          this.mediaStream = mediaStream;
          this.isShortRecording = true;

          this.recordingTimer = timer(0, 1000)
            .pipe(
              take(SHORT_RECORD_MAXIMUM),
              tap((second: number) => {
                this.currentShortRecordingSeconds = second + 1;
                this.cdRef.detectChanges();

                if (second === (SHORT_RECORD_MAXIMUM - 1)) {
                  this.stopShortRecording();
                }
              })
            )
            .subscribe();
        },
        (error: DOMException) => {
          const errorOutput: IProcessError = {
            name: 'MEDIA_ERROR',
            message: error.message
          };
          this.errorHandler.next(errorOutput);
        }
      );
  }

  /**
   * @method stopShortRecording
   * Stops recording short audio
   */
  private stopShortRecording(): void {
    this.currentShortRecordingSeconds = 0;
    this.isShortRecording = false;
    this.recordingTimer.unsubscribe();
    this.recordRTC.stopRecording(() => {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(this.recordRTC.getBlob());
      reader.onloadend = ((base64Data: ProgressEvent) => {
        const preparedBase64Data: string = (reader.result as string).replace('data:audio/wav;base64,', '');
        this.googleProcessShortRecord(preparedBase64Data);
      });

      this.mediaStream.getAudioTracks().forEach((track: MediaStreamTrack) => track.stop());
      this.mediaStream = undefined;
    });
    this.cdRef.detectChanges();
  }

  /**
   * @method googleProcessShortRecord
   * Processes short record with google
   */
  googleProcessShortRecord(base64Data: string): void {
    this.gcsrService
      .sendToGoogleShortRecord(
        {
          sampleRateHertz: RTC_RECORD_CONFIG.sampleRate,
         "enableWordTimeOffsets": false,
         "audioChannelCount": 2,
         "encoding":"LINEAR16",
         languageCode: this.currentLanguage.key,
        }, base64Data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: Array<IGCSRResult>) => this.recognitionResults.next(results),
        (error: IGCRSError) => {
          const errorOutput: IProcessError = {
            name: 'GCSR_ERROR',
            message: error.message
          };
          this.errorHandler.next(errorOutput);
        }
      );
  }

  /**
   * @method processShortRecording
   * Starts or stops recording short audio
   */
  processShortRecording(): void {
    this.isShortRecording ? this.stopShortRecording() : this.startShortRecording();
  }

  /**
   * @method changeSoundSource
   * Change current sound source
   */
  changeSoundSource(soundSource: ISoundSource): void {
    this.currentSoundSource = soundSource;
    this.cdRef.detectChanges();
  }

  /**
   * @method chooseLanguage
   * Choose language for further recognition
   */
  chooseLanguage(language: IRecognitionLanguage): void {
    this.currentLanguage = language;
    this.toggleLanguagesDropdown();
  }

  /**
   * @method toggleLanguagesDropdown
   * Toggle languages dropdown
   */
  toggleLanguagesDropdown(): void {
    this.languagesDropdownOpened = !this.languagesDropdownOpened;
    this.cdRef.detectChanges();
  }

}
