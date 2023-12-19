import { WizardStep } from '../../store/models/make-a-referral.models';

export const LANGUAGE_ARCH_TYPE = 'language';
export const LANGUAGE_INTERPRETATION_STEP_NAME =
  LANGUAGE_ARCH_TYPE + '-interpretation';
export const LANGUAGE_TRANSLATION_STEP_NAME =
  LANGUAGE_ARCH_TYPE + '-translation';
export const LANGUAGE_REVIEW_STEP_NAME = LANGUAGE_ARCH_TYPE + '-review';
export const LANGUAGE_VENDOR_STEP_NAME = LANGUAGE_ARCH_TYPE + '-vendors';
export const LANGUAGE_DOCUMENTS_STEP_NAME = LANGUAGE_ARCH_TYPE + '-documents';

export const LANGUAGE_STEP_DEFINITIONS: WizardStep[] = [
  {
    name: LANGUAGE_INTERPRETATION_STEP_NAME,
    icon: ['fas', 'fa-users'],
    label: 'On-Site Interpretation'
  },
  {
    name: LANGUAGE_TRANSLATION_STEP_NAME,
    icon: ['fal', 'fa-file-alt'],
    label: 'Document Translation'
  }
];
