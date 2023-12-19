import { createReducer, on } from '@ngrx/store';
import { mergeClone } from '@shared';
import {
  loadFusionAuthReasonsSuccess,
  loadFusionDiagnosticsAuthorizations,
  loadFusionDiagnosticsReferralAuthorizationsFail,
  loadFusionDiagnosticsReferralAuthorizationsSuccess,
  loadFusionDmeAuthorizations,
  loadFusionDmeReferralAuthorizationsFail,
  loadFusionDmeReferralAuthorizationsSuccess,
  loadFusionHomeHealthAuthorizations,
  loadFusionHomeHealthReferralAuthorizationsFail,
  loadFusionHomeHealthReferralAuthorizationsSuccess,
  loadFusionLanguageAuthorizations,
  loadFusionLanguageReferralAuthorizationsFail,
  loadFusionLanguageReferralAuthorizationsSuccess,
  loadFusionPhysicalMedicineAuthorizations,
  loadFusionPhysicalMedicineReferralAuthorizationsFail,
  loadFusionPhysicalMedicineReferralAuthorizationsSuccess,
  loadFusionReferralDocuments,
  loadFusionReferralDocumentsFail,
  loadFusionReferralDocumentsSuccess,
  lockFusionAuthorizationFail,
  lockFusionAuthorizationSuccess,
  resetFusionAuthorizationState,
  restoreFusionAuthorizationState,
  submitFusionAuthCancellation,
  submitFusionAuthCancellationFail,
  submitFusionAuthCancellationSuccessAndRefetch,
  submitFusionAuthorizationFail,
  submitFusionAuthorizations,
  submitFusionAuthorizationSuccess,
  submitFusionPMExtension,
  submitFusionPMExtensionFail,
  submitFusionPMExtensionSuccess,
  unlockFusionAuthorizationFail,
  unlockFusionAuthorizationSuccess,
  updateFusionAuthHeaderNotes,
  updateFusionAuthHeaderPendExpirationDate,
  updateFusionAuthorizationState
} from '../../actions/fusion/fusion-authorization.actions';
import {
  fusionAuthorizationsInitialState,
  FusionReferralAuthorizationState
} from '../../models/fusion/fusion-authorizations.models';
import { cloneDeep } from 'lodash';
import { DocumentTableItem } from '../../models/make-a-referral.models';

export const fusionReferralAuthorizationReducer = createReducer<
  FusionReferralAuthorizationState
>(
  fusionAuthorizationsInitialState,
  on(
    loadFusionLanguageAuthorizations,
    loadFusionDiagnosticsAuthorizations,
    loadFusionPhysicalMedicineAuthorizations,
    loadFusionHomeHealthAuthorizations,
    loadFusionDmeAuthorizations,
    (state) => {
      return mergeClone(state, {
        isLoading: true,
        originalAuthorizations: {
          authorizations: [],
          noteList: [],
          clinicalAlerts: []
        },
        workingAuthorizations: {
          authorizations: [],
          noteList: [],
          clinicalAlerts: []
        }
      });
    }
  ),
  on(
    loadFusionLanguageReferralAuthorizationsSuccess,
    loadFusionDiagnosticsReferralAuthorizationsSuccess,
    loadFusionPhysicalMedicineReferralAuthorizationsSuccess,
    loadFusionHomeHealthReferralAuthorizationsSuccess,
    loadFusionDmeReferralAuthorizationsSuccess,
    (state, { authorizations, rush, noteList, clinicalAlerts }) => {
      return mergeClone(state, {
        originalAuthorizations: {
          authorizations: cloneDeep(authorizations),
          noteList: cloneDeep(noteList),
          clinicalAlerts: cloneDeep(clinicalAlerts)
        },
        workingAuthorizations: {
          authorizations: cloneDeep(authorizations),
          noteList: cloneDeep(noteList),
          clinicalAlerts: cloneDeep(clinicalAlerts)
        },
        rush
      });
    }
  ),
  on(
    loadFusionLanguageReferralAuthorizationsSuccess,
    loadFusionLanguageReferralAuthorizationsFail,
    loadFusionDiagnosticsReferralAuthorizationsSuccess,
    loadFusionDiagnosticsReferralAuthorizationsFail,
    loadFusionPhysicalMedicineReferralAuthorizationsSuccess,
    loadFusionPhysicalMedicineReferralAuthorizationsFail,
    loadFusionHomeHealthReferralAuthorizationsSuccess,
    loadFusionHomeHealthReferralAuthorizationsFail,
    loadFusionDmeReferralAuthorizationsSuccess,
    loadFusionDmeReferralAuthorizationsFail,
    (state) => {
      return mergeClone(state, { isLoading: false });
    }
  ),
  on(loadFusionReferralDocuments, (state) => {
    return mergeClone(state, {
      originalAuthorizations: {
        attachments: { isLoading: true, list: new Array<DocumentTableItem>() }
      },
      workingAuthorizations: {
        attachments: { isLoading: true, list: new Array<DocumentTableItem>() }
      }
    });
  }),
  on(loadFusionReferralDocumentsSuccess, (state, { documents }) => {
    return mergeClone(state, {
      originalAuthorizations: {
        attachments: { list: Object.assign([], documents) }
      },
      workingAuthorizations: {
        attachments: { list: [...documents] }
      }
    });
  }),
  on(
    loadFusionReferralDocumentsSuccess,
    loadFusionReferralDocumentsFail,
    (state) => {
      return mergeClone(state, {
        originalAuthorizations: { attachments: { isLoading: false } },
        workingAuthorizations: { attachments: { isLoading: false } }
      });
    }
  ),
  // Reasons
  on(
    loadFusionAuthReasonsSuccess,
    (state: FusionReferralAuthorizationState, { reasons }) => {
      return mergeClone(state, { reasons: reasons });
    }
  ),
  on(
    updateFusionAuthorizationState,
    (state: FusionReferralAuthorizationState, { authorization }) => {
      if (
        state.workingAuthorizations &&
        state.workingAuthorizations.authorizations
      ) {
        let workingAuthorizations = Object.assign(
          {},
          state.workingAuthorizations
        );
        const authorizationIndex = workingAuthorizations.authorizations.findIndex(
          (wAuth) =>
            wAuth.authorizationUnderReview.authorizationId ===
            authorization.authorizationUnderReview.authorizationId
        );
        if (authorizationIndex > -1) {
          workingAuthorizations.authorizations[
            authorizationIndex
          ] = authorization;
        }
        return mergeClone(state, { workingAuthorizations });
      } else {
        return state;
      }
    }
  ),
  on(
    restoreFusionAuthorizationState,
    (state: FusionReferralAuthorizationState) => {
      if (
        state.workingAuthorizations &&
        state.workingAuthorizations.authorizations &&
        state.originalAuthorizations &&
        state.originalAuthorizations.authorizations
      ) {
        const clone = cloneDeep(state);
        clone.workingAuthorizations = cloneDeep(clone.originalAuthorizations);

        return clone;
      } else {
        return state;
      }
    }
  ),
  on(submitFusionAuthorizations, (state: FusionReferralAuthorizationState) => {
    const clone = cloneDeep(state);
    clone.submittingAuthorizations = true;
    return clone;
  }),
  // Submit
  on(submitFusionAuthorizationSuccess, (state, { successResponseFusion }) => {
    const clone = cloneDeep(state);
    clone.submitResponse.successful = successResponseFusion.successful;
    successResponseFusion.formValues.noteList =
      state.workingAuthorizations.noteList;
    clone.workingAuthorizations.authorizations.forEach((auth, i) => {
      const successAuth = successResponseFusion.formValues.authorizations.find(
        (successAuth) =>
          successAuth.authorizationUnderReview.authorizationId ===
          auth.authorizationUnderReview.authorizationId
      );
      if (successAuth) {
        successAuth.authorizationUnderReview.bodyParts =
          auth.authorizationUnderReview.bodyParts;
        if (auth.authorizationUnderReview.isSubstitution) {
          successAuth.authorizationUnderReview.substitutionAuthorizationUnderReview.action =
            auth.action;
        } else {
          successAuth.action = auth.action;
        }
      }
    });
    clone.submitResponse.formValues = successResponseFusion.formValues;
    clone.submittingAuthorizations = false;
    return clone;
  }),
  on(
    submitFusionAuthorizationFail,
    (state: FusionReferralAuthorizationState, { status, errorResponse }) => {
      const clone = { ...state };
      clone.submitResponse = { status: status, errors: errorResponse };
      clone.submittingAuthorizations = false;
      return clone;
    }
  ),
  // Physical Medicine Extension
  on(submitFusionPMExtension, (state: FusionReferralAuthorizationState) => {
    const clone = cloneDeep(state);
    clone.submittingPMExtension = true;
    return clone;
  }),
  on(submitFusionPMExtensionSuccess, (state, { successResponseFusion }) => {
    const clone = cloneDeep(state);
    clone.submitPMExtensionResponse = { successful: successResponseFusion };
    clone.submittingPMExtension = false;
    return clone;
  }),
  on(
    submitFusionPMExtensionFail,
    (state: FusionReferralAuthorizationState, { errorResponse }) => {
      const clone = { ...state };
      clone.submitPMExtensionResponse = {
        errors: errorResponse,
        successful: false
      };
      clone.submittingPMExtension = false;
      return clone;
    }
  ),
  // Authorization Cancellation
  on(
    submitFusionAuthCancellation,
    (state: FusionReferralAuthorizationState) => {
      const clone = cloneDeep(state);
      clone.submittingAuthCancel = true;
      return clone;
    }
  ),
  on(submitFusionAuthCancellationSuccessAndRefetch, (state) => {
    const clone = cloneDeep(state);
    clone.submittingAuthCancel = false;
    return clone;
  }),
  on(
    submitFusionAuthCancellationFail,
    (state: FusionReferralAuthorizationState) => {
      const clone = { ...state };
      clone.submittingAuthCancel = false;
      return clone;
    }
  ),
  // Load Authorizations
  on(updateFusionAuthHeaderNotes, (state, { notes }) => {
    const clone = cloneDeep(state);
    clone.workingAuthorizations.noteList = [...notes];
    return clone;
  }),
  on(updateFusionAuthHeaderPendExpirationDate, (state, { expirationDate }) => {
    const clone = cloneDeep(state);
    clone.workingAuthorizations.pendExpireDate = expirationDate;
    return clone;
  }),
  on(
    lockFusionAuthorizationSuccess,
    unlockFusionAuthorizationSuccess,
    unlockFusionAuthorizationFail,
    (state, { isLocked }) => {
      const clone = cloneDeep(state);
      clone.locked = { isLocked };
      return clone;
    }
  ),
  on(
    lockFusionAuthorizationFail,
    (state: FusionReferralAuthorizationState, { errors }) => {
      const clone = { ...state };
      clone.locked = {
        isLocked: true,
        message: errors && errors.length > 0 ? errors[0] : undefined
      };
      return clone;
    }
  ),
  on(resetFusionAuthorizationState, () =>
    cloneDeep(fusionAuthorizationsInitialState)
  )
);
