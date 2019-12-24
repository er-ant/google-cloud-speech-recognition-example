/* Public Models */
export interface IProcessError {
  name: 'MEDIA_ERROR' | 'GCSR_ERROR' | 'COMPONENT_ERRORS';
  message: string;
}

/* Configs */
export interface IGCSRServiceConfig {
  googleKey: string;
}

export interface IGCSRConfigs {
  encoding: 'ENCODING_UNSPECIFIED' | 'LINEAR16' | 'FLAC' | 'MULAW' | 'AMR' | 'AMR_WB' | 'OGG_OPUS' | 'SPEEX_WITH_HEADER_BYTE';
  diarizationConfig?: {
    enableSpeakerDiarization: boolean;
    minSpeakerCount: number;
    maxSpeakerCount: number;
  };
  metadata?: {
    audioTopic?: string;
    industryNaicsCodeOfAudio?: number;
    interactionType?: any;
    microphoneDistance?: any;
    obfuscatedId?: string;
    originalMediaType?: any;
    originalMimeType?: string;
    recordingDeviceName?: string;
    recordingDeviceType?: any;
  };
  audioChannelCount: number;
  enableAutomaticPunctuation?: boolean;
  enableSeparateRecognitionPerChannel?: boolean;
  enableWordTimeOffsets?: boolean;
  languageCode: string;
  maxAlternatives?: number;
  model?: string;
  profanityFilter?: boolean;
  sampleRateHertz: number;
  speechContexts?: Array<any>;
  useEnhanced?: boolean;
}

export interface IRTCConfigs {
  type: 'audio' | 'video' | 'canvas' | 'gif';
  // audio/webm
  // video/webm;codecs=vp9
  // video/webm;codecs=vp8
  // video/webm;codecs=h264
  // video/x-matroska;codecs=avc1
  // video/mpeg -- NOT supported by any browser, yet
  // video/mp4  -- NOT supported by any browser, yet
  // audio/wav
  // audio/ogg  -- ONLY Firefox
  // demo: simple-demos/isTypeSupported.html
  mimeType: string;
  // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
  // CanvasRecorder, GifRecorder, WhammyRecorder
  recorderType: any;
  // disable logs
  disableLogs?: boolean;
  // get intervals based blobs
  // value in milliseconds
  timeSlice?: number;
  // requires timeSlice above
  // returns blob via callback function
  ondataavailable?: (blob) => {};
  // auto stop recording if camera stops
  checkForInactiveTracks?: boolean,
  // requires timeSlice above
  onTimeStamp?: (timestamp) => {};
  // both for audio and video tracks
  bitsPerSecond?: number;
  // only for audio track
  audioBitsPerSecond?: number;
  // only for video track
  videoBitsPerSecond?: number;
  // used by CanvasRecorder and WhammyRecorder
  // it is kind of a "frameRate"
  frameInterval?: number;
  // if you are recording multiple streams into single file
  // this helps you see what is being recorded
  previewStream?: (stream) => {};
  // used by CanvasRecorder and WhammyRecorder
  // you can pass {width:640, height: 480} as well
  video?: HTMLVideoElement;
  // used by CanvasRecorder and WhammyRecorder
  canvas?: object;
  // used by StereoAudioRecorder
  // the range 22050 to 96000.
  sampleRate: number;
  // used by StereoAudioRecorder
  // the range 22050 to 96000.
  // let us force 16khz recording:
  desiredSampRate?: number;
  // used by StereoAudioRecorder
  // Legal values are (256, 512, 1024, 2048, 4096, 8192, 16384).
  bufferSize?: number;
  // used by StereoAudioRecorder
  // 1 or 2
  numberOfAudioChannels: number;
  // used by WebAssemblyRecorder
  frameRate?: number;
  // used by WebAssemblyRecorder
  bitrate?: number;
  // used by MultiStreamRecorder - to access HTMLCanvasElement
  elementClass?: string;
}

/* GCSR Requests Responses bodies */
export interface IGCSRRequestBody {
  config: IGCSRConfigs;
  audio: {
    content: string;
  };
}

export interface IGCSRResponse {
  results: Array<IGCSRResult>;
}

export interface IGCSRResult {
  alternatives: Array<IRecognitionResults>;
}

export interface IRecognitionResults {
  confidence: number;
  transcript: string;
}

export interface IGCRSError {
  code: number;
  message: string;
  status: string;
}

/* Sound Sources part and etc. */
type SoundSource = 'microrecord' | 'stream';

export interface ISoundSource {
  key: SoundSource;
  label: string;
}

export interface IRecognitionLanguage {
  key: string;
  label: string;
}
