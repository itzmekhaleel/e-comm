package com.ecommerce.mykart.dto;

import com.ecommerce.mykart.model.CartItem;
import java.math.BigDecimal;

public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Integer quantity;
    private BigDecimal price;

    // Constructors
    public CartItemDTO() {}

    public CartItemDTO(CartItem cartItem) {
        if (cartItem != null) {
            this.id = cartItem.getId();
            this.productId = cartItem.getProductId();
            this.productName = cartItem.getProductName();
            this.productImageUrl = cartItem.getProductImageUrl();
            this.quantity = cartItem.getQuantity();
            this.price = cartItem.getPrice();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}