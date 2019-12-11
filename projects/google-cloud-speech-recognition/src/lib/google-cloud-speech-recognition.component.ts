import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

import { ReplaySubject, Observable, timer, from, Subscription } from 'rxjs';
import { takeUntil, tap, take } from 'rxjs/operators';

export const SHORT_RECORD_MAXIMUM: number = 30;

export const SOUND_SOURCES: Array<ISoundSource> = [
  {
    key: 'micro',
    label: 'MICROPHONE'
  }, {
    key: 'upload',
    label: 'FILE UPLOAD'
  }
]

export interface ISoundSource {
  key: SoundSource;
  label: string;
}

type SoundSource = 'micro' | 'upload';

export interface IRecognitionLanguage {
  key: string;
  label: string;
}

@Component({
  selector: 'gcsr-component',
  templateUrl: './google-cloud-speech-recognition.component.html',
  styleUrls: ['./google-cloud-speech-recognition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleCloudSpeechRecognitionComponent implements OnInit, OnDestroy {

  // @Input() history: boolean = true;
  // @Input() checkRecognition: boolean = true;

  @Output() recognitionResult: EventEmitter<any> = new EventEmitter();

  private unsubscribe$: ReplaySubject<any> = new ReplaySubject(1);

  readonly availableSoundSources: Array<ISoundSource> = SOUND_SOURCES;
  availableLanguages: Array<IRecognitionLanguage>;

  recordingTimer: Subscription;

  currentSoundSource: ISoundSource = this.availableSoundSources[0];
  currentLanguage: IRecognitionLanguage;

  currentShortRecordingSeconds: number;
  isShortRecording: boolean = false;
  languagesDropdownOpened: boolean = false;

  mediaRecorder: any;
  mediaStream: MediaStream;

  constructor(private cdRef: ChangeDetectorRef) {
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

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
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

          this.mediaRecorder = new MediaRecorder(this.mediaStream);
          this.mediaRecorder.start();

          const audioChunks: Array<Blob> = [];

          this.mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
            audioChunks.push(event.data);
          });

          this.mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks);
          });
        },
        (err: DOMException) => console.log(err.message)
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
    this.mediaRecorder.stop();
    this.mediaStream.getAudioTracks().forEach((track: MediaStreamTrack) => track.stop());
    this.mediaStream = undefined;
    this.cdRef.detectChanges();
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
