export enum ProductId {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  PINK = 'pink',
  PURPLE = 'purple',
  ORANGE = 'orange',
}

export interface Product {
  id: ProductId;
  name: string;
  price: number;
}

export const PRODUCTS: Product[] = [
  { id: ProductId.RED, name: 'Red Set', price: 50 },
  { id: ProductId.GREEN, name: 'Green Set', price: 40 },
  { id: ProductId.BLUE, name: 'Blue Set', price: 30 },
  { id: ProductId.YELLOW, name: 'Yellow Set', price: 50 },
  { id: ProductId.PINK, name: 'Pink Set', price: 80 },
  { id: ProductId.PURPLE, name: 'Purple Set', price: 90 },
  { id: ProductId.ORANGE, name: 'Orange Set', price: 120 },
];

