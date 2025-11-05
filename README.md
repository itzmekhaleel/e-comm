# MyKart E-commerce Platform

This is a full-stack e-commerce application built using:
- **Frontend**: ReactJS
- **Backend**: Spring Boot (Java)
- **Database**: MySQL

## Features Implemented

1. User Authentication (Login/Registration)
2. Product Management (CRUD operations)
3. Shopping Cart Functionality
4. Product Listing and Details
5. Responsive UI Components

## Project Structure

```
commerce/
├── backend/           # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ecommerce/mykart/
│   │   │   │   ├── controller/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   ├── security/
│   │   │   │   ├── dto/
│   │   │   │   └── MyKartApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── pom.xml
└── frontend/          # ReactJS Application
    ├── public/
    └── src/
        ├── components/
        ├── services/
        ├── App.js
        └── index.js
```

## Backend Setup

1. **Database Configuration**:
   - Make sure MySQL is installed and running
   - Create a database named `ecommerce_db`
   - Update `application.properties` with your database credentials if different from defaults

2. **Dependencies**:
   - Java 17 or higher
   - Maven

3. **Running the Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

## Frontend Setup

1. **Dependencies**:
   - Node.js (version 14 or higher)
   - npm

2. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Running the Frontend**:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?query={query}` - Search products
- `GET /api/products/category/{category}` - Get products by category
- `POST /api/products` - Create new product (requires authentication)
- `PUT /api/products/{id}` - Update product (requires authentication)
- `DELETE /api/products/{id}` - Delete product (requires authentication)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items?productId={id}&quantity={qty}` - Add item to cart
- `PUT /api/cart/items/{productId}?quantity={qty}` - Update item quantity
- `DELETE /api/cart/items/{productId}` - Remove item from cart
- `DELETE /api/cart` - Clear cart

## Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/profile` - User profile

## Technologies Used

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- JWT for authentication

### Frontend
- ReactJS
- React Router
- Axios for HTTP requests
- CSS for styling

## Future Enhancements

1. Implement order management system
2. Add payment integration
3. Implement product reviews and ratings
4. Add wishlist functionality
5. Implement admin dashboard for product management
6. Add search and filtering capabilities
7. Implement email notifications
8. Add image upload functionality for products

## Running the Application

1. Start the MySQL database server
2. Create the `ecommerce_db` database
3. Run the backend Spring Boot application
4. Install frontend dependencies and run the React application
5. Access the application at `http://localhost:3000`