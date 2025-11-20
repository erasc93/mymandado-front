import { CartItem } from "./CartItem";

export interface Cart {
  id: number;
  name: string;
  userid: number;
  numero: number;
  description: string;
  items: CartItem[];
}
