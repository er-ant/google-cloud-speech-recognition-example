import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

import { ReplaySubject, Observable, timer, from, Subscription } from 'rxjs';
import { takeUntil, tap, take } from 'rxjs/operators';

import RecordRTC from 'recordrtc/RecordRTC.min';

import { GoogleCloudSpeechRecognitionService } from './google-cloud-speech-recognition.service';

import {
  ISoundSource, IRecognitionLanguage, IProcessError, IGCRSError, IRecognitionResults, IRTCConfigs, IGCSRConfigs
} from './google-cloud-speech-recognition.models';

import {
  SHORT_RECORD_MAXIMUM, DEFAULT_SOUND_SOURCES, DEFAULT_AVAILABLE_LANGUAGES, DEFAULT_RTC_CONFIGS, DEFAULT_GCSR_CONFIGS
} from './google-cloud-speech-recognition.constants';

@Component({
  selector: 'gcsr-component',
  templateUrl: './google-cloud-speech-recognition.component.html',
  styleUrls: ['./google-cloud-speech-recognition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleCloudSpeechRecognitionComponent implements OnInit, OnDestroy {

  @Input() availableSoundSources: Array<ISoundSource> = DEFAULT_SOUND_SOURCES;
  @Input() availableLanguages: Array<IRecognitionLanguage> = DEFAULT_AVAILABLE_LANGUAGES;
  @Input() set gcsrConfigs(value: IGCSRConfigs) {
    if (value) {
      this.GCSRConfigs = {
        ...DEFAULT_GCSR_CONFIGS,
        ...value
      };
    }
  }

  @Output() recognitionResults: EventEmitter<Array<IRecognitionResults>> = new EventEmitter();
  @Output() errorHandler: EventEmitter<IProcessError> = new EventEmitter();

  private unsubscribe$: ReplaySubject<any> = new ReplaySubject(1);

  private recordRTC: any;
  private audioContext: AudioContext;
  private mediaStreamAudioNode: MediaStreamAudioSourceNode;

  private RTCConfigs: IRTCConfigs = DEFAULT_RTC_CONFIGS;
  private GCSRConfigs: IGCSRConfigs;

  currentLanguage: IRecognitionLanguage;
  languagesDropdownOpened: boolean = false;

  currentSoundSource: ISoundSource = this.availableSoundSources[0];

  mediaStream: MediaStream;

  isShortRecording: boolean = false;

  // Short records part
  recordingTimer: Subscription;
  currentShortRecordingSeconds: number;

  constructor(private cdRef: ChangeDetectorRef,
              private GCSRService: GoogleCloudSpeechRecognitionService) {
    this.currentLanguage = this.availableLanguages[0];
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  /**
   * Starts recording short audio
   * @method startShortRecording
   */
  private startShortRecording(): void {
    from(navigator.mediaDevices.getUserMedia({ audio: true, video: false }))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (mediaStream: MediaStream) => {
          this.audioContext = new AudioContext();
          this.mediaStreamAudioNode = this.audioContext.createMediaStreamSource(mediaStream);
          // Take frequency and channels from current device
          this.RTCConfigs.sampleRate = this.audioContext.sampleRate;
          this.RTCConfigs.numberOfAudioChannels = this.mediaStreamAudioNode.channelCount;
          // Used RecordRTC with StereoAudioRecorder lib as another libs cannot provide audio/wav format
          // MediaStream always provide audio/webm
          this.recordRTC = RecordRTC(mediaStream, this.RTCConfigs);
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
   * Stops recording short audio
   * @method stopShortRecording
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
      this.audioContext.close();
      this.mediaStreamAudioNode.disconnect();

      this.mediaStream = undefined;
      this.audioContext = undefined;
      this.mediaStreamAudioNode = undefined;
    });
    this.cdRef.detectChanges();
  }

  /**
   * Returns if component is available for actions otherwise emits errors
   * @method isAvailable
   */
  private isAvailable(): boolean {
    if (this.isShortRecording) {
      const errorOutput: IProcessError = {
        name: 'COMPONENT_ERRORS',
        message: 'Complete previous recording first!'
      };

      this.errorHandler.next(errorOutput);
      return false;
    }
  }

  /**
   * Processes short record with google
   * @method googleProcessShortRecord
   */
  private googleProcessShortRecord(base64Data: string): void {
    const GCSRConfigs: IGCSRConfigs = {
      ...this.GCSRConfigs,
      audioChannelCount: this.RTCConfigs.numberOfAudioChannels,
      languageCode: this.currentLanguage.key,
      sampleRateHertz: this.RTCConfigs.sampleRate
    };

    this.GCSRService
      .sendToGoogleShortRecord(GCSRConfigs, base64Data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: Array<IRecognitionResults>) => this.recognitionResults.next(results),
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
   * Starts or stops recording short audio
   * @method processShortRecording
   */
  processShortRecording(): void {
    this.isShortRecording ? this.stopShortRecording() : this.startShortRecording();
  }

  /**
   * Change current sound source
   * @method changeSoundSource
   */
  changeSoundSource(soundSource: ISoundSource): void {
    if (this.isAvailable()) {
      return;
    }

    this.currentSoundSource = soundSource;
    this.cdRef.detectChanges();
  }

  /**
   * Choose language for further recognition
   * @method chooseLanguage
   */
  chooseLanguage(language: IRecognitionLanguage): void {
    if (this.isAvailable()) {
      return;
    }

    this.currentLanguage = language;
    this.toggleLanguagesDropdown();
  }

  /**
   * Toggle languages dropdown
   * @method toggleLanguagesDropdown
   */
  toggleLanguagesDropdown(): void {
    if (this.isAvailable()) {
      return;
    }

    this.languagesDropdownOpened = !this.languagesDropdownOpened;
    this.cdRef.detectChanges();
  }
}
