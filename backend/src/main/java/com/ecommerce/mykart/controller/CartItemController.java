package com.ecommerce.mykart.controller;

import com.ecommerce.mykart.model.Cart;
import com.ecommerce.mykart.model.CartItem;
import com.ecommerce.mykart.model.Product;
import com.ecommerce.mykart.model.User;
import com.ecommerce.mykart.security.UserDetailsImpl;
import com.ecommerce.mykart.service.CartService;
import com.ecommerce.mykart.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Long productId,
                                       @RequestParam Integer quantity,
                                       Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = new User();
            user.setId(userDetails.getId());

            // Get the product
            Optional<Product> productOpt = productService.getProductById(productId);
            if (!productOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Product not found");
            }

            Product product = productOpt.get();

            // Add item to cart
            Cart cart = cartService.addItemToCart(user, productId, quantity);

            return ResponseEntity.ok("Product added to cart successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding product to cart: " + e.getMessage());
        }
    }
}