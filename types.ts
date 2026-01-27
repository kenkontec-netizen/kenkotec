export enum Screen {
  DASHBOARD = 'DASHBOARD',
  NEW_ORDER = 'NEW_ORDER',
  INVENTORY = 'INVENTORY',
  RECEIPT = 'RECEIPT',
  REPORTS = 'REPORTS',
  CUSTOMERS = 'CUSTOMERS',
  DELIVERIES = 'DELIVERIES',
  SALES = 'SALES',
  SETTINGS = 'SETTINGS',
  POST_SALE = 'POST_SALE',
  LOGIN = 'LOGIN',
}

export interface NavigationProps {
  onNavigate: (screen: Screen) => void;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  quantity: number;
  price: number;
  costPrice?: number;
  image: string;
  ncm?: string;
  lastUpdated: string;
}

export interface Sale {
  id: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  items: {
    product: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: string;
  date: string;
  seller?: string;
  status: 'paid' | 'pending' | 'canceled' | 'finalized';
  deliveryStatus?: 'delivered' | 'pending' | 'shipping';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  lastPurchase: string;
  address?: string;
}