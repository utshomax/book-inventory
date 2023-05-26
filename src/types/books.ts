export interface Book {
    _id: string;
    name: string;
    image: string;
    category: string;
    code: number;
    description: string;
    price: {
      price: number;
      tax: number;
      discount: number;
    };
    stock: {
      unit: string;
      quantity: number;
      date: string;
      enableLowStockAlert: boolean;
      lowStockAlertQuantity: number;
    };
  }
  