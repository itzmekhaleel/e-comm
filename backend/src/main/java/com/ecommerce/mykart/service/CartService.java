package com.ecommerce.mykart.service;

import com.ecommerce.mykart.model.Cart;
import com.ecommerce.mykart.model.CartItem;
import com.ecommerce.mykart.model.Product;
import com.ecommerce.mykart.model.User;
import com.ecommerce.mykart.repository.CartRepository;
import com.ecommerce.mykart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Get or create cart for authenticated user
     */
    public Cart getOrCreateCart(User user) {
        Optional<Cart> existingCart = cartRepository.findByUser(user);
        if (existingCart.isPresent()) {
            return existingCart.get();
        }
        
        // Create new cart with proper initialization
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setCartItems(new ArrayList<>());
        Random random = new Random();
        cart.setId(random.nextLong());
        
        // Save and return the cart with generated ID
        return cartRepository.save(cart);
    }

    /**
     * Get or create a cart for a guest user using guest identifier
     */
    public Cart getOrCreateGuestCart(String guestIdentifier) {
        if (guestIdentifier == null || guestIdentifier.isEmpty()) {
            throw new IllegalArgumentException("Guest identifier cannot be null or empty");
        }
        
        Optional<Cart> existingCart = cartRepository.findByGuestIdentifier(guestIdentifier);
        if (existingCart.isPresent()) {
            return existingCart.get();
        }
        
        // Create new cart with proper initialization
        Cart cart = new Cart();
        cart.setGuestIdentifier(guestIdentifier);
        cart.setCartItems(new ArrayList<>());
        
        // Save and return the cart with generated ID
        return cartRepository.save(cart);
    }

    /**
     * Add item to cart for authenticated user
     */
    public Cart addItemToCart(User user, Long productId, Integer quantity) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        Cart cart = getOrCreateCart(user);
        return addItemToCartInternal(cart, productId, quantity);
    }

    /**
     * Add item to cart for guest user
     */
    public Cart addItemToCart(String guestIdentifier, Long productId, Integer quantity) {
        if (guestIdentifier == null || guestIdentifier.isEmpty()) {
            throw new IllegalArgumentException("Guest identifier cannot be null or empty");
        }
        Cart cart = getOrCreateGuestCart(guestIdentifier);
        return addItemToCartInternal(cart, productId, quantity);
    }

    /**
     * Internal method to add items to cart (works for both user and guest carts)
     */
    private Cart addItemToCartInternal(Cart cart, Long productId, Integer quantity) {
        // Validate inputs
        if (productId == null || quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Product ID and quantity must be valid");
        }

        // Get the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // Ensure cart has an ID - critical for foreign key constraint
        if (cart.getId() == null) {
            cart = cartRepository.save(cart);
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct() != null && 
                               item.getProduct().getId() != null && 
                               item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // Update existing item
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setPrice(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        } else {
            // Create new cart item with proper references
            CartItem newItem = new CartItem();
            newItem.setCart(cart);  // Critical: set the cart reference
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            
            // Add to cart's item collection
            cart.getCartItems().add(newItem);
        }

        // Save the cart which will cascade to save cart items
        return cartRepository.save(cart);
    }

    /**
     * Remove item from cart for authenticated user
     */
    public Cart removeItemFromCart(User user, Long productId) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        Cart cart = getOrCreateCart(user);
        removeItemFromCartInternal(cart, productId);
        return cartRepository.save(cart);
    }

    /**
     * Remove item from cart for guest user
     */
    public Cart removeItemFromCart(String guestIdentifier, Long productId) {
        if (guestIdentifier == null || guestIdentifier.isEmpty()) {
            throw new IllegalArgumentException("Guest identifier cannot be null or empty");
        }
        Cart cart = getOrCreateGuestCart(guestIdentifier);
        removeItemFromCartInternal(cart, productId);
        return cartRepository.save(cart);
    }

    /**
     * Internal method to remove items from cart
     */
    private void removeItemFromCartInternal(Cart cart, Long productId) {
        if (productId == null) {
            return;
        }
        
        cart.getCartItems().removeIf(item -> 
            item.getProduct() != null && 
            item.getProduct().getId() != null && 
            item.getProduct().getId().equals(productId));
    }

    /**
     * Update item quantity for authenticated user
     */
    public Cart updateItemQuantity(User user, Long productId, Integer quantity) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        Cart cart = getOrCreateCart(user);
        updateItemQuantityInternal(cart, productId, quantity);
        return cartRepository.save(cart);
    }

    /**
     * Update item quantity for guest user
     */
    public Cart updateItemQuantity(String guestIdentifier, Long productId, Integer quantity) {
        if (guestIdentifier == null || guestIdentifier.isEmpty()) {
            throw new IllegalArgumentException("Guest identifier cannot be null or empty");
        }
        Cart cart = getOrCreateGuestCart(guestIdentifier);
        updateItemQuantityInternal(cart, productId, quantity);
        return cartRepository.save(cart);
    }

    /**
     * Internal method to update item quantity
     */
    private void updateItemQuantityInternal(Cart cart, Long productId, Integer quantity) {
        if (productId == null || quantity == null) {
            return;
        }
        
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            removeItemFromCartInternal(cart, productId);
            return;
        }

        cart.getCartItems().stream()
                .filter(item -> 
                    item.getProduct() != null && 
                    item.getProduct().getId() != null && 
                    item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setPrice(item.getProduct().getPrice().multiply(BigDecimal.valueOf(quantity)));
                });
    }

    /**
     * Clear cart for authenticated user
     */
    public void clearCart(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    /**
     * Clear cart for guest user
     */
    public void clearCart(String guestIdentifier) {
        if (guestIdentifier == null || guestIdentifier.isEmpty()) {
            throw new IllegalArgumentException("Guest identifier cannot be null or empty");
        }
        Cart cart = getOrCreateGuestCart(guestIdentifier);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
}