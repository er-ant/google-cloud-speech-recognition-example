import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

import { ReplaySubject, Observable, timer, from } from 'rxjs';
import { takeWhile, tap, take, finalize } from 'rxjs/operators';

declare var MediaRecorder: any;

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

  @Input() history: boolean = true;
  @Input() checkRecognition: boolean = true;

  @Output() recognitionResult: EventEmitter<any> = new EventEmitter();

  private readonly availableLanguages: Array<IRecognitionLanguage>;

  private unsubscribe$: ReplaySubject<any> = new ReplaySubject(1);

  recordingTimer: Observable<number>;

  currentSoundSource: SoundSource = 'micro';
  currentLanguage: IRecognitionLanguage;
  currentSeconds: number;

  isRecording: boolean = false;
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
   * @method changeSoundSource
   * Change current sound source
   */
  changeSoundSource(soundSource: SoundSource): void {
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

  /**
   * @method startRecording
   * Starts or stops audio recording
   */
  startRecording(): void {
    from(navigator.mediaDevices.getUserMedia({audio: true, video: false}))
      .subscribe(
        (mediaStream: MediaStream) => {
          this.mediaStream = mediaStream;
          this.isRecording = true;

          this.recordingTimer = timer(0, 1000)
            .pipe(
              take(30),
              takeWhile(() => !!this.recordingTimer),
              tap((index: number) => {
                this.currentSeconds = index + 1;
                this.cdRef.detectChanges();
                // return index + 1 + '';
              }),
              finalize(() => {
                this.stopRecording();
              })
            );
          this.recordingTimer.subscribe();


          this.cdRef.detectChanges();

          this.mediaRecorder = new MediaRecorder(mediaStream);
          this.mediaRecorder.start();

          const audioChunks: Array<Blob> = [];

          this.mediaRecorder.addEventListener('dataavailable', (event: any) => audioChunks.push(event.data));

          this.mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks);
          });
        },
        (err: DOMException) => console.log(err.message)
      );
  }

  /**
   * @method stopRecording
   * Stops recording
   */
  stopRecording(): void {
    console.log('hi');
    this.currentSeconds = 0;
    this.isRecording = false;
    this.recordingTimer = null;
    this.recordingTimer
    this.mediaRecorder.stop();
    this.mediaStream.getAudioTracks().forEach((track: MediaStreamTrack) => track.stop());
    this.mediaStream = undefined;
    this.cdRef.detectChanges();
  }
}
