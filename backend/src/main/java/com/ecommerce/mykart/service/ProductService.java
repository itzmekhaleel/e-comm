package com.ecommerce.mykart.service;

import com.ecommerce.mykart.model.Product;
import com.ecommerce.mykart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryContainingIgnoreCase(category);
    }

    public Optional<Product> getProductById(Long id) {
        System.out.println("Looking for product with ID: " + id);
        Optional<Product> product = productRepository.findById(id);
        System.out.println("Product found: " + product.isPresent());
        if (product.isPresent()) {
            System.out.println("Product details: " + product.get().getName());
        }
        return product;
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    public List<Product> sortProducts(List<Product> products, String sortBy, String sortDirection) {
        Comparator<Product> comparator = null;
        
        switch (sortBy) {
            case "price":
                comparator = Comparator.comparing(Product::getPrice);
                break;
            case "name":
                comparator = Comparator.comparing(Product::getName);
                break;
            default:
                // Default sorting by ID
                comparator = Comparator.comparing(Product::getId);
                break;
        }
        
        // Apply direction
        if ("desc".equalsIgnoreCase(sortDirection)) {
            comparator = comparator.reversed();
        }
        
        return products.stream().sorted(comparator).collect(Collectors.toList());
    }
}