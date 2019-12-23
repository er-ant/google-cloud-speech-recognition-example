import { InjectionToken } from '@angular/core';

import { IGCSRServiceConfig } from './google-cloud-speech-recognition.models';

export const GSCRConfig = new InjectionToken<IGCSRServiceConfig>('Configs for GCSR services');
