import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-products',
  templateUrl: './products.html'
})
export class Products implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private api: ProductService, private router: Router) {}

  ngOnInit() {
    this.api.list().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  add(){ this.router.navigate(['/add']); }
  edit(p: Product){ this.router.navigate(['/update', p._id]); }
  remove(p: Product){
    if (!p._id) return;
    this.api.remove(p._id).subscribe(() => {
      this.products = this.products.filter(x => x._id !== p._id);
    });
  }
}
