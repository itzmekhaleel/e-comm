package com.ecommerce.mykart.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "email", length = 50, unique = true, nullable = false)
    private String email;

    @Column(name = "password", length = 120, nullable = false)
    private String password;

    @Column(name = "first_name", length = 20, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 20, nullable = false)
    private String lastName;
    
    // Ensure username is set to email when creating a new user
    @PrePersist
    public void prePersist() {
        if (this.username == null || this.username.isEmpty()) {
            this.username = this.email;
        }
    }
}