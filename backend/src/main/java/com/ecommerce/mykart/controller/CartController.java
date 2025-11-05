package com.ecommerce.mykart.controller;

import com.ecommerce.mykart.dto.CartDTO;
import com.ecommerce.mykart.dto.CartItemDTO;
import com.ecommerce.mykart.dto.MessageResponse;
import com.ecommerce.mykart.model.Cart;
import com.ecommerce.mykart.model.CartItem;
import com.ecommerce.mykart.model.User;
import com.ecommerce.mykart.security.UserDetailsImpl;
import com.ecommerce.mykart.service.CartService;
import com.ecommerce.mykart.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cart")
public class CartController {
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Get cart for current user (authenticated or guest)
     */
    @GetMapping("/")
    public ResponseEntity<?> getCart(HttpServletRequest request) {
        logger.info("Received request to get cart");
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            // Handle authenticated users
            if (authentication != null && authentication.isAuthenticated() && 
                !"anonymousUser".equals(authentication.getPrincipal()) &&
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                Cart cart = cartService.getOrCreateCart(user);
                CartDTO cartDTO = convertToCartDTO(cart);
                
                logger.info("Retrieved cart for user {}: {} items", user.getId(), cartDTO.getCartItems().size());
                return ResponseEntity.ok(cartDTO);
            }
            
            // Handle guest users
            String guestIdentifier = getGuestIdentifier(request);
            Cart guestCart = cartService.getOrCreateGuestCart(guestIdentifier);
            CartDTO cartDTO = convertToCartDTO(guestCart);
            
            logger.info("Retrieved guest cart with {} items", cartDTO.getCartItems().size());
            return ResponseEntity.ok(cartDTO);
            
        } catch (Exception e) {
            logger.error("Error getting cart: ", e);
            return ResponseEntity.status(500).body(new MessageResponse("Error retrieving cart: " + e.getMessage()));
        }
    }

    /**
     * Add item to cart
     */
    @PostMapping("/items")  
    public ResponseEntity<?> addItemToCart(
            @RequestParam Long productId, 
            @RequestParam Integer quantity,
            HttpServletRequest request,
            HttpServletResponse response) {
        
        logger.info("Received request to add item to cart - Product ID: {}, Quantity: {}", productId, quantity);
        
        try {
            // Validate parameters
            if (productId == null || quantity == null || quantity <= 0) {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid product ID or quantity"));
            }
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            // Handle authenticated users
            if (authentication != null && authentication.isAuthenticated() && 
                !"anonymousUser".equals(authentication.getPrincipal()) &&
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                Cart cart = cartService.addItemToCart(user, productId, quantity);
                logger.info("Item added to user cart successfully");
                return ResponseEntity.ok(new MessageResponse("Item added to cart successfully"));
            }
            
            // Handle guest users
            String guestIdentifier = getOrCreateGuestIdentifier(request, response);
            Cart cart = cartService.addItemToCart(guestIdentifier, productId, quantity);
            logger.info("Item added to guest cart successfully");
            return ResponseEntity.ok(new MessageResponse("Item added to cart successfully"));
            
        } catch (Exception e) {
            logger.error("Error adding item to cart: ", e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error adding item to cart: " + e.getMessage()));
        }
    }

    /**
     * Update item quantity in cart
     */
    @PutMapping("/items/{productId}")
    public ResponseEntity<?> updateItemQuantity(
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            HttpServletRequest request) {
        
        logger.info("Received request to update item quantity - Product ID: {}, Quantity: {}", productId, quantity);
        
        try {
            // Validate parameters
            if (productId == null || quantity == null || quantity < 0) {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid product ID or quantity"));
            }
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            // Handle authenticated users
            if (authentication != null && authentication.isAuthenticated() && 
                !"anonymousUser".equals(authentication.getPrincipal()) &&
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                Cart cart = cartService.updateItemQuantity(user, productId, quantity);
                logger.info("Item quantity updated in user cart successfully");
                return ResponseEntity.ok(new MessageResponse("Item quantity updated successfully"));
            }
            
            // Handle guest users
            String guestIdentifier = getGuestIdentifier(request);
            Cart cart = cartService.updateItemQuantity(guestIdentifier, productId, quantity);
            logger.info("Item quantity updated in guest cart successfully");
            return ResponseEntity.ok(new MessageResponse("Item quantity updated successfully"));
            
        } catch (Exception e) {
            logger.error("Error updating item quantity: ", e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating item quantity: " + e.getMessage()));
        }
    }

    /**
     * Remove item from cart
     */
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<?> removeItemFromCart(
            @PathVariable Long productId,
            HttpServletRequest request) {
        
        logger.info("Received request to remove item from cart - Product ID: {}", productId);
        
        try {
            if (productId == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid product ID"));
            }
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            // Handle authenticated users
            if (authentication != null && authentication.isAuthenticated() && 
                !"anonymousUser".equals(authentication.getPrincipal()) &&
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                Cart cart = cartService.removeItemFromCart(user, productId);
                logger.info("Item removed from user cart successfully");
                return ResponseEntity.ok(new MessageResponse("Item removed from cart successfully"));
            }
            
            // Handle guest users
            String guestIdentifier = getGuestIdentifier(request);
            Cart cart = cartService.removeItemFromCart(guestIdentifier, productId);
            logger.info("Item removed from guest cart successfully");
            return ResponseEntity.ok(new MessageResponse("Item removed from cart successfully"));
            
        } catch (Exception e) {
            logger.error("Error removing item from cart: ", e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error removing item from cart: " + e.getMessage()));
        }
    }

    /**
     * Clear cart
     */
    @DeleteMapping("/")
    public ResponseEntity<?> clearCart(HttpServletRequest request) {
        logger.info("Received request to clear cart");
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            // Handle authenticated users
            if (authentication != null && authentication.isAuthenticated() && 
                !"anonymousUser".equals(authentication.getPrincipal()) &&
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                cartService.clearCart(user);
                logger.info("User cart cleared successfully");
                return ResponseEntity.ok(new MessageResponse("Cart cleared successfully"));
            }
            
            // Handle guest users
            String guestIdentifier = getGuestIdentifier(request);
            cartService.clearCart(guestIdentifier);
            logger.info("Guest cart cleared successfully");
            return ResponseEntity.ok(new MessageResponse("Cart cleared successfully"));
            
        } catch (Exception e) {
            logger.error("Error clearing cart: ", e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error clearing cart: " + e.getMessage()));
        }
    }

    /**
     * Helper method to get or create guest identifier
     */
    private String getOrCreateGuestIdentifier(HttpServletRequest request, HttpServletResponse response) {
        // Check if guest identifier cookie exists
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("guestIdentifier".equals(cookie.getName())) {
                    logger.info("Found existing guest identifier in cookie: {}", cookie.getValue());
                    return cookie.getValue();
                }
            }
        }
        
        // Create a new guest identifier
        String guestIdentifier = UUID.randomUUID().toString();
        logger.info("Creating new guest identifier: {}", guestIdentifier);
        
        // Set cookie for future requests
        Cookie guestCookie = new Cookie("guestIdentifier", guestIdentifier);
        guestCookie.setMaxAge(60 * 60 * 24 * 30); // 30 days
        guestCookie.setPath("/");
        response.addCookie(guestCookie);
        
        return guestIdentifier;
    }

    /**
     * Helper method to get guest identifier (without creating new one)
     */
    private String getGuestIdentifier(HttpServletRequest request) {
        // Check if guest identifier cookie exists
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("guestIdentifier".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        
        // If no cookie found, create a temporary identifier
        return UUID.randomUUID().toString();
    }

    /**
     * Convert Cart entity to CartDTO
     */
    private CartDTO convertToCartDTO(Cart cart) {
        if (cart == null) {
            CartDTO emptyCart = new CartDTO();
            emptyCart.setCartItems(new HashSet<>());
            return emptyCart;
        }
        
        CartDTO cartDTO = new CartDTO();
        cartDTO.setId(cart.getId());
        cartDTO.setUserId(cart.getUser() != null ? cart.getUser().getId() : null);
        
        List<CartItem> cartItems = cart.getCartItems() != null ? cart.getCartItems() : new ArrayList<>();
        Set<CartItemDTO> cartItemDTOs = cartItems.stream()
            .map(CartItemDTO::new)
            .collect(Collectors.toSet());
        cartDTO.setCartItems(cartItemDTOs);
        
        return cartDTO;
    }
}