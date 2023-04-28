import type { ZonosCartItem } from './ZonosCartItem';

type ZonosCart = {
  items: ZonosCartItem[];
  storeId?: string | number;
  boxCount?: string;
  contShoppingURL?: string;
  domesticShippingCharge?: number;
  externalConfirmationPageURL?: string;
  footerHTML?: string;
  misc1?: string;
  misc2?: string;
  misc3?: string;
  misc4?: string;
  misc5?: string;
  misc6?: string;
  referenceId?: string;
};

export type { ZonosCart };