import { ISoundSource, IRecognitionLanguage } from './google-cloud-speech-recognition.models';

export const SHORT_RECORD_MAXIMUM: number = 30;

export const SOUND_SOURCES: Array<ISoundSource> = [
  {
    key: 'microrecord',
    label: 'SHORT RECORD'
  }, {
    key: 'stream',
    label: 'STREAM'
  }
]

export const AVAILABLE_LANGUAGES: Array<IRecognitionLanguage> = [
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
