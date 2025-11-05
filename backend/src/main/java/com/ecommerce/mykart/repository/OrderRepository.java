package com.ecommerce.mykart.repository;

import com.ecommerce.mykart.model.Order;
import com.ecommerce.mykart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}