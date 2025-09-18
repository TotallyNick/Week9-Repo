import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
  _id?: string;
  id: number;
  name: string;
  description: string;
  price: number;
  units: number;
}
export type NewProduct = Omit<Product, '_id' | 'id'> &{id?: number};
@Injectable({ providedIn: 'root' })

export class ProductService {
  private base = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  list() { return this.http.get<Product[]>(this.base); }
  add(p: Product) { return this.http.post<Product>(this.base, p); }
  update(_id: string, p: Partial<Product>) { return this.http.put<Product>(`${this.base}/${_id}`, p); }
  remove(_id: string) { return this.http.delete<{ok: boolean}>(`${this.base}/${_id}`); }
}
