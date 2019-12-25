import RecordRTC from 'recordrtc/RecordRTC.min';

import { ISoundSource, IRecognitionLanguage, IRTCConfigs, IGCSRConfigs } from './google-cloud-speech-recognition.models';

export const DEFAULT_RTC_CONFIGS: IRTCConfigs = {
  recorderType: RecordRTC.StereoAudioRecorder,
  type: 'audio' as const,
  mimeType: 'audio/wav',
  sampleRate: 44100,
  numberOfAudioChannels: 2,
  timeSlice: 500
};

export const DEFAULT_GCSR_CONFIGS: IGCSRConfigs = {
  sampleRateHertz: 44100,
  enableSeparateRecognitionPerChannel: false,
  profanityFilter: false,
  enableWordTimeOffsets: false,
  audioChannelCount: 2,
  encoding:'LINEAR16',
  languageCode: 'en-GB'
};

export const SHORT_RECORD_MAXIMUM: number = 30;

export const DEFAULT_SOUND_SOURCES: Array<ISoundSource> = [
  {
    key: 'microrecord',
    label: 'SHORT RECORD'
  }, {
    key: 'stream',
    label: 'STREAM'
  }
]

export const DEFAULT_AVAILABLE_LANGUAGES: Array<IRecognitionLanguage> = [
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
]
