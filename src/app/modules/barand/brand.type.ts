/* eslint-disable @typescript-eslint/consistent-type-definitions */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface IBrand {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  status: boolean;
  isActive: boolean;
  imageUrl: string;
}

export interface IBrandResponse extends IBrand {
  createdAt: Date;
  updatedAt: Date;
}
