import { $Enums } from '@prisma/client';

export type ISignInData = {
  email: string;
  password: string;
  phone: string;
};

export type ICheckoutLogin = {
  email: string;
  sessionId: string;
};

export type ISignInResponse = {
  accessToken?: string;
};

export type IRegisterData = {
  id: string;
  authId: string;
  firstName: string;
  lastName: string;
  address: string;
  district: string;
  city: string;
  zipCode: string;
  nid: string;
  phone: string;
  email: string;
  password: string;
  role: $Enums.Role;
};
export type IRegisterPartnerData = {
  phone: string;
  email: string;
  password: string;
  role: $Enums.Role;

  firstName: string;
  lastName: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  zipCode: string | null;
  nid: string | null;
  dateOfBirth: string | null;
  image: string | null;
  block: boolean;

  authId: string;
  shopName: string;
  shopBanner: string | null;
  description: string | null;
  nidCardImage: string | null;
  shopLogo: string | null;
  isVerified: boolean;
  isActive: boolean;
};
