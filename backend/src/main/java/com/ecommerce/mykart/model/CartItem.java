package com.ecommerce.mykart.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonIgnore
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private BigDecimal price;

    // Constructors
    public CartItem() {}

    public CartItem(Cart cart, Product product, Integer quantity) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
        if (product != null && quantity != null) {
            this.price = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        // Update price when quantity changes
        if (product != null && quantity != null) {
            this.price = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        }
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    // Get product details for DTO
    public Long getProductId() {
        return product != null ? product.getId() : null;
    }

    public String getProductName() {
        return product != null ? product.getName() : null;
    }

    public String getProductImageUrl() {
        return product != null ? product.getImageUrl() : null;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CartItem)) return false;
        CartItem cartItem = (CartItem) o;
        return id != null && id.equals(cartItem.getId());
    }
    
    @Override
    public int hashCode() {
        return 31;
    }
}