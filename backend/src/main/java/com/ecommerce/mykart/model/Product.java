package com.ecommerce.mykart.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "name")
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "category")
    private String category;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;
    
    @Column(name = "brand")
    private String brand;
    
    @Column(name = "model")
    private String model;
    
    @Column(name = "warranty")
    private String warranty;
    
    @Column(name = "rating")
    private Double rating;
    
    @Column(name = "discount_percentage")
    private Integer discountPercentage;

    public Product() {}

    public Product(String name, String description, BigDecimal price, String category, String imageUrl, Integer stockQuantity) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.stockQuantity = stockQuantity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public String getWarranty() {
        return warranty;
    }
    
    public void setWarranty(String warranty) {
        this.warranty = warranty;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public void setRating(Double rating) {
        this.rating = rating;
    }
    
    public Integer getDiscountPercentage() {
        return discountPercentage;
    }
    
    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
}