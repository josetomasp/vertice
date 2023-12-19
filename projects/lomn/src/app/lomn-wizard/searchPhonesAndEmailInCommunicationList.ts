import { Communication } from '../store/models/claim.models';

export function searchPhonesAndEmailInCommunicationList(
  communications: Communication[] = []
): { phone: string; email: string; fax: string } {
  let phone: string = null;
  let email: string = null;
  let fax: string = null;
  if (communications.findIndex((com) => com.type === 'HOME') >= 0) {
    phone = communications.find((com) => com.type === 'HOME')
      .communicationValue;
  } else if (communications.findIndex((com) => com.type === 'CELL') >= 0) {
    phone = communications.find((com) => com.type === 'CELL')
      .communicationValue;
  } else if (communications.findIndex((com) => com.type === 'WORK') >= 0) {
    phone = communications.find((com) => com.type === 'WORK')
      .communicationValue;
  }
  if (communications.findIndex((com) => com.type === 'EMAIL') >= 0) {
    email = communications.find((com) => com.type === 'EMAIL')
      .communicationValue;
  }
  if (communications.findIndex((com) => com.type === 'FAX') >= 0) {
    fax = communications.find((com) => com.type === 'FAX').communicationValue;
  }
  return { phone, email, fax };
}
