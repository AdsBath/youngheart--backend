import { Product } from '@prisma/client';
import { IGenericErrorMessage } from './error';

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type ProductCollection = {
  id: string;
  name: string;
};

export type GroupedProduct = {
  collection: ProductCollection;
  products: Product[];
};

export type ChartData = {
  month: string;
  order: number;
  revenue: number;
};
