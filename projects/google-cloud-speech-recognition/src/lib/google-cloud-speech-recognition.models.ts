type SoundSource = 'microrecord' | 'stream';

export interface IGCSRServiceConfig {
  googleKey: string;
}

export interface ISoundSource {
  key: SoundSource;
  label: string;
}

export interface IProcessError {
  name: 'MEDIA_ERROR' | 'GCSR_ERROR' | 'COMPONENT_ERRORS';
  message: string;
}

export interface IGCRSError {
  code: number;
  message: string;
  status: string;
}

export interface IRecognitionLanguage {
  key: string;
  label: string;
}

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
