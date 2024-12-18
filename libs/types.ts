import { SvgProps } from "react-native-svg";


export type Card = {
    active?:boolean
    id: string; 
    nameOnCard: string;
    cardNumber: string; 
    expiryDate: string; 
    cvv: string; 
}
export type Address = {
    id: string;
    title: string;
    addressLine: string;
    city: string;
    state: string; 
    zipCode: string;
    country: string;
    phone: string;
}
  // Product item in an order
  export interface OrderItem {
    img:string,
    productId: string; // Unique ID of the product
    name: string; // Name of the product
    quantity: number; // Quantity of the product ordered
    price: number; // Price per unit
    category: string;
    discountPrice?: number; // Optional discount price
    total: number; // Total price for this item (quantity * price/discountPrice)
  }
  
  export type Timestamp = { seconds: number; nanoseconds?: number };
  // Order object
  export interface Order {
    orderId: string;
    userId: string;
    items: OrderItem[];
    deliveryAddress: Address;
    status: OrderStatus; 
    subTotal:number;
    delivery:number;
    totalAmount: number; 
    paymentMethod: PaymentMethod;
    createdAt: Timestamp;
    shippedAt?: Timestamp;
    deliveredAt?: Timestamp;
    canceleAt?: Timestamp;
    deliveryDuration:number;
  
  }
  export interface NewOrder extends Omit<Order, 'orderId'> {}
  
  // Payment method
  export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CREDIT_CARD'
  
  // Order status
  export type OrderStatus = 'confirmed'
  | 'preparing'
  | 'delivered'
  | 'cancelled';


export type Icon={
  color?: string;
  fill?: string;
  size?: number;
  strockColor?:string;
  className?: string;
}