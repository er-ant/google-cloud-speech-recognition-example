import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gcsr-component',
  templateUrl: './google-cloud-speech-recognition.component.html',
  styleUrls: ['./google-cloud-speech-recognition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleCloudSpeechRecognitionComponent implements OnInit {

  @Input() history: boolean = true;
  @Input() checkRecognition: boolean = true;

  @Output() recognitionResult: EventEmitter<any> = new EventEmitter();

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
