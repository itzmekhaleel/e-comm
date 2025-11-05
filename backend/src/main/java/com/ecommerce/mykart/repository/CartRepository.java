package com.ecommerce.mykart.repository;

import com.ecommerce.mykart.model.Cart;
import com.ecommerce.mykart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByGuestIdentifier(String guestIdentifier);
    // Cart saveCart(Cart cart);
}