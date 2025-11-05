package com.ecommerce.mykart.controller;

import com.ecommerce.mykart.dto.MessageResponse;
import com.ecommerce.mykart.model.Product;
import com.ecommerce.mykart.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @Autowired
    ProductService productService;

    @GetMapping
    public ResponseEntity<?> getAllProducts(
        @RequestParam(required = false) String sortBy,
        @RequestParam(required = false) String sortDirection) {
        
        try {
            List<Product> products = productService.getAllProducts();
            
            // Apply sorting if requested
            if (sortBy != null && !sortBy.isEmpty()) {
                products = productService.sortProducts(products, sortBy, sortDirection);
            }
            
            return ResponseEntity.ok(products);
        } catch (DataAccessException e) {
            logger.error("Database error getting all products: ", e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred while fetching products"));
        } catch (Exception e) {
            logger.error("Error getting all products: ", e);
            return ResponseEntity.status(500).body(new MessageResponse("Error occurred while fetching products"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        logger.info("Received request for product with ID: {}", id);
        
        try {
            Optional<Product> product = productService.getProductById(id);
            if (product.isPresent()) {
                logger.info("Returning product: {}", product.get().getName());
                return ResponseEntity.ok(product.get());
            } else {
                logger.warn("Product not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (DataAccessException e) {
            logger.error("Database error getting product with ID {}: ", id, e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred while fetching product"));
        } catch (Exception e) {
            logger.error("Error getting product with ID {}: ", id, e);
            return ResponseEntity.status(500).body(new MessageResponse("Error occurred while fetching product"));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
        @RequestParam String query,
        @RequestParam(required = false) String sortBy,
        @RequestParam(required = false) String sortDirection) {
        
        try {
            List<Product> products = productService.getProductsByName(query);
            
            // Apply sorting if requested
            if (sortBy != null && !sortBy.isEmpty()) {
                products = productService.sortProducts(products, sortBy, sortDirection);
            }
            
            return ResponseEntity.ok(products);
        } catch (DataAccessException e) {
            logger.error("Database error searching products with query '{}': ", query, e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred while searching products"));
        } catch (Exception e) {
            logger.error("Error searching products with query '{}': ", query, e);
            return ResponseEntity.status(500).body(new MessageResponse("Error occurred while searching products"));
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getProductsByCategory(
        @PathVariable String category,
        @RequestParam(required = false) String sortBy,
        @RequestParam(required = false) String sortDirection) {
        
        try {
            List<Product> products = productService.getProductsByCategory(category);
            
            // Apply sorting if requested
            if (sortBy != null && !sortBy.isEmpty()) {
                products = productService.sortProducts(products, sortBy, sortDirection);
            }
            
            return ResponseEntity.ok(products);
        } catch (DataAccessException e) {
            logger.error("Database error getting products by category '{}': ", category, e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred while fetching products by category"));
        } catch (Exception e) {
            logger.error("Error getting products by category '{}': ", category, e);
            return ResponseEntity.status(500).body(new MessageResponse("Error occurred while fetching products by category"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product savedProduct = productService.saveProduct(product);
            logger.info("Product created successfully with ID: {}", savedProduct.getId());
            return ResponseEntity.ok(savedProduct);
        } catch (DataAccessException e) {
            logger.error("Database error creating product: ", e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred while creating product"));
        } catch (Exception e) {
            logger.error("Error creating product: ", e);
            return ResponseEntity.status(500).body(new MessageResponse("Error occurred while creating product"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        try {
            Optional<Product> product = productService.getProductById(id);
            if (product.isPresent()) {
                Product updatedProduct = product.get();
                updatedProduct.setName(productDetails.getName());
                updatedProduct.setDescription(productDetails.getDescription());
                updatedProduct.setPrice(productDetails.getPrice());
                updatedProduct.setCategory(productDetails.getCategory());
                updatedProduct.setImageUrl(productDetails.getImageUrl());
                updatedProduct.setStockQuantity(productDetails.getStockQuantity());
                updatedProduct.setBrand(productDetails.getBrand());
                updatedProduct.setModel(productDetails.getModel());
                updatedProduct.setWarranty(productDetails.getWarranty());
                updatedProduct.setRating(productDetails.getRating());
                updatedProduct.setDiscountPercentage(productDetails.getDiscountPercentage());
                
                productService.saveProduct(updatedProduct);
                logger.info("Product updated successfully with ID: {}", id);
                return ResponseEntity.ok(updatedProduct);
            } else {
                logger.warn("Product not found with ID: {} for update", id);
                return ResponseEntity.notFound().build();
            }
        } catch (DataAccessException e) {
            logger.error("Database error updating product with ID {}: ", id, e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred while updating product"));
        } catch (Exception e) {
            logger.error("Error updating product with ID {}: ", id, e);
            return ResponseEntity.status(500).body(new MessageResponse("Error occurred while updating product"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            Optional<Product> product = productService.getProductById(id);
            if (product.isPresent()) {
                productService.deleteProduct(id);
                logger.info("Product deleted successfully with ID: {}", id);
                return ResponseEntity.ok().build();
            } else {
                logger.warn("Product not found with ID: {} for deletion", id);
                return ResponseEntity.notFound().build();
            }
        } catch (DataAccessException e) {
            logger.error("Database error deleting product with ID {}: ", id, e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred while deleting product"));
        } catch (Exception e) {
            logger.error("Error deleting product with ID {}: ", id, e);
            return ResponseEntity.status(500).body(new MessageResponse("Error occurred while deleting product"));
        }
    }
}