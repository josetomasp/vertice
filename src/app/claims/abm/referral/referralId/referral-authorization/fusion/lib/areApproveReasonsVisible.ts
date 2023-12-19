import { ClaimStatusEnum } from '@healthe/vertice-library';

export function areApproveReasonsVisible(
  status: ClaimStatusEnum,
  customerId: string
): boolean {
  // TODO: Remove this and create a better solution without doing an if TRAVELERS
  return (
    !ClaimStatusEnum.ACTIVE.equalsIgnoreCase(status) &&
    !'TRAVELERS'.equalsIgnoreCase(customerId) &&
    !'GALLAGHER'.equalsIgnoreCase(customerId) &&
    !'HARTFORD'.equalsIgnoreCase(customerId)
  );
}
