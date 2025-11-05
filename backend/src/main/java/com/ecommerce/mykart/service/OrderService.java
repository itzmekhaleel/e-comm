package com.ecommerce.mykart.service;

import com.ecommerce.mykart.model.*;
import com.ecommerce.mykart.repository.OrderRepository;
import com.ecommerce.mykart.repository.CartRepository;
import com.ecommerce.mykart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Transactional
    public Order createOrderFromCart(User user) {
        // Get user's cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cannot create order from empty cart");
        }
        
        // Calculate total amount
        BigDecimal totalAmount = cart.getCartItems().stream()
                .map(CartItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        
        // Create order items from cart items
        Set<OrderItem> orderItems = new HashSet<>();
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Clear cart after order creation
        cart.getCartItems().clear();
        cartRepository.save(cart);
        
        return savedOrder;
    }
    
    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }
    
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}