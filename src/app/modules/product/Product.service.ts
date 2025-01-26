import { TProduct } from './Product.interface';
import Product from './Product.model';

export const ProductService = {
  async createProduct(newProduct: TProduct) {
    return await Product.create(newProduct);
  },
};
