export interface KinectCreateReferralResponse {
  referralId: string;
  vendors: KinectCreateReferralVendorResponse[];
}

export interface KinectCreateReferralVendorResponse {
  displayName: string;
  partnerId: string;
}

export interface KinectCreateReferralRequest {
  claimNumber: string;
  customerId: string;
  type: string;
}
