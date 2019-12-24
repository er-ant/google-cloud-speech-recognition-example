import { ISoundSource } from './google-cloud-speech-recognition.models';

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
