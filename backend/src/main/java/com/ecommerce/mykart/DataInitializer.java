package com.ecommerce.mykart;

import com.ecommerce.mykart.model.Product;
import com.ecommerce.mykart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if products already exist
        long productCount = productRepository.count();
        System.out.println("Current product count in database: " + productCount);
        
        if (productCount == 0) {
            // Create 100 sample products with realistic data
            List<Product> products = createSampleProducts();
            productRepository.saveAll(products);
            System.out.println("Added " + products.size() + " sample products to the database.");
            System.out.println("New product count in database: " + productRepository.count());
        } else {
            System.out.println("Products already exist in database. Skipping initialization.");
        }
    }

    private List<Product> createSampleProducts() {
        List<Product> products = new ArrayList<>();
        Random random = new Random();
        
        String[][] productData = {
            {"iPhone 15 Pro", "Electronics", "129999"},
            {"Samsung Galaxy S24", "Electronics", "99999"},
            {"MacBook Air M2", "Electronics", "119999"},
            {"Dell XPS 13", "Electronics", "89999"},
            {"Sony WH-1000XM5", "Electronics", "29999"},
            {"iPad Pro 12.9", "Electronics", "109999"},
            {"Apple Watch Series 9", "Electronics", "49999"},
            {"Nintendo Switch", "Electronics", "24999"},
            {"Instant Pot Duo", "Home & Kitchen", "9999"},
            {"KitchenAid Mixer", "Home & Kitchen", "34999"},
            {"Nespresso Machine", "Home & Kitchen", "14999"},
            {"Vitamix Blender", "Home & Kitchen", "19999"},
            {"Air Fryer", "Home & Kitchen", "12999"},
            {"Robot Vacuum", "Home & Kitchen", "29999"},
            {"Coffee Maker", "Home & Kitchen", "8999"},
            {"Pressure Cooker", "Home & Kitchen", "7999"},
            {"Nike Air Max", "Fashion", "12999"},
            {"Adidas Ultraboost", "Fashion", "14999"},
            {"Levi's Jeans", "Fashion", "3999"},
            {"Patagonia Jacket", "Fashion", "19999"},
            {"Ray-Ban Sunglasses", "Fashion", "14999"},
            {"Timex Watch", "Fashion", "2999"},
            {"H&M T-Shirt", "Fashion", "799"},
            {"Zara Dress", "Fashion", "4999"},
            {"Running Shoes", "Sports", "7999"},
            {"Yoga Mat", "Sports", "2999"},
            {"Dumbbell Set", "Sports", "14999"},
            {"Basketball", "Sports", "1999"},
            {"Tennis Racket", "Sports", "8999"},
            {"Fitness Tracker", "Sports", "3999"},
            {"Protein Powder", "Sports", "2999"},
            {"Water Bottle", "Sports", "1999"},
            {"Backpack", "Sports", "3999"},
            {"Harry Potter Set", "Books", "2999"},
            {"Bestseller Novel", "Books", "499"},
            {"Cookbook", "Books", "799"},
            {"Biography", "Books", "699"},
            {"Textbook", "Books", "3999"},
            {"Magazine Subscription", "Books", "1999"},
            {"Comic Book", "Books", "399"},
            {"Audiobook", "Books", "1499"},
            {"Face Cream", "Beauty", "2999"},
            {"Shampoo", "Beauty", "799"},
            {"Body Wash", "Beauty", "599"},
            {"Perfume", "Beauty", "4999"},
            {"Lipstick", "Beauty", "1999"},
            {"Makeup Kit", "Beauty", "3999"},
            {"Hair Dryer", "Beauty", "2999"},
            {"Electric Shaver", "Beauty", "3999"},
            {"Sunscreen", "Beauty", "899"},
            {"Action Figure", "Toys", "1999"},
            {"Board Game", "Toys", "2999"},
            {"Puzzle", "Toys", "1499"},
            {"Doll", "Toys", "2499"},
            {"Toy Car", "Toys", "999"},
            {"Building Blocks", "Toys", "3999"},
            {"Stuffed Animal", "Toys", "1999"},
            {"Musical Instrument", "Toys", "4999"},
            {"Car Battery", "Automotive", "7999"},
            {"Motor Oil", "Automotive", "1999"},
            {"Car Wax", "Automotive", "1499"},
            {"Tire Pressure Gauge", "Automotive", "799"},
            {"Jump Starter", "Automotive", "3999"},
            {"Car Charger", "Automotive", "1999"},
            {"GPS Navigator", "Automotive", "8999"},
            {"Dash Cam", "Automotive", "4999"},
            {"Bluetooth Speaker", "Electronics", "7999"},
            {"Wireless Earbuds", "Electronics", "12999"},
            {"Smart TV 55\"", "Electronics", "59999"},
            {"Gaming Mouse", "Electronics", "4999"},
            {"Mechanical Keyboard", "Electronics", "8999"},
            {"External Hard Drive", "Electronics", "6999"},
            {"Tablet", "Electronics", "24999"},
            {"Digital Camera", "Electronics", "39999"},
            {"Smart Home Hub", "Electronics", "9999"},
            {"Noise Cancelling Headphones", "Electronics", "19999"},
            {"Electric Kettle", "Home & Kitchen", "2999"},
            {"Rice Cooker", "Home & Kitchen", "4999"},
            {"Food Processor", "Home & Kitchen", "7999"},
            {"Stand Mixer", "Home & Kitchen", "14999"},
            {"Espresso Machine", "Home & Kitchen", "24999"},
            {"Air Purifier", "Home & Kitchen", "12999"},
            {"Humidifier", "Home & Kitchen", "3999"},
            {"Heater", "Home & Kitchen", "2999"},
            {"Fan", "Home & Kitchen", "1999"},
            {"LED Bulbs", "Home & Kitchen", "499"},
            {"Smart Bulb", "Home & Kitchen", "1499"},
            {"Curtains", "Home & Kitchen", "2999"},
            {"Bed Sheets", "Home & Kitchen", "1999"},
            {"Pillows", "Home & Kitchen", "1499"},
            {"Blanket", "Home & Kitchen", "2499"},
            {"Towels", "Home & Kitchen", "999"},
            {"Bath Mat", "Home & Kitchen", "799"},
            {"Trash Can", "Home & Kitchen", "1499"},
            {"Storage Bins", "Home & Kitchen", "1999"},
            {"Picture Frame", "Home & Kitchen", "999"},
            {"Clock", "Home & Kitchen", "1499"},
            {"Vase", "Home & Kitchen", "1999"},
            {"Candles", "Home & Kitchen", "499"},
            {"Plant Pot", "Home & Kitchen", "799"},
            {"Artificial Plant", "Home & Kitchen", "1499"},
            {"Wall Art", "Home & Kitchen", "2999"},
            {"Bookshelf", "Home & Kitchen", "4999"},
            {"Desk Lamp", "Home & Kitchen", "1999"},
            {"Alarm Clock", "Home & Kitchen", "999"}
        };

        for (int i = 0; i < 100; i++) {
            String[] productInfo = productData[i % productData.length];
            Product product = new Product();
            product.setName(productInfo[0]);
            product.setDescription("High-quality " + productInfo[0] + " with excellent features and durability. This premium product offers exceptional quality and performance. Designed with the user in mind, it provides a seamless experience for all your needs. Crafted with attention to detail, this product is built to last and deliver consistent results.");
            product.setPrice(new BigDecimal(productInfo[2]));
            product.setCategory(productInfo[1]);
            product.setImageUrl("https://picsum.photos/500/500?random=" + (i + 1));
            product.setStockQuantity((int) (Math.random() * 50) + 1);
            product.setBrand("MyKart");
            product.setModel(productInfo[0].replace(" ", "-"));
            product.setWarranty("1 Year Manufacturer Warranty");
            product.setRating(4.0 + Math.random() * 1.0); // Rating between 4.0 and 5.0
            
            // Add discount percentage (5% to 30%)
            int discount = 5 + (int)(Math.random() * 26); // Random discount between 5-30%
            product.setDiscountPercentage(discount);
            
            products.add(product);
        }
        
        return products;
    }
}