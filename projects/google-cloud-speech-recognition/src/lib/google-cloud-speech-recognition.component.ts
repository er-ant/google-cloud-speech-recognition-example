import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

import { ReplaySubject, Observable, timer } from 'rxjs';
import { takeUntil, map, take } from 'rxjs/operators';

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

  recordingTimer: Observable<string>;

  currentSoundSource: SoundSource = 'micro';
  currentLanguage: IRecognitionLanguage;

  isRecording: boolean = false;
  languagesDropdownOpened: boolean = false;

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
    if (!this.isRecording) {
      this.isRecording = true;
      this.recordingTimer = timer(0, 1000)
        .pipe(
          map((index: number) => {
            return index + 1 + '';
          }),
          take(30)
        );
      this.cdRef.detectChanges();

      // var player: HTMLAudioElement = <HTMLAudioElement>document.getElementById('player');

      // var handleSuccess = function(stream) {
      //   console.log(stream);
      //   var context = new AudioContext();
      //   var source = context.createMediaStreamSource(stream);
      //   var processor = context.createScriptProcessor(1024, 1, 1);
      //   var analyzer = context.createAnalyser();

      //   source.connect(processor);
      //   processor.connect(context.destination);

      //   processor.onaudioprocess = function(e) {
      //     // Do something with the data, i.e Convert this to WAV
      //     console.log(e.inputBuffer);
      //   };
      // };

      // navigator.mediaDevices
      //   .getUserMedia({ audio: true, video: false })
      //   .then(handleSuccess)
      //   .catch(err => console.log(err));
    } else {
      this.isRecording = false;
      this.recordingTimer = null;
      this.cdRef.detectChanges();
    }
  }
}
