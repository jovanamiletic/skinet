export type Product = {
  id: number;
  name: string;
  description: string;
  price: number; // ne postoji decimal u TS-u
  pictureUrl: string;
  type: string;
  brand: string;
  quantityInStock: number;
}