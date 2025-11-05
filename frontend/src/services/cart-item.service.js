import cartService from './cart.service';

class CartItemService {
  /**
   * Add item to cart
   */
  async addToCart(productId, quantity) {
    console.log('CartItemService.addToCart called with:', productId, quantity);
    return await cartService.addItem(productId, quantity);
  }
}

export default new CartItemService();