package com.ecommerce.mykart.dto;

import java.util.Set;
import java.util.HashSet;

public class CartDTO {
    private Long id;
    private Long userId;
    private Set<CartItemDTO> cartItems;

    // Constructors
    public CartDTO() {
        this.cartItems = new HashSet<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Set<CartItemDTO> getCartItems() {
        return cartItems;
    }

    public void setCartItems(Set<CartItemDTO> cartItems) {
        this.cartItems = cartItems;
    }
}