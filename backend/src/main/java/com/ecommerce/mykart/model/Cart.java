package com.ecommerce.mykart.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;

@Entity
@Table(name = "carts")
public class Cart {
    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(name = "guest_identifier")
    private String guestIdentifier;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

    // Constructors 
    public Cart() {
        this.cartItems = new ArrayList<>();
    }

    public Cart(User user) {
        this.user = user;
        this.cartItems = new ArrayList<>();
    }

    public Cart(String guestIdentifier) {
        this.guestIdentifier = guestIdentifier;
        this.cartItems = new ArrayList<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getGuestIdentifier() {
        return guestIdentifier;
    }

    public void setGuestIdentifier(String guestIdentifier) {
        this.guestIdentifier = guestIdentifier;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    // Helper methods
    public void addCartItem(CartItem cartItem) {
        if (cartItem != null) {
            cartItems.add(cartItem);
            cartItem.setCart(this);
        }
    }

    public void removeCartItem(CartItem cartItem) {
        if (cartItem != null) {
            cartItems.remove(cartItem);
            cartItem.setCart(null);
        }
    }

    // Calculate total price
    public BigDecimal getTotalPrice() {
        return cartItems.stream()
                .map(CartItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Calculate total items
    public int getTotalItems() {
        return cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Cart)) return false;
        Cart cart = (Cart) o;
        return id != null && id.equals(cart.getId());
    }
    
    @Override
    public int hashCode() {
        return 31;
    }
}