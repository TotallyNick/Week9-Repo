import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-update-product',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-products.html'
})
export class UpdateProductComponent implements OnInit {
  _id: string = '';
  model: Partial<Product> = {};

  constructor(
    private route: ActivatedRoute,
    private api: ProductService,
    private router: Router
  ) {}

  ngOnInit(){
    this._id = this.route.snapshot.params['id'];
  }

  save(){
      this.api.update(this._id, this.model).subscribe({
        next: () => this.router.navigate(['/products'])
      });
    }
}
