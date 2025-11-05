package com.ecommerce.mykart.controller;

import com.ecommerce.mykart.dto.MessageResponse;
import com.ecommerce.mykart.model.Order;
import com.ecommerce.mykart.model.User;
import com.ecommerce.mykart.security.UserDetailsImpl;
import com.ecommerce.mykart.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(Authentication authentication) {
        try {
            logger.info("Received checkout request");
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = new User();
            user.setId(userDetails.getId());
            
            Order order = orderService.createOrderFromCart(user);
            logger.info("Order created successfully with ID: {}", order.getId());
            
            return ResponseEntity.ok().body(order);
        } catch (DataAccessException e) {
            logger.error("Database error during checkout: ", e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred during checkout"));
        } catch (Exception e) {
            logger.error("Error during checkout: ", e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error during checkout: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getOrders(Authentication authentication) {
        try {
            logger.info("Received request to get orders");
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = new User();
            user.setId(userDetails.getId());
            
            List<Order> orders = orderService.getOrdersByUser(user);
            logger.info("Retrieved {} orders for user", orders.size());
            
            return ResponseEntity.ok().body(orders);
        } catch (DataAccessException e) {
            logger.error("Database error getting orders: ", e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred while fetching orders"));
        } catch (Exception e) {
            logger.error("Error getting orders: ", e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error getting orders: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId, Authentication authentication) {
        try {
            logger.info("Received request to get order by ID: {}", orderId);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = new User();
            user.setId(userDetails.getId());
            
            Order order = orderService.getOrderById(orderId);
            
            // Check if order belongs to user
            if (!order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Order does not belong to user"));
            }
            
            return ResponseEntity.ok().body(order);
        } catch (DataAccessException e) {
            logger.error("Database error getting order with ID {}: ", orderId, e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred while fetching order"));
        } catch (Exception e) {
            logger.error("Error getting order with ID {}: ", orderId, e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error getting order: " + e.getMessage()));
        }
    }
}