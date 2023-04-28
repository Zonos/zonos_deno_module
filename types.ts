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
  
  type ZonosCartItem = {
    countryOfOrigin?: string;
    description: string;
    height?: string | number;
    imageURL: string;
    itemBrand?: string;
    itemCategory?: string;
    itemCustomization?: string;
    itemHSCode?: string;
    itemUrl?: string;
    length?: string | number;
    nonShippable?: boolean;
    productId?: string | number;
    quantity: string | number;
    sku?: string;
    unitPrice: string | number;
    weight?: string | number;
    weightUnit?: string;
    width?: string | number;
  };
  
  type ZonosConfig = {
    account_number: string | number;
    api_key: string;
    apiUrl?: string;
    apiVersion?: string | number;
    corsProxy?: string;
  };
  
  export type { ZonosCart };
  export type { ZonosCartItem };
  export type { ZonosConfig };