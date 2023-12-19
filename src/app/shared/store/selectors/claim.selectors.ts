import { ClaimStatusEnum } from '@healthe/vertice-library';
import { createSelector } from '@ngrx/store';
import { ClaimStatus } from '@shared/lib';
import { SharedState } from '@shared/store/models';
import { getSharedState } from '@shared/store/selectors/shared.selectors';
import * as _ from 'lodash';
import { Contact } from '../../../claim-view/store/models/contacts.models';
import {
  Address,
  CaseManager,
  ClaimState,
  ClaimV3,
  Communication
} from '../models/claim.models';

export const getClaim = createSelector(
  getSharedState,
  (state: SharedState) => state.claim
);

export const getClaimV3 = createSelector(
  getSharedState,
  (state: SharedState) => state.claim.v3
);

export const isMARAllowed = createSelector(getClaimV3, (claim) => {
  return claim.allowMAR;
});

export const getClaimErrors = createSelector(
  getSharedState,
  (state: SharedState) => state.claim.errors
);

export const getClaimBannerFields = createSelector(
  getSharedState,
  (state: SharedState) => state.claim.claimBannerFields
);

export const isClaimV3Loading = createSelector(
  getClaim,
  (state: ClaimState) => state.loadingV3
);

export const isClaimV3BannerLoading = createSelector(
  getClaim,
  (state: ClaimState) => state.loadingV3Banner
);

export const isEligibleForClaimantPortal = createSelector(
  getClaimV3,
  (state: ClaimV3) => state.eligibleForClaimantPortal
);

export const getPbmClaimStatus = createSelector(
  getClaimV3,
  (state: ClaimV3): ClaimStatusEnum => {
    const pbmClaimStatuses: Array<ClaimStatus> = _.filter(
      state.claimStatuses,
      (s: ClaimStatus) => s.productType === 'PBM'
    );
    if (!_.isEmpty(pbmClaimStatuses)) {
      return pbmClaimStatuses[0].claimStatus;
    }
  }
);
export const getAbmClaimStatus = createSelector(
  getClaimV3,
  (state: ClaimV3) => {
    const abmClaimStatuses: Array<ClaimStatus> = _.filter(
      state.claimStatuses,
      (s: ClaimStatus) => s.productType === 'ABM'
    );
    if (!_.isEmpty(abmClaimStatuses)) {
      return abmClaimStatuses[0].claimStatus;
    }
  }
);
/**
 * This function has to be crazy so that,
 * in case any of these contacts don't exist
 * in the claim, we can safely omit that contact.
 *
 * If any property is called on an undefined object, the
 * selector will crash
 */
export const getContacts = createSelector(
  getClaimV3,
  (claim: ClaimV3): Array<Contact> => {
    const contactMeta = [
      {
        contactKey: 'adjuster',
        label: 'Adjuster',
        nameKey: 'fullName'
      },
      {
        contactKey: 'attorney',
        label: 'Attorney',
        nameKey: 'fullName'
      },
      {
        contactKey: 'supervisor',
        label: 'Supervisor',
        nameKey: 'fullName'
      },
      {
        contactKey: 'insurer',
        label: 'Insurer',
        nameKey: 'name'
      },
      {
        contactKey: 'employer',
        label: 'Employer',
        nameKey: 'name'
      },
      {
        contactKey: 'caseManagers',
        label: 'Case Manager',
        nameKey: 'fullName'
      },
      {
        contactKey: 'tpa',
        label: 'Third Party Administrator',
        nameKey: 'name'
      }
    ];

    const contacts = contactMeta.map((meta) => {
      const contact = claim[meta.contactKey];
      if (contact) {
        if (meta.contactKey === 'caseManagers') {
          return getCaseManagers(contact);
        }
        return {
          contactType: meta.label,
          name: contact[meta.nameKey],
          phone: getPhone(contact.communications),
          email: getEmail(contact.communications),
          address: getAddress(contact.address),
          reason: ''
        };
      }
    });
    return _.flatten(contacts).filter((c) => c);
  }
);

function getCaseManagers(caseManagers: Array<CaseManager>): Array<Contact> {
  return caseManagers.map((manager) => {
    return {
      contactType:
        manager.caseManagerRoleDescription === ''
          ? 'Case Manager'
          : manager.caseManagerRoleDescription,
      name: manager.fullName,
      phone: getPhone(manager.communications),
      email: getEmail(manager.communications),
      address: getAddress(manager.address),
      reason: ''
    };
  });
}

function getAddress(addr: Address): Array<string> {
  const retVal: Array<string> = [];

  if (addr) {
    if (addr.address1) {
      retVal.push(addr.address1);
    }

    if (addr.address1) {
      retVal.push(addr.address2);
    }

    let cityLine = '';
    if (addr.city) {
      cityLine += addr.city;
    }

    if (addr.state) {
      cityLine += ', ' + addr.state;
    }
    if (addr.zip) {
      cityLine += ' ' + addr.zip;
    }

    if (cityLine !== '') {
      retVal.push(cityLine);
    }
  }

  return retVal;
}

function getEmail(comms: Communication[]) {
  let email = '';
  if (Array.isArray(comms)) {
    comms.forEach((comm) => {
      if (comm.type === 'EMAIL') {
        email = comm.communicationValue;
      }
    });
  }
  return email;
}

function getPhone(comms: Communication[]) {
  let phone = [];
  if (Array.isArray(comms)) {
    comms.forEach((comm) => {
      if (
        comm.type === 'HOME' ||
        comm.type === 'WORK' ||
        comm.type === 'CELL' ||
        comm.type === 'FAX'
      ) {
        // phone.push(getPhoneNumberString(comm.communicationValue));
        phone.push(comm.communicationValue);
      }
    });
  }
  return phone;
}

export const isLockedClaim = createSelector(
  getClaimV3,
  (claim) => claim.lockedClaimIndicator === 'Y'
);

export const isClaimABMStatusActive = createSelector(
  getAbmClaimStatus,
  (status) => {
    if (status) {
      return status === 'ACTIVE';
    } else {
      return false;
    }
  }
);
